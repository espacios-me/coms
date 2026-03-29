import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { parse, serialize } from "cookie";
import { appRouter, type SessionUser } from "../routers";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 5173);

const sessions = new Map<string, SessionUser>();
const googleConnections = new Set<string>();

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get("/api/auth/sso/start", (req, res) => {
  const state = typeof req.query.state === "string" ? req.query.state : "";
  const redirect = `/api/oauth/callback${state ? `?state=${encodeURIComponent(state)}` : ""}`;
  res.redirect(302, redirect);
});

app.get("/api/oauth/callback", (req, res) => {
  const token = crypto.randomUUID();
  const devUser: SessionUser = {
    id: "dev-user-1",
    name: "Atom Dev",
    email: "atom.dev@example.com",
  };

  sessions.set(token, devUser);
  googleConnections.add(token);

  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: Math.floor(ONE_YEAR_MS / 1000),
    })
  );

  const state = typeof req.query.state === "string" ? req.query.state : "";
  let nextPath = "/";
  if (state) {
    try {
      const decoded = Buffer.from(state, "base64").toString("utf-8");
      const url = new URL(decoded);
      nextPath = `${url.pathname}${url.search}${url.hash}` || "/";
    } catch {
      nextPath = "/";
    }
  }

  res.redirect(302, nextPath);
});

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext({ req, res }) {
      const cookieHeader = req.headers.cookie || "";
      const cookies = parse(cookieHeader);
      const sessionToken = cookies[COOKIE_NAME] || "";
      const user = sessions.get(sessionToken) ?? null;

      if (req.path.includes("auth.logout")) {
        sessions.delete(sessionToken);
        googleConnections.delete(sessionToken);
        res.setHeader(
          "Set-Cookie",
          serialize(COOKIE_NAME, "", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
            expires: new Date(0),
          })
        );
      }

      return {
        user,
        googleConnected: googleConnections.has(sessionToken),
      };
    },
  })
);

async function start() {
  if (!isProd) {
    const vite = await createViteServer({
      root: path.join(repoRoot, "client"),
      server: { middlewareMode: true },
      appType: "spa",
      configFile: path.join(repoRoot, "vite.config.ts"),
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      try {
        const htmlPath = path.join(repoRoot, "client", "index.html");
        const raw = await fs.promises.readFile(htmlPath, "utf-8");
        const html = await vite.transformIndexHtml(req.originalUrl, raw);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  } else {
    const distPublic = path.join(repoRoot, "dist", "public");
    app.use(express.static(distPublic));
    app.use("*", (_req, res) => {
      res.sendFile(path.join(distPublic, "index.html"));
    });
  }

  app.listen(port, () => {
    console.log(`coms dev server running on http://localhost:${port}`);
  });
}

start();
