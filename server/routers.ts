import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { UNAUTHED_ERR_MSG } from "../shared/const";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

type ChatSession = {
  id: number;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
};

export type AppContext = {
  user: SessionUser | null;
  googleConnected: boolean;
};

const t = initTRPC.context<AppContext>().create({
  transformer: superjson,
});

const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: UNAUTHED_ERR_MSG,
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

const chatSessions: ChatSession[] = [];
let nextSessionId = 1;

const workersRouter = t.router({
  status: authedProcedure.query(() => ({
    workers: [
      { id: "worker-atom-api", name: "atom-api", status: "healthy" },
      { id: "worker-events", name: "event-normalizer", status: "healthy" },
    ],
  })),
  logs: authedProcedure
    .input(z.object({ workerId: z.string().optional().default("") }))
    .query(({ input }) => ({
      logs: [
        {
          id: "log-1",
          workerId: input.workerId || "worker-atom-api",
          message: "Worker heartbeat OK",
          level: "info",
          timestamp: new Date().toISOString(),
        },
      ],
    })),
});

const githubRouter = t.router({
  repos: authedProcedure.query(() => ({
    repos: [
      { id: 1, name: "atom-mobile", private: true },
      { id: 2, name: "atom-api", private: true },
    ],
  })),
  issues: authedProcedure.query(() => ({ issues: [] as Array<unknown> })),
  pullRequests: authedProcedure.query(() => ({ prs: [] as Array<unknown> })),
});

const googleRouter = t.router({
  getAuthUrl: authedProcedure.query(() => ({ authUrl: "/api/auth/sso/start" })),
  files: authedProcedure.query(({ ctx }) => {
    if (!ctx.googleConnected) {
      return { files: [], error: "Not authenticated" };
    }

    return {
      files: [
        { id: "g-1", name: "Product Requirements v0", mimeType: "application/vnd.google-apps.document" },
        { id: "g-2", name: "Atom Wireframes", mimeType: "application/pdf" },
      ],
      error: null,
    };
  }),
  saveToken: authedProcedure
    .input(z.object({ token: z.string().optional() }).optional())
    .mutation(() => ({ success: true })),
});

const chatRouter = t.router({
  createSession: authedProcedure
    .input(z.object({ title: z.string().optional() }).optional())
    .mutation(({ input }) => {
      const session: ChatSession = {
        id: nextSessionId++,
        title: input?.title || `Session ${nextSessionId}`,
        createdAt: new Date(),
        messages: [],
      };
      chatSessions.unshift(session);
      return { success: true, sessionId: session.id };
    }),
  getSessions: authedProcedure.query(() => ({
    sessions: chatSessions.map((session) => ({
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
    })),
  })),
  getMessages: authedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(({ input }) => {
      const session = chatSessions.find((item) => item.id === input.sessionId);
      return {
        messages:
          session?.messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.createdAt,
          })) ?? [],
      };
    }),
  sendMessage: authedProcedure
    .input(z.object({ sessionId: z.number(), message: z.string().min(1) }))
    .mutation(({ input }) => {
      const session = chatSessions.find((item) => item.id === input.sessionId);
      if (!session) {
        return { success: false, message: null, error: "Session not found" };
      }

      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: input.message,
        createdAt: new Date(),
      };
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: "Demo assistant response: backend is wired and ready for real model integration.",
        createdAt: new Date(),
      };
      session.messages.push(userMessage, reply);
      return { success: true, message: reply.content, error: null };
    }),
});

const authRouter = t.router({
  me: t.procedure.query(({ ctx }) => ctx.user),
  logout: t.procedure.mutation(() => ({ success: true })),
});

export const appRouter = t.router({
  auth: authRouter,
  workers: workersRouter,
  github: githubRouter,
  google: googleRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
