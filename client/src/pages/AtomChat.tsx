import { useMemo, useState } from "react";
import { Mic, Plus, SendHorizontal } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "atom";
  text: string;
};

const QUICK_PROMPTS = [
  "Summarize my emails",
  "What's on my calendar?",
  "Create a reminder",
  "Fetch GitHub data",
  "View Workers status",
  "Connect Google Drive",
];

export default function AtomChat() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "atom",
      text: "Hey, I'm Atom. What are we doing today?",
    },
  ]);

  const sendMessage = async (content: string) => {
    const message = content.trim();
    if (!message || sending) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: message,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = (await res.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "atom",
          text: data.reply || "No response from Atom.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "atom",
          text: "Network issue while contacting Atom.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const chatBody = useMemo(
    () =>
      messages.map((msg) => {
        const isUser = msg.role === "user";
        return (
          <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={
                isUser
                  ? "max-w-[82%] rounded-2xl rounded-tr-md bg-blue-600 px-4 py-3 text-sm text-white"
                  : "max-w-[82%] rounded-2xl rounded-tl-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 backdrop-blur"
              }
            >
              {msg.text}
            </div>
          </div>
        );
      }),
    [messages]
  );

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-3 py-4">
        <header className="mb-3 px-1">
          <p className="text-sm tracking-wide text-zinc-300">chatspacr • Atom</p>
        </header>

        <section className="mb-3 overflow-x-auto pb-1">
          <div className="flex w-max gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => void sendMessage(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-100 backdrop-blur transition hover:bg-white/10"
                disabled={sending}
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>

        <section className="flex-1 space-y-3 overflow-y-auto pb-28 pr-1">{chatBody}</section>

        <footer className="fixed bottom-0 left-0 right-0 pt-2 pb-[max(env(safe-area-inset-bottom),0.8rem)]">
          <div className="mx-auto max-w-md px-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
              <button
                onClick={() => alert("R2 soon")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200"
                aria-label="Add"
              >
                <Plus size={16} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void sendMessage(input);
                  }
                }}
                placeholder="Message Atom..."
                className="h-11 flex-1 rounded-full border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-blue-400"
              />

              <button
                onClick={() => void sendMessage(input)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-60"
                disabled={sending}
                aria-label="Send"
              >
                <SendHorizontal size={16} />
              </button>

              <button
                onClick={() => alert("Voice soon")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-100"
                aria-label="Voice"
              >
                <Mic size={16} />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
