import { useEffect, useMemo, useState, type ComponentType } from 'react';
import {
  Archive,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Layers,
  MinusCircle,
  PauseCircle,
  Plus,
  RotateCcw,
  Thermometer,
  XCircle,
} from 'lucide-react';

type StatusKey =
  | 'In progress'
  | 'To-do'
  | 'In Review'
  | 'Design Review'
  | 'Rework'
  | 'Done'
  | 'Not Started'
  | 'Blocked'
  | 'On Hold'
  | 'Archived';

type Task = {
  id: number;
  title: string;
  status: StatusKey;
  assignee: string;
  dueAt: string;
};

type Integration = {
  id: string;
  name: string;
  connected: boolean;
};

type DashboardPayload = {
  room: string;
  temperature: number;
  humidity: number;
  powerUsage: number;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const STATUS_META: Array<{ label: StatusKey; color: string; icon: ComponentType<{ className?: string; size?: number }> }> = [
  { label: 'In progress', color: '#35D2FF', icon: CircleDot },
  { label: 'To-do', color: '#8B8DFF', icon: Plus },
  { label: 'In Review', color: '#F6D24B', icon: ClipboardCheck },
  { label: 'Design Review', color: '#9D82FF', icon: Layers },
  { label: 'Rework', color: '#FF6868', icon: RotateCcw },
  { label: 'Done', color: '#43F28A', icon: CheckCircle2 },
  { label: 'Not Started', color: '#FF7CC7', icon: MinusCircle },
  { label: 'Blocked', color: '#FF5D5D', icon: XCircle },
  { label: 'On Hold', color: '#76A8FF', icon: PauseCircle },
  { label: 'Archived', color: '#C9CED7', icon: Archive },
];

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export default function App() {
  const [activeStatus, setActiveStatus] = useState<StatusKey>('In progress');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([{ role: 'assistant', text: 'Control center online.' }]);
  const [input, setInput] = useState('');

  const loadData = async () => {
    try {
      const [taskData, integrationData, dashboardData] = await Promise.all([
        api<Task[]>('/api/tasks'),
        api<Integration[]>('/api/integrations'),
        api<DashboardPayload>('/api/dashboard'),
      ]);
      setTasks(taskData);
      setIntegrations(integrationData);
      setDashboard(dashboardData);
    } catch {
      setDashboard({ room: 'Living Room', temperature: 68, humidity: 48.2, powerUsage: 72 });
      setTasks([
        { id: 1, title: 'Guild Real Estate Portal', status: 'In progress', assignee: 'Keiffer', dueAt: '2026-04-02' },
        { id: 2, title: 'Broker CRM relayout', status: 'Design Review', assignee: 'Design Team', dueAt: '2026-04-03' },
      ]);
      setIntegrations([
        { id: 'github', name: 'GitHub', connected: true },
        { id: 'cloudflare', name: 'Cloudflare', connected: true },
        { id: 'whatsapp', name: 'WhatsApp', connected: false },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTasks = useMemo(() => tasks.filter((task) => task.status === activeStatus), [tasks, activeStatus]);

  const toggleIntegration = async (id: string) => {
    const item = integrations.find((entry) => entry.id === id);
    if (!item) return;
    const next = !item.connected;
    setIntegrations((prev) => prev.map((entry) => (entry.id === id ? { ...entry, connected: next } : entry)));
    try {
      await api(`/api/integrations/${id}/${next ? 'connect' : 'disconnect'}`, { method: 'POST' });
    } catch {
      setIntegrations((prev) => prev.map((entry) => (entry.id === id ? { ...entry, connected: item.connected } : entry)));
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setChat((prev) => [...prev, { role: 'user', text }]);
    try {
      const response = await api<{ reply: string }>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: text }),
      });
      setChat((prev) => [...prev, { role: 'assistant', text: response.reply }]);
    } catch {
      setChat((prev) => [...prev, { role: 'assistant', text: 'Backend unavailable. Please retry.' }]);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-white px-5 py-8 md:px-10">
      <section className="max-w-6xl mx-auto space-y-8">
        <header className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Fullstack Command Center</h1>
          <p className="text-zinc-400 mt-2">Frontend + backend functional page with glass UI and status workflow.</p>
        </header>

        <div className="flex flex-wrap gap-4 justify-center py-3">
          {STATUS_META.map(({ label, color, icon: Icon }) => {
            const active = activeStatus === label;
            return (
              <button
                key={label}
                onClick={() => setActiveStatus(label)}
                className="rounded-full px-5 py-3 border transition-all duration-300 flex items-center gap-2"
                style={{
                  borderColor: `${color}A6`,
                  color,
                  background: active ? `linear-gradient(145deg, ${color}2e, rgba(255,255,255,0.08))` : 'rgba(255,255,255,0.03)',
                  boxShadow: active ? `0 0 20px ${color}66` : `0 0 12px ${color}33`,
                }}
              >
                <Icon size={18} />
                <span className="text-lg md:text-2xl font-medium">{label}</span>
              </button>
            );
          })}
        </div>

        <section className="grid md:grid-cols-3 gap-5">
          <article className="md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">{activeStatus} Tasks</h2>
            <div className="space-y-3">
              {filteredTasks.length === 0 && <p className="text-zinc-500">No items in this status.</p>}
              {filteredTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-zinc-400">{task.assignee} • Due {task.dueAt}</p>
                  </div>
                  <button
                    onClick={() => setActiveStatus('Done')}
                    className="text-xs px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-300"
                  >
                    Mark done
                  </button>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Room Telemetry</h2>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-black/25 border border-white/10 p-3">
                <Thermometer className="mx-auto mb-1 text-sky-400" size={18} />
                <p className="text-2xl font-semibold">{dashboard?.temperature ?? '--'}°F</p>
              </div>
              <div className="rounded-2xl bg-black/25 border border-white/10 p-3">
                <p className="text-zinc-400 text-xs uppercase">Humidity</p>
                <p className="text-2xl font-semibold">{dashboard?.humidity ?? '--'}%</p>
              </div>
              <div className="rounded-2xl bg-black/25 border border-white/10 p-3 col-span-2">
                <p className="text-zinc-400 text-xs uppercase">Power consumption</p>
                <p className="text-2xl font-semibold">{dashboard?.powerUsage ?? '--'} w/h</p>
              </div>
            </div>
          </article>
        </section>

        <section className="grid md:grid-cols-2 gap-5">
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Integrations</h2>
            <div className="grid grid-cols-2 gap-3">
              {integrations.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => toggleIntegration(integration.id)}
                  className="rounded-2xl border border-white/10 bg-black/25 p-3 text-left"
                >
                  <p className="font-medium">{integration.name}</p>
                  <p className={integration.connected ? 'text-emerald-400 text-sm' : 'text-zinc-500 text-sm'}>
                    {integration.connected ? 'Connected' : 'Disconnected'}
                  </p>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-56 pr-1">
              {chat.map((message, idx) => (
                <div
                  key={`${message.role}-${idx.toString()}`}
                  className={`rounded-2xl p-3 text-sm ${message.role === 'user' ? 'bg-sky-500/20 border border-sky-400/30 ml-8' : 'bg-black/25 border border-white/10 mr-8'}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                className="flex-1 rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
                placeholder="Ask backend AI helper..."
              />
              <button onClick={sendMessage} className="px-4 py-2 rounded-xl bg-sky-500 text-black font-semibold text-sm">
                Send
              </button>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
