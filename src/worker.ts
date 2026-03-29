import { Hono } from "hono";

type EnvBindings = {
  ACCOUNT_ID: string;
  GATEWAY_ID: string;
  CF_AIG_TOKEN: string;
};

const app = new Hono<{ Bindings: EnvBindings }>();

app.get("/", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>chatspacr • Atom</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <style>
    body { background: #0a0a0a; }
    .chat-bubble { max-width: 75%; }
    .glass { background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(12px); }
  </style>
</head>
<body class="min-h-screen text-white flex flex-col">
  <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-24" id="chat"></div>

  <div class="px-4 pb-2 flex gap-2 overflow-x-auto">
    <button onclick="quickPrompt('Summarize my emails')" class="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-3xl whitespace-nowrap">📧 Summarize my emails</button>
    <button onclick="quickPrompt('What\'s on my calendar?')" class="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-3xl whitespace-nowrap">📅 What’s on my calendar?</button>
    <button onclick="quickPrompt('Create a reminder')" class="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-3xl whitespace-nowrap">⏰ Create a reminder</button>
    <button onclick="quickPrompt('Fetch GitHub data')" class="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-3xl whitespace-nowrap">🐙 Fetch GitHub data</button>
    <button onclick="quickPrompt('View Workers status')" class="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-3xl whitespace-nowrap">☁️ View Workers status</button>
    <button onclick="quickPrompt('Connect Google Drive')" class="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-3xl whitespace-nowrap">📁 Connect Google Drive</button>
  </div>

  <div class="fixed bottom-0 left-0 right-0 glass border-t border-white/10 p-4">
    <div class="flex items-center gap-3 max-w-3xl mx-auto">
      <button onclick="addFile()" class="text-2xl text-white/70 hover:text-white"><i class="fa-solid fa-plus"></i></button>
      <input id="message" type="text" placeholder="Message Atom..." class="flex-1 bg-white/10 rounded-3xl px-6 py-4 text-white placeholder:text-white/50 focus:outline-none" />
      <button onclick="sendMessage()" class="text-3xl text-white/70 hover:text-white"><i class="fa-solid fa-paper-plane"></i></button>
      <button onclick="startVoice()" class="text-3xl text-white/70 hover:text-white"><i class="fa-solid fa-microphone"></i></button>
    </div>
  </div>

  <script>
    async function requestAtom(message) {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      const data = await res.json()
      return data.reply || 'Sorry, something went wrong.'
    }

    async function sendMessage() {
      const input = document.getElementById('message')
      const text = input.value.trim()
      if (!text) return

      addMessage('user', text)
      input.value = ''

      const reply = await requestAtom(text)
      addMessage('atom', reply)
    }

    async function quickPrompt(prompt) {
      addMessage('user', prompt)
      const reply = await requestAtom(prompt)
      addMessage('atom', reply)
    }

    function addMessage(sender, text) {
      const chat = document.getElementById('chat')
      const row = document.createElement('div')
      row.className = sender === 'user' ? 'flex justify-end' : 'flex justify-start'

      const bubble = document.createElement('div')
      bubble.className = 'chat-bubble px-5 py-3 rounded-3xl ' + (sender === 'user' ? 'bg-blue-600' : 'glass')
      bubble.textContent = text

      row.appendChild(bubble)
      chat.appendChild(row)
      chat.scrollTop = chat.scrollHeight
    }

    function addFile() { alert('File upload coming soon (R2)') }
    function startVoice() { alert('Voice mode coming soon') }

    window.onload = () => {
      addMessage('atom', 'Hey, I’m Atom. What are we doing today?')
    }
  </script>
</body>
</html>`);
});

app.post("/chat", async (c) => {
  try {
    const { message } = await c.req.json<{ message?: string }>();
    const prompt = (message || "").trim();

    if (!prompt) {
      return c.json({ reply: "Please send a message first." }, 400);
    }

    const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${c.env.ACCOUNT_ID}/${c.env.GATEWAY_ID}/google-ai-studio/v1/models/gemini-2.5-flash:generateContent`;

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cf-aig-authorization": `Bearer ${c.env.CF_AIG_TOKEN}`,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return c.json({ reply: `Gateway error (${response.status}): ${errText.slice(0, 180)}` }, 502);
    }

    const data = await response.json<any>();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, something went wrong.";

    return c.json({ reply });
  } catch (error) {
    console.error("/chat handler failed", error);
    return c.json({ reply: "Unexpected error while talking to Atom." }, 500);
  }
});

export default app;
