import { Hono } from "hono";

type Env = {
  ACCOUNT_ID: string;
  GATEWAY_ID: string;
  CF_AIG_TOKEN: string;
};

const app = new Hono<{ Bindings: Env }>();

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>chatspacr • Atom</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
      integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <style>
      :root {
        color-scheme: dark;
      }
      body {
        background: radial-gradient(circle at top, #141826 0%, #08090d 55%, #050507 100%);
      }
      .glass {
        background: rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .chat-scroll {
        scrollbar-width: thin;
        scrollbar-color: #3b82f6 #111827;
      }
      .chat-scroll::-webkit-scrollbar {
        width: 8px;
      }
      .chat-scroll::-webkit-scrollbar-thumb {
        background: #3b82f6;
        border-radius: 999px;
      }
    </style>
  </head>
  <body class="text-white min-h-screen">
    <main class="mx-auto max-w-md min-h-screen flex flex-col px-3 py-4">
      <header class="mb-3 px-1">
        <p class="text-sm tracking-wide text-zinc-300">chatspacr • Atom</p>
      </header>

      <section class="mb-3 overflow-x-auto pb-1">
        <div id="chips" class="flex gap-2 w-max">
          <button class="chip glass text-xs px-3 py-2 rounded-full">Summarize my emails</button>
          <button class="chip glass text-xs px-3 py-2 rounded-full">What's on my calendar?</button>
          <button class="chip glass text-xs px-3 py-2 rounded-full">Create a reminder</button>
          <button class="chip glass text-xs px-3 py-2 rounded-full">Fetch GitHub data</button>
          <button class="chip glass text-xs px-3 py-2 rounded-full">View Workers status</button>
          <button class="chip glass text-xs px-3 py-2 rounded-full">Connect Google Drive</button>
        </div>
      </section>

      <section id="chat" class="chat-scroll flex-1 overflow-y-auto space-y-3 pr-1 pb-28">
        <div class="flex justify-start">
          <div class="glass rounded-2xl rounded-tl-md px-4 py-3 max-w-[82%] text-sm leading-relaxed text-zinc-100">
            Hey, I'm Atom. What are we doing today?
          </div>
        </div>
      </section>

      <footer class="fixed bottom-0 left-0 right-0 pb-[max(env(safe-area-inset-bottom),0.8rem)] pt-2">
        <div class="mx-auto max-w-md px-3">
          <div class="glass rounded-2xl p-2 flex items-center gap-2">
            <button id="plusBtn" class="w-10 h-10 rounded-full glass text-zinc-200">
              <i class="fa-solid fa-plus"></i>
            </button>
            <input
              id="prompt"
              type="text"
              placeholder="Message Atom..."
              class="flex-1 h-11 rounded-full bg-black/40 border border-white/10 px-4 outline-none focus:border-blue-400 text-sm"
            />
            <button id="sendBtn" class="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors">
              <i class="fa-solid fa-arrow-up"></i>
            </button>
            <button id="micBtn" class="w-10 h-10 rounded-full glass text-zinc-100">
              <i class="fa-solid fa-microphone"></i>
            </button>
          </div>
        </div>
      </footer>
    </main>

    <script>
      const chat = document.getElementById('chat');
      const promptInput = document.getElementById('prompt');
      const sendBtn = document.getElementById('sendBtn');

      function appendBubble(role, text) {
        const wrap = document.createElement('div');
        wrap.className = role === 'user' ? 'flex justify-end' : 'flex justify-start';

        const bubble = document.createElement('div');
        if (role === 'user') {
          bubble.className = 'rounded-2xl rounded-tr-md px-4 py-3 max-w-[82%] text-sm leading-relaxed bg-blue-600 text-white';
        } else {
          bubble.className = 'glass rounded-2xl rounded-tl-md px-4 py-3 max-w-[82%] text-sm leading-relaxed text-zinc-100';
        }
        bubble.textContent = text;

        wrap.appendChild(bubble);
        chat.appendChild(wrap);
        chat.scrollTop = chat.scrollHeight;
      }

      async function sendMessage(message) {
        if (!message || !message.trim()) return;
        appendBubble('user', message);
        promptInput.value = '';

        try {
          const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
          });
          const data = await res.json();
          appendBubble('atom', data.reply || 'No reply returned.');
        } catch (err) {
          appendBubble('atom', 'Sorry — network issue while calling Atom.');
        }
      }

      sendBtn.addEventListener('click', () => sendMessage(promptInput.value));
      promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage(promptInput.value);
      });

      document.querySelectorAll('.chip').forEach((chip) => {
        chip.addEventListener('click', () => sendMessage(chip.textContent || ''));
      });

      document.getElementById('plusBtn').addEventListener('click', () => alert('R2 soon'));
      document.getElementById('micBtn').addEventListener('click', () => alert('Voice soon'));
    </script>
  </body>
</html>`;

app.get("/", (c) => c.html(html));

app.post("/chat", async (c) => {
  const { message } = await c.req.json<{ message?: string }>();

  if (!message || !message.trim()) {
    return c.json({ reply: "Please send a message." }, 400);
  }

  const { ACCOUNT_ID, GATEWAY_ID, CF_AIG_TOKEN } = c.env;
  const url = `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_ID}/google-ai-studio/v1/models/gemini-2.5-flash:generateContent`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cf-aig-authorization": `Bearer ${CF_AIG_TOKEN}`,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      }),
    });

    const data = (await upstream.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      error?: { message?: string };
    };

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.error?.message ||
      "Atom could not generate a response right now.";

    return c.json({ reply }, upstream.ok ? 200 : 502);
  } catch {
    return c.json({ reply: "Gateway request failed. Check Worker bindings and network." }, 500);
  }
});

export default app;
