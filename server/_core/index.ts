import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const statuses = ['In progress', 'To-do', 'In Review', 'Design Review', 'Rework', 'Done', 'Not Started', 'Blocked', 'On Hold', 'Archived'] as const;
type Status = (typeof statuses)[number];

const tasks: Array<{ id: number; title: string; status: Status; assignee: string; dueAt: string }> = [
  { id: 1, title: 'Guild Real Estate Portal', status: 'In progress', assignee: 'Keiffer', dueAt: '2026-04-02' },
  { id: 2, title: 'Leasing Analytics Panel', status: 'To-do', assignee: 'Ops Team', dueAt: '2026-04-03' },
  { id: 3, title: 'Brand Landing Refresh', status: 'Design Review', assignee: 'Design Team', dueAt: '2026-04-01' },
  { id: 4, title: 'Meta Lead Flow', status: 'In Review', assignee: 'Growth', dueAt: '2026-04-05' },
];

const integrations: Array<{ id: string; name: string; connected: boolean }> = [
  { id: 'github', name: 'GitHub', connected: true },
  { id: 'cloudflare', name: 'Cloudflare', connected: true },
  { id: 'botspace', name: 'BotSpace', connected: false },
  { id: 'instagram', name: 'Instagram', connected: false },
  { id: 'facebook', name: 'Facebook', connected: false },
  { id: 'whatsapp', name: 'WhatsApp', connected: false },
];

app.get('/api/dashboard', (_req, res) => {
  res.json({ room: 'Living Room', temperature: 68, humidity: 48.2, powerUsage: 72 });
});

app.get('/api/tasks', (_req, res) => {
  res.json(tasks);
});

app.patch('/api/tasks/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const nextStatus = req.body?.status as Status | undefined;
  if (!nextStatus || !statuses.includes(nextStatus)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  task.status = nextStatus;
  res.json(task);
});

app.get('/api/integrations', (_req, res) => {
  res.json(integrations);
});

app.post('/api/integrations/:id/connect', (req, res) => {
  const item = integrations.find((integration) => integration.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Integration not found' });
    return;
  }
  item.connected = true;
  res.json(item);
});

app.post('/api/integrations/:id/disconnect', (req, res) => {
  const item = integrations.find((integration) => integration.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Integration not found' });
    return;
  }
  item.connected = false;
  res.json(item);
});

app.post('/api/chat', (req, res) => {
  const prompt = String(req.body?.prompt ?? '').trim();
  if (!prompt) {
    res.status(400).json({ error: 'Prompt required' });
    return;
  }
  res.json({
    reply: `Received: "${prompt}". Backend is connected and ready for real LLM wiring.`,
  });
});

if (process.env.NODE_ENV === 'production') {
  const staticPath = path.resolve(__dirname, '../../dist/public');
  app.use(express.static(staticPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
