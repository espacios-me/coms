import React, { useMemo, useRef, useState, useEffect } from "react";
import { 
  CalendarDays, 
  FolderOpen, 
  Github, 
  Mail, 
  Mic, 
  Plus, 
  Send, 
  Sparkles, 
  BellPlus, 
  Zap,
  MoreVertical,
  User,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Settings,
  LayoutGrid,
  ShieldCheck,
  BookOpen,
  Loader2,
  Cloud
} from "lucide-react";

const apiKey = "";

/**
 * Integration App Data
 */
const INTEGRATIONS = [
  { id: 'cloudflare', name: 'Cloudflare', category: 'Hosting', icon: Cloud, color: 'text-orange-500' },
  { id: 'google_drive', name: 'Google Drive', category: 'Storage', icon: FolderOpen, color: 'text-yellow-500' },
  { id: 'github', name: 'GitHub', category: 'Development', icon: Github, color: 'text-white' },
  { id: 'gmail', name: 'Gmail', category: 'Communication', icon: Mail, color: 'text-red-400' },
  { id: 'notion', name: 'Notion', category: 'Productivity', icon: BookOpen, color: 'text-neutral-300' },
  { id: 'calendar', name: 'Calendar', category: 'Productivity', icon: CalendarDays, color: 'text-blue-500' },
];

const quickPrompts = [
  { label: "Check Cloudflare status", icon: Cloud },
  { label: "Summarize my emails", icon: Mail },
  { label: "What’s on my calendar?", icon: CalendarDays },
  { label: "Fetch GitHub data", icon: Github },
];

/**
 * Chat Bubble Component
 */
function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] rounded-[24px] px-4 py-3 text-[15px] leading-relaxed shadow-lg backdrop-blur-md
          ${isUser ? "rounded-br-[4px] bg-blue-600 text-white" : "rounded-bl-[4px] border border-white/10 bg-white/5 text-white/90"}`}>
        {text}
      </div>
    </div>
  );
}

/**
 * App Settings / Integration View
 */
function IntegrationsView({ onBack, connectedApps, toggleApp }) {
  return (
    <div className="flex flex-col h-full bg-[#0A0D14] animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="px-6 pt-12 pb-6 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold">Apps & Integrations</h2>
        </div>
        <p className="mt-2 text-sm text-white/40">Connect your workspace tools to let Atom access your data securely.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Connected Tools</h3>
          <div className="grid gap-3">
            {INTEGRATIONS.map((app) => {
              const isConnected = connectedApps.includes(app.id);
              const Icon = app.icon;
              return (
                <div key={app.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04]">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 ${app.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{app.name}</h4>
                      <p className="text-xs text-white/30">{app.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleApp(app.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isConnected 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                      : "bg-white text-black hover:bg-white/90"
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-blue-200">Security & Privacy</h4>
              <p className="text-xs text-blue-200/60 mt-1 leading-relaxed">
                Atom uses enterprise-grade encryption for all data syncing. We never store your credentials. Data is fetched on-demand for processing.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Main App Component
 */
export default function App() {
  const [view, setView] = useState("chat"); // 'chat' or 'integrations'
  const [messages, setMessages] = useState([
    { id: "init-1", role: "assistant", text: "Hey — I’m Atom. Ready to sync your Drive and apps for better summaries today." },
    { id: "init-2", role: "assistant", text: "I noticed your Notion and Drive aren't linked yet. Want to connect them?" }
  ]);
  const [input, setInput] = useState("");
  const [connectedApps, setConnectedApps] = useState(['calendar', 'gmail']);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && view === "chat") {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, view]);

  const toggleApp = (id) => {
    setConnectedApps(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const fetchGeminiResponse = async (userText, history) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    // Convert previous messages to Gemini format
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: userText }] });

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: `You are Atom, an AI assistant. You currently have access to these connected apps: ${connectedApps.join(', ')}. Keep your answers concise, direct, and helpful.` }]
      }
    };

    // Exponential Backoff Retry Logic
    let delay = 1000;
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (res.ok) {
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
        }
      } catch (err) {
        if (i === 4) break;
      }
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
    return "Sorry, I'm having trouble connecting to my AI services right now.";
  };

  const handleSend = async (rawText) => {
    const text = rawText?.trim();
    if (!text || isLoading) return;

    const userMessage = { id: `user-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Fetch the AI response from Gemini
    const aiResponseText = await fetchGeminiResponse(text, messages);
    
    setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: "assistant", text: aiResponseText }]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#020408] sm:p-4 overflow-hidden font-sans text-white">
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden sm:h-[800px] sm:rounded-[40px] border border-white/10 bg-[#0A0D14] shadow-2xl">
        
        {view === "chat" ? (
          <>
            {/* Header */}
            <div className="absolute inset-x-0 top-0 z-30 border-b border-white/5 bg-[#0A0D14]/60 px-6 py-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Atom Pro</p>
                    <h1 className="text-xl font-bold text-white/95">chatspacr</h1>
                  </div>
                </div>
                <button 
                  onClick={() => setView("integrations")}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                  <LayoutGrid className="h-5 w-5 text-white/60" />
                  {connectedApps.length > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 border border-[#0A0D14]" />
                  )}
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-44 pt-32 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex flex-col gap-5">
                {messages.map((m) => <ChatBubble key={m.id} role={m.role} text={m.text} />)}
                {isLoading && (
                  <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="max-w-[85%] rounded-[24px] rounded-bl-[4px] border border-white/10 bg-white/5 px-4 py-3 shadow-lg backdrop-blur-md">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((p) => (
                    <button key={p.label} onClick={() => handleSend(p.label)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/10 transition-all">
                      <p.icon className="h-3.5 w-3.5 text-blue-400" />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Container */}
            <div className="absolute inset-x-0 bottom-0 z-40 p-4 pb-8 sm:pb-6">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
                <div className="flex items-center gap-2">
                  <button className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white/[0.05] text-white/60 hover:text-white transition-colors">
                    <Plus className="h-5 w-5" />
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                    placeholder="Ask about your drive, emails, or portfolio..."
                    className="flex-1 bg-transparent px-2 text-[15px] outline-none placeholder:text-white/30 disabled:opacity-50"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isLoading}
                    className={`flex h-12 w-12 items-center justify-center rounded-[20px] transition-all ${input.trim() && !isLoading ? "bg-blue-600 text-white" : "bg-white/5 text-white/20"}`}
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between px-3 pt-1 border-t border-white/5">
                   <div className="flex gap-2">
                      {connectedApps.slice(0, 3).map(appId => {
                        const app = INTEGRATIONS.find(a => a.id === appId);
                        return app ? <app.icon key={appId} className="h-3 w-3 text-white/20" /> : null;
                      })}
                   </div>
                   <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30 hover:text-white transition-colors">
                     <Mic className="h-3 w-3" /> Voice
                   </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <IntegrationsView 
            onBack={() => setView("chat")} 
            connectedApps={connectedApps} 
            toggleApp={toggleApp}
          />
        )}
      </div>
    </div>
  );
}
