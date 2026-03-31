import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  CircleDot, Plus, ClipboardCheck, Layers, RotateCcw, CheckCircle2,
  MinusCircle, XCircle, PauseCircle, Archive, ArrowLeft, Bell, Sparkles, Send,
  Loader2, X, Navigation, Share2, Lock, ShieldCheck,
} from 'lucide-react';

// --- Global Config ---
const apiKey = '';
const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';

// --- Mock Data ---
const MOCK_DATA: Record<string, Array<Record<string, unknown>>> = {
  'In progress': [
    { id: 1, title: 'Guild Real Estate Portal', client: 'Guild RE', deadline: '24h', progress: 65 },
    { id: 2, title: 'Dubai Bay Square Analytics', client: 'Internal', deadline: '3 days', progress: 40 },
  ],
  'Design Review': [
    { id: 5, title: 'Mobile App Revamp', highlights: ['Glassmorphism UI', 'SwiftUI'], exposure: 'Public Release' },
  ],
  Done: [
    { id: 8, title: 'Website Launch', completedDate: 'Oct 5, 2025', result: '100% SEO' },
  ],
};

const GoogleDriveLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M8.53 3.5h6.94l6.1 10.5h-6.94L8.53 3.5z" fill="#0066DA" />
    <path d="M1.53 15.5l3.47-6 6.1 10.5H4.17l-2.64-4.5z" fill="#00AC47" />
    <path d="M18.1 14l-3.47 6H2.4l3.47-6h12.23z" fill="#EA4335" />
    <path d="M15.47 3.5L12 9.5l-3.47-6h6.94z" fill="#00832D" />
    <path d="M22.47 14l-3.47 6-6.1-10.5 3.47-6 6.1 10.5z" fill="#FFBA00" />
    <path d="M15.47 3.5l3.47 6-6.1 10.5-3.47-6 6.1-10.5z" fill="#2684FC" />
  </svg>
);

const GooglePhotosLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 12a6 6 0 0 1-6-6h6v6z" fill="#EA4335" />
    <path d="M18 12a6 6 0 0 1-6 6v-6h6z" fill="#4285F4" />
    <path d="M12 6a6 6 0 0 1 6 6h-6V6z" fill="#FBBC05" />
    <path d="M6 12a6 6 0 0 1 6-6v6H6z" fill="#34A853" />
  </svg>
);

const GmailLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22 6.5V17.5C22 18.8807 20.8807 20 19.5 20H17V9L12 13L7 9V20H4.5C3.11929 20 2 18.8807 2 17.5V6.5C2 5.11929 3.11929 4 4.5 4H5L12 9.5L19 4H19.5C20.8807 4 22 5.11929 22 6.5Z" fill="#EA4335" />
  </svg>
);

const GoogleCalendarLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4Z" fill="#4285F4" />
    <rect x="3" y="10" width="18" height="12" rx="2" fill="white" fillOpacity="0.2" />
    <rect x="7" y="12" width="5" height="5" rx="1" fill="#4285F4" />
  </svg>
);

const GoogleWorkspaceLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4285F4" />
    <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#34A853" />
  </svg>
);

type IntegrationApp = {
  id: string;
  name: string;
  Logo: React.ComponentType<{ size?: number }>;
  color: string;
  authType: 'oauth' | 'qr';
};

const INTEGRATIONS_APPS: IntegrationApp[] = [
  { id: 'drive', name: 'Drive', Logo: GoogleDriveLogo, color: '#34A853', authType: 'oauth' },
  { id: 'photos', name: 'Photos', Logo: GooglePhotosLogo, color: '#4285F4', authType: 'oauth' },
  { id: 'mail', name: 'Gmail', Logo: GmailLogo, color: '#EA4335', authType: 'oauth' },
  { id: 'calendar', name: 'Calendar', Logo: GoogleCalendarLogo, color: '#4285F4', authType: 'oauth' },
  { id: 'workspace', name: 'Workspace', Logo: GoogleWorkspaceLogo, color: '#ffffff', authType: 'oauth' },
  {
    id: 'github', name: 'GitHub', color: '#ffffff', authType: 'oauth',
    Logo: ({ size = 32 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.59 2 12.25C2 16.28 4.87 19.74 8.84 20.81C9.34 20.91 9.5 20.63 9.5 20.38C9.5 20.15 9.49 19.48 9.49 18.65C6.73 19.3 6.14 17.34 6.14 17.34C5.68 16.17 5.03 15.85 5.03 15.85C4.12 15.2 5.1 15.3 5.1 15.3C6.1 15.37 6.63 16.3 6.63 16.3C7.5 17.9 9 17.45 9.5 17.2C9.59 16.5 9.9 15.99 10.25 15.73C7.72 15.47 5.1 14.45 5.1 10.75C5.1 9.64 5.49 8.72 6.16 8.02C6.06 7.76 5.72 6.7 6.25 5.25C6.25 5.25 7.12 4.97 9.5 6.45C10.32 6.23 11.16 6.12 12 6.12C12.84 6.12 13.68 6.23 14.5 6.45C16.88 4.97 17.75 5.25 17.75 5.25C18.28 6.7 17.94 7.76 17.84 8.02C18.51 8.72 18.9 9.64 18.9 10.75C18.9 14.46 16.27 15.47 13.74 15.73C14.17 16.07 14.5 16.77 14.5 17.88C14.5 19.48 14.49 20.65 14.49 20.81C14.49 21.06 14.65 21.32 15.16 21.21C19.13 19.74 22 16.28 22 12.25C22 6.59 17.52 2 12 2Z" fill="#ffffff"/></svg>
    ),
  },
  { id: 'cloudflare', name: 'Cloudflare', color: '#F4811F', authType: 'oauth', Logo: ({ size = 32 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 12C21.5 7.58 18.92 4 15.5 4C13.15 4 11.12 5.5 10.25 7.75C9.15 7.25 7.9 7 6.5 7C3.47 7 1 9.47 1 12.5C1 15.53 3.47 18 6.5 18H21.5C23.43 18 25 16.43 25 14.5C25 13.12 24.2 11.9 23 11.25C23.3 11.1 23.5 10.8 23.5 10.5C23.5 9.67 22.83 9 22 9C21.8 9 21.6 9.05 21.5 9.15V12Z" fill="#F4811F"/></svg> },
  { id: 'botspace', name: 'BotSpace', color: '#00D26A', authType: 'oauth', Logo: ({ size = 32 }) => <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill="#00D26A"/><circle cx="35" cy="50" r="18" fill="#ffffff"/><path d="M65 35 Q75 50 65 65" stroke="#ffffff" strokeWidth="12" strokeLinecap="round"/></svg> },
  { id: 'instagram', name: 'Instagram', color: '#E1306C', authType: 'qr', Logo: ({ size = 32 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" fill="url(#ig)" /><circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="2"/><circle cx="17" cy="7" r="1.5" fill="#fff"/><defs><linearGradient id="ig" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#F56040"/><stop offset="50%" stopColor="#C13584"/><stop offset="100%" stopColor="#405DE6"/></linearGradient></defs></svg> },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', authType: 'qr', Logo: ({ size = 32 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 12C24 5.37 18.63 0 12 0C5.37 0 0 5.37 0 12C0 17.99 4.44 22.9 10.13 23.8V15.38H7.22V12H10.13V9.38C10.13 6.44 11.91 4.75 14.6 4.75C15.9 4.75 17.13 5 17.13 5V8H15.8C14.5 8 14.13 8.9 14.13 9.75V12H17V15.38H14.13V23.8C19.56 22.9 24 17.99 24 12Z" fill="#1877F2"/></svg> },
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366', authType: 'qr', Logo: ({ size = 32 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.47 14.88C16.95 14.62 14.5 13.5 14 13.25C13.5 13 13.25 13 13 13.25C12.75 13.5 12 14.5 11.75 14.75C11.5 15 11.25 15 11 14.75C10.75 14.5 10 13.5 9.5 13.25C9 13 8.75 13 8.5 13.25C8 13.5 7.05 14.62 6.53 14.88C6 15.13 5.75 15.5 6.25 16.25C6.75 17 8.5 19 12 19C15.5 19 17.25 17 17.75 16.25C18.25 15.5 18 15.13 17.47 14.88Z" fill="#25D366"/><path d="M12 2C6.48 2 2 6.48 2 12C2 13.73 2.48 15.35 3.32 16.7L2 22L7.3 20.68C8.65 21.52 10.27 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#25D366"/></svg> },
  { id: 'slack', name: 'Slack', color: '#611F69', authType: 'oauth', Logo: () => <div className="text-3xl md:text-4xl drop-shadow-xl">💬</div> },
  { id: 'figma', name: 'Figma', color: '#F24E1E', authType: 'oauth', Logo: () => <div className="text-3xl md:text-4xl drop-shadow-xl">🟦</div> },
  { id: 'stripe', name: 'Stripe', color: '#635BFF', authType: 'oauth', Logo: () => <div className="text-3xl md:text-4xl drop-shadow-xl">₿</div> },
  { id: 'linear', name: 'Linear', color: '#5E6AD2', authType: 'oauth', Logo: () => <div className="text-3xl md:text-4xl drop-shadow-xl">↗</div> },
];

async function callGemini(prompt: string, systemInstruction = '') {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] } };
  for (let i = 0; i < 5; i += 1) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('API Error');
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (err) {
      if (i === 4) throw err;
      await new Promise((r) => { setTimeout(r, 2 ** i * 1000); });
    }
  }
  return null;
}

const SkyAtmosphere = ({ time }: { time: Date }) => {
  const hour = time.getHours();
  const getSkyBase = () => {
    if (hour >= 4 && hour < 7) return { top: '#1a1c2c', mid: '#4a192c' };
    if (hour >= 11 && hour < 16) return { top: '#00d2ff', mid: '#3a7bd5' };
    return { top: '#0a0b1e', mid: '#050505' };
  };
  const sky = getSkyBase();
  return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-[3000ms]"><div className="absolute inset-0 opacity-25" style={{ background: `radial-gradient(circle at 50% -20%, ${sky.top}, transparent), radial-gradient(circle at 100% 50%, ${sky.mid}, transparent), #000000` }} /><div className="absolute inset-0 bg-black/60" /></div>;
};

const GeminiDustSphere = ({ onClick, isAiOpen }: { onClick: () => void; isAiOpen: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const targetPos = useRef({ x: window.innerWidth - 80, y: window.innerHeight - 80 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};
    let animationFrameId = 0;
    const particles: DustParticle[] = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 150 : 350;
    const sphereRadius = isMobile ? 28 : 45;

    class DustParticle {
      x3d = 0;
      y3d = 0;
      z3d = 0;
      size = 0;
      speed = 0;
      opacity = 0;

      constructor() { this.reset(); }
      reset() {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        this.x3d = Math.sin(phi) * Math.cos(theta);
        this.y3d = Math.sin(phi) * Math.sin(theta);
        this.z3d = Math.cos(phi);
        this.size = Math.random() * 1.1 + 0.2;
        this.speed = (Math.random() * 0.006) + 0.003;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        const x = this.x3d;
        const z = this.z3d;
        this.x3d = x * Math.cos(this.speed) - z * Math.sin(this.speed);
        this.z3d = x * Math.sin(this.speed) + z * Math.cos(this.speed);
      }
      draw() {
        const scale = (this.z3d + 2) / 3;
        const center = isMobile ? 40 : 75;
        const x = center + this.x3d * sphereRadius * scale;
        const y = center + this.y3d * sphereRadius * scale;
        ctx.beginPath(); ctx.arc(x, y, this.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * scale})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i += 1) particles.push(new DustParticle());
    const render = () => {
      const dim = isMobile ? 80 : 150;
      ctx.clearRect(0, 0, dim, dim);
      if (Math.random() > 0.98) targetPos.current = { x: Math.random() * (window.innerWidth - dim) + dim / 2, y: Math.random() * (window.innerHeight - dim) + dim / 2 };
      positionRef.current.x += (targetPos.current.x - positionRef.current.x) * 0.02;
      positionRef.current.y += (targetPos.current.y - positionRef.current.y) * 0.02;
      if (containerRef.current) containerRef.current.style.transform = `translate(${positionRef.current.x - dim / 2}px, ${positionRef.current.y - dim / 2}px)`;
      particles.forEach((p) => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <div ref={containerRef} onClick={onClick} className={`fixed top-0 left-0 z-[100] cursor-pointer transition-opacity duration-1000 ${isAiOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ width: window.innerWidth < 768 ? '80px' : '150px', height: window.innerWidth < 768 ? '80px' : '150px' }}><canvas ref={canvasRef} width={window.innerWidth < 768 ? '80' : '150'} height={window.innerWidth < 768 ? '80' : '150'} className="drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" /></div>;
};

type LiquidProps = {
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }> | null;
  label: string;
  color: string;
  isActive?: boolean;
  isSmall?: boolean;
  onClick: (label: string) => void;
  index?: number;
  className?: string;
  isLoading?: boolean;
};

const LiquidGlassButton = ({ icon: Icon, label, color, isActive, isSmall, onClick, index = 0, className = '', isLoading = false }: LiquidProps) => (
  <div onClick={isLoading ? undefined : () => onClick(label)} className={`relative group transition-all duration-500 cursor-pointer select-none ${isSmall ? 'scale-75 md:scale-90' : 'scale-[0.85] md:scale-100'} ${isActive ? 'translate-y-[-4px]' : 'hover:translate-y-[-4px] active:scale-95'} ${className} ${isLoading ? 'pointer-events-none opacity-80' : ''}`} style={{ animation: isActive || isLoading ? 'none' : 'float 6s ease-in-out infinite', animationDelay: `${index * 0.2}s` }}>
    <div className="absolute inset-0 translate-y-[4px] rounded-full opacity-30 blur-[4px] transition-all duration-500 group-hover:translate-y-[6px]" style={{ backgroundColor: color }} />
    <div className={`relative flex items-center gap-2 md:gap-3 rounded-full border border-white/10 backdrop-blur-3xl overflow-hidden transition-all duration-500 ${isSmall ? 'px-3 py-1.5 md:px-4 md:py-2' : 'px-6 py-3 md:px-8 md:py-4'}`} style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.95) 100%)', boxShadow: isActive ? `0 15px 35px -5px ${color}66, inset 0 0 20px ${color}44` : '0 8px 15px -5px rgba(0,0,0,0.8)' }}>
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />
      <div className="relative z-10" style={{ color: isActive ? '#fff' : color }}>{isLoading ? <Loader2 size={isSmall ? 14 : 20} className="animate-spin text-white" /> : Icon ? <Icon size={isSmall ? 14 : 20} strokeWidth={2.5} className="md:w-[22px] md:h-[22px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" /> : null}</div>
      <span className={`relative z-10 font-black tracking-tight whitespace-nowrap text-[12px] md:text-base italic transition-opacity ${isLoading ? 'opacity-50' : ''}`} style={{ color: isActive ? '#fff' : `${color}dd` }}>{isLoading ? 'UPLINKING...' : label}</span>
    </div>
  </div>
);

export default function App() {
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Void Protocol Terminal v11.0. Debug complete. Architectural alignment optimized for Room 304, Keiffer.' }]);
  const [connectedApps, setConnectedApps] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('connectedApps');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedApp, setSelectedApp] = useState<IntegrationApp | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { localStorage.setItem('connectedApps', JSON.stringify(connectedApps)); }, [connectedApps]);
  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setAiLoading(true);
    try {
      const systemPrompt = `You are Gemini. User: Keiffer. Client: Guild Real Estate. Address: Room 304, Business Bay, Dubai. Connected Apps: ${Object.keys(connectedApps).join(', ') || 'None'}.`;
      const response = await callGemini(userText, systemPrompt);
      setMessages((prev) => [...prev, { role: 'assistant', text: response || 'Logic loop break.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Signal lost.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const statuses = [
    { label: 'In progress', icon: CircleDot, color: '#00f2ff' },
    { label: 'Integrations', icon: Share2, color: '#ffffff' },
    { label: 'To-do', icon: Plus, color: '#7c3aed' },
    { label: 'In Review', icon: ClipboardCheck, color: '#facc15' },
    { label: 'Design Review', icon: Layers, color: '#c084fc' },
    { label: 'Rework', icon: RotateCcw, color: '#f87171' },
    { label: 'Done', icon: CheckCircle2, color: '#22c55e' },
    { label: 'Not Started', icon: MinusCircle, color: '#f472b6' },
    { label: 'Blocked', icon: XCircle, color: '#ef4444' },
    { label: 'On Hold', icon: PauseCircle, color: '#3b82f6' },
    { label: 'Archived', icon: Archive, color: '#94a3b8' },
  ];

  const currentStatusData = useMemo(() => statuses.find((s) => s.label === activeStatus), [activeStatus]);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-white/10">
      <style>{`@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } } .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <SkyAtmosphere time={time} />
      <div className="relative z-10 container mx-auto px-6 py-10 max-w-7xl">
        <header className="flex justify-between items-start mb-20 md:mb-32"><div><h1 className="text-3xl md:text-6xl font-black tracking-tighter italic">Hi Keiffer.</h1><div className="flex flex-wrap items-center gap-3 mt-4 text-[9px] font-black uppercase tracking-[0.5em] text-zinc-500"><div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5"><Navigation size={10} className="text-cyan-500" /><span>Dubai // Room 304</span></div><span className="text-zinc-400 font-mono">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{Object.keys(connectedApps).length > 0 && <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 text-green-500"><ShieldCheck size={10} /><span>SECURE SESSION ACTIVE</span></div>}</div></div><div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative active:scale-90 transition-all cursor-pointer"><Bell size={18} className="text-zinc-400" /><div className="absolute top-3 right-3 w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#22d3ee]" /></div></header>

        {!activeStatus ? <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-1000"><div className="flex flex-wrap justify-center gap-4 md:gap-10 max-w-5xl">{statuses.map((s, i) => <LiquidGlassButton key={s.label} {...s} index={i} onClick={setActiveStatus} />)}</div></div> : <div className="animate-in fade-in slide-in-from-bottom-8 duration-500"><div className="flex items-center gap-4 mb-16 overflow-x-auto no-scrollbar pb-8 border-b border-white/[0.03]"><button onClick={() => setActiveStatus(null)} className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white active:scale-90 transition-all"><ArrowLeft size={24} /></button><div className="flex gap-4 pr-10">{statuses.map((s, i) => <LiquidGlassButton key={s.label} {...s} index={i} isSmall isActive={activeStatus === s.label} onClick={setActiveStatus} />)}</div></div>
            {activeStatus === 'Integrations' ? <section className="text-center py-12 md:py-20 animate-in zoom-in duration-1000"><div className="inline-flex flex-col items-center max-w-5xl w-full"><p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.6em] mb-12">Your Connected Workspace</p><div className="grid grid-cols-3 md:grid-cols-5 gap-8 md:gap-12">{INTEGRATIONS_APPS.map((app) => { const isConnected = !!connectedApps[app.id]; return <div key={app.id} onClick={() => !isConnected && setSelectedApp(app)} className={`group flex flex-col items-center gap-6 cursor-pointer active:scale-95 transition-all ${isConnected ? 'grayscale-0' : 'grayscale opacity-50 hover:opacity-100'}`}><div className={`w-20 h-20 md:w-28 md:h-28 flex items-center justify-center rounded-[2.5rem] bg-white/[0.03] border backdrop-blur-3xl transition-all relative overflow-hidden shadow-2xl ${isConnected ? 'border-green-500/50' : 'border-white/5 group-hover:border-white/20'}`}><div className={`relative z-10 transition-all duration-700 ${isConnected ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}`}><app.Logo size={window.innerWidth < 768 ? 32 : 44} /></div>{!isConnected && <div className="absolute top-3 right-3"><Lock size={14} className="text-zinc-400" /></div>}{isConnected && <CheckCircle2 size={18} className="absolute -top-2 -right-2 text-green-500 bg-black rounded-full" />}</div><span className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest">{app.name}</span></div>; })}</div><div className="mt-20 text-[10px] font-mono text-zinc-600 flex items-center justify-center gap-3 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full"><span className="bg-green-500/10 text-green-400 px-3 py-1 rounded border border-green-500/20 font-black tracking-widest">MEMORY LIVE</span><span>Hosted on Cloudflare • Persistent across sessions</span></div></div></section> : <><header className="mb-16"><div className="flex items-center gap-4 mb-6"><div className="w-12 h-1 rounded-full" style={{ backgroundColor: currentStatusData?.color, boxShadow: `0 0 15px ${currentStatusData?.color}` }} /><span className="text-[11px] font-black tracking-[0.6em] text-zinc-600 uppercase">Sector Terminal</span></div><h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic">{activeStatus}</h2></header><main className="space-y-8 md:space-y-12 pb-40">{(MOCK_DATA[activeStatus] || []).map((item) => <div key={item.id as number} className="relative group bg-[#030303] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 overflow-hidden transition-all duration-700 hover:border-white/10 shadow-2xl"><div className="absolute -right-40 -top-40 w-96 h-96 blur-[150px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" style={{ backgroundColor: currentStatusData?.color }} /><div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" /><h3 className="text-white text-2xl md:text-4xl font-black mb-3 tracking-tighter italic">{item.title as string}</h3><p className="text-zinc-600 font-black uppercase text-[10px] md:text-[12px] tracking-[0.3em]">{(item.client || item.for) as string}</p></div>)}</main></>}</div>}
      </div>

      <GeminiDustSphere onClick={() => setIsAiOpen(true)} isAiOpen={isAiOpen} />
      {selectedApp && <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"><div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={() => !isLinking && setSelectedApp(null)} /><div className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-[3rem] p-10 animate-in zoom-in duration-500 shadow-[0_0_100px_rgba(0,0,0,1)]"><div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" /><div className="flex flex-col items-center text-center relative z-10"><div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl"><selectedApp.Logo size={40} /></div><h2 className="text-4xl font-black tracking-tighter mb-2 italic text-white">{selectedApp.name}</h2>{selectedApp.authType === 'qr' ? <div className="my-8 w-full"><div className="bg-white p-4 rounded-3xl mx-auto w-56 h-56 flex items-center justify-center shadow-inner"><div className="text-center w-full h-full flex flex-col items-center justify-center"><p className="font-mono text-[10px] font-black text-black mb-3 tracking-widest">SCAN WITH {selectedApp.name.toUpperCase()} APP</p><div className="w-36 h-36 mx-auto bg-black rounded-xl grid grid-cols-9 gap-[1px] p-2 relative">{Array.from({ length: 81 }).map((_, i) => <div key={i.toString()} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} />)}</div></div></div><p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase mt-6">or tap below to open in app</p></div> : <div className="my-8 w-full flex flex-col gap-4"><p className="text-zinc-500 text-sm font-medium leading-relaxed mb-4 px-4">Uplink to synchronize your {selectedApp.name} assets securely with the Room 304 terminal.</p><LiquidGlassButton icon={null} label={`CONNECT ${selectedApp.name.toUpperCase()}`} color={selectedApp.color} isLoading={isLinking} onClick={() => { setIsLinking(true); setTimeout(() => { setConnectedApps((prev) => ({ ...prev, [selectedApp.id]: true })); setIsLinking(false); setSelectedApp(null); }, 1500); }} /></div>}<button disabled={isLinking} onClick={() => setSelectedApp(null)} className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 hover:text-zinc-500 transition-colors py-4">Cancel Uplink</button></div><div className="absolute -bottom-20 -left-20 w-60 h-60 blur-[80px] rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: selectedApp.color }} /></div></div>}

      <div className={`fixed inset-0 z-[110] transition-all duration-700 ${isAiOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}><div className="absolute inset-0 bg-black/85 backdrop-blur-3xl" onClick={() => setIsAiOpen(false)} /><div className={`absolute right-0 top-0 bottom-0 w-full md:max-w-md bg-[#020202] border-l border-white/5 transition-transform duration-700 ${isAiOpen ? 'translate-x-0' : 'translate-x-full'}`}><div className="flex flex-col h-full"><div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/50"><div className="flex items-center gap-4"><Sparkles className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" size={24} /><h3 className="text-white font-black text-xl tracking-tighter uppercase italic">Intelligence</h3></div><button onClick={() => setIsAiOpen(false)} className="text-zinc-700 hover:text-white p-2"><X size={32} /></button></div><div className="flex-grow p-8 md:p-10 overflow-y-auto no-scrollbar space-y-10">{messages.map((msg, idx) => <div key={idx.toString()} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[90%] p-6 rounded-3xl border ${msg.role === 'user' ? 'bg-white/5 border-white/10 text-white font-bold' : 'bg-zinc-900/40 border-white/5 text-zinc-400 font-medium'}`}><p className="text-[15px] leading-relaxed">{msg.text}</p></div></div>)}{aiLoading && <div className="text-xs text-zinc-500">Thinking…</div>}<div ref={chatEndRef} /></div><div className="p-10 border-t border-white/5 bg-black/50"><div className="relative group"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Communicate with Core..." className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-white/20 transition-all font-bold text-sm tracking-tight" /><button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-xl active:scale-95 transition-all"><Send size={20} /></button></div></div></div></div></div>
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-50" />
    </div>
  );
}
