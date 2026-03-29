# BotSpace ID: botspace_5ed2f2b9-d7e2-444f-9dee-3411273c5848

> **Design System:** This repository follows the [espacios.me](https://espacios.me) high-contrast minimalist design system.

# Flow — Atom Second Brain

A personal AI context engine that integrates with all your digital touchpoints to build a comprehensive understanding of who you are, what you care about, and how you operate.

## Features

- **Email Intelligence:** Analyze your Gmail to understand communication patterns
- **Document Memory:** Index Google Drive files and extract knowledge
- **Task Intelligence:** Track Linear issues and project workflows
- **Deployment Tracking:** Monitor Vercel builds and performance
- **Context Engine:** Claude/OpenAI-powered analysis of your digital life
- **Chat Interface:** Ask Atom questions about yourself and get insights
- **Native Apps:** Desktop (Electron) and mobile (React Native) applications
- **Health Monitoring:** Real-time performance tracking and error detection

## Routes

- **`/atom-dash`** — Neural Dashboard (your Second Brain interface)
- **`/atom-roadmap`** — Development roadmap and timeline
- **`/health`** — Service health check
- **`/api/ingest/:source`** — Webhook ingestion endpoint for `gmail`, `google_drive`, and `linear`
- **`/api/events`** — Authenticated feed of recent normalized events

## Architecture

### Data Ingestion Layer
- Gmail API for email analysis
- Google Drive API for document indexing
- Linear API for task tracking
- Vercel API for deployment monitoring
- WhatsApp Business API for messaging
- Google Calendar for scheduling

### Context Engine
- Claude API for advanced reasoning
- OpenAI API for text analysis
- Pattern recognition and relationship mapping
- Sentiment analysis and insights generation

### Storage
- Drizzle ORM for structured data
- Firebase for secure credential storage
- Real-time sync for all integrations

### Deployment
- Cloudflare Workers for API backend
- Cloudflare Pages for frontend
- GitHub Actions for CI/CD

## Getting Started

### Prerequisites
- Node.js 18+
- Wrangler CLI
- All API keys configured (see `.env.example`)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Deployment

```bash
npm run deploy
```

## Environment Variables

Required API keys:
- `OPENAI_API_KEY` — OpenAI API
- `CLAUDE_API_KEY` — Anthropic Claude
- `FIREBASE_API_KEY` — Firebase
- `GMAIL_API_KEY` — Gmail API
- `GOOGLE_DRIVE_API_KEY` — Google Drive API
- `LINEAR_API_KEY` — Linear API
- `VERCEL_API_KEY` — Vercel API
- `CLOUDFLARE_API_KEY` — Cloudflare API
- `GROK_API_KEY` — Grok API
- `WEBHOOK_API_KEY` — Webhook authentication

## Project Roadmap

### Phase 1 API Execution Notes
- Ingestion supports `gmail`, `google_drive`, and `linear`
- Request authentication via `x-api-key` or `Authorization: Bearer <WEBHOOK_API_KEY>`
- Sensitive keys (`token`, `secret`, `api_key`, etc.) are redacted during normalization
- Idempotent dedupe key shape: `<source>:<userId>:<sourceEventId>`


### Phase 1: Foundation ✓
- API setup and configuration
- Database schema
- Webhook handlers

### Phase 2: Data Ingestion
- Gmail integration
- Google Drive integration
- Linear integration
- Vercel integration
- Real-time sync

### Phase 3: Context Engine
- Claude API wrapper
- OpenAI integration
- Profile analysis
- Pattern recognition

### Phase 4: Dashboard UI
- React web interface
- Glassmorphism design
- 3D Atom logo
- Chat interface

### Phase 5: Native Apps
- Electron desktop app
- React Native mobile app
- Native notifications
- Offline sync

### Phase 6: Health Monitoring
- Error tracking (Sentry)
- Performance monitoring
- Uptime checks
- Analytics

### Phase 7: Deployment
- Cloudflare Workers setup
- GitHub Actions CI/CD
- Database migrations
- Backup procedures

### Phase 8: Security
- Rate limiting
- Encryption at rest
- Audit logging
- Privacy controls

### Phase 9: Testing & QA
- Unit tests
- Integration tests
- E2E tests
- Performance testing

### Phase 10: Launch
- Documentation
- Marketing materials
- Public release

## Security

All API keys are encrypted and stored securely. Personal data is encrypted at rest and never shared with third parties. Users have full control over their data and can export or delete it anytime.

## License

Proprietary — Espacios.me

## Contact

hello@espacios.me
