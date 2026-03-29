# Command Center Dashboard - Deployment Guide

## Overview

The Command Center Dashboard is a full-stack application built with:
- **Frontend**: React 19 + Vite + Tailwind CSS (deployed on Cloudflare Pages)
- **Backend**: Express + tRPC (deployed on Cloudflare Workers)
- **Database**: MySQL/TiDB (managed via Manus platform)
- **APIs**: Cloudflare Workers, GitHub, Google Drive, Gemini AI

## Prerequisites

1. **Cloudflare Account** with:
   - Domain (e.g., espacios.me)
   - Cloudflare Pages enabled
   - Cloudflare Workers enabled
   - API token with appropriate permissions

2. **API Credentials** (already configured):
   - Gemini API Key
   - GitHub Personal Access Token
   - Cloudflare API Token
   - Google OAuth Client ID & Secret
   - Cloudflare Account ID

3. **Database Connection**:
   - MySQL/TiDB connection string (provided by Manus platform)

## Deployment Steps

### Step 1: Configure wrangler.toml

Update `wrangler.toml` with your Cloudflare settings:

```toml
account_id = "your-cloudflare-account-id"
zone_id = "your-domain-zone-id"

[env.production]
route = "espacios.me/coms"
zone_id = "your-domain-zone-id"
```

### Step 2: Set Environment Variables

Configure production environment variables in Cloudflare:

```bash
wrangler secret put DATABASE_URL
wrangler secret put GEMINI_API_KEY
wrangler secret put GITHUB_TOKEN
wrangler secret put CF_API_TOKEN
wrangler secret put CF_ACCOUNT_ID
wrangler secret put GOOGLE_OAUTH_CLIENT_ID
wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET
wrangler secret put JWT_SECRET
```

### Step 3: Build the Project

```bash
pnpm build
```

This generates:
- Frontend bundle in `client/dist/`
- Backend bundle in `dist/index.js`

### Step 4: Deploy to Cloudflare

#### Option A: Using Wrangler CLI

```bash
# Deploy to production
wrangler deploy --env production

# Deploy to staging
wrangler deploy --env development
```

#### Option B: Using GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm wrangler deploy --env production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Step 5: Configure DNS Routing

In Cloudflare Dashboard:

1. Go to your domain settings
2. Add a route for `/coms`:
   - Path: `espacios.me/coms`
   - Service: Command Center Worker
   - Zone: Your domain zone

3. Enable HTTPS redirect

### Step 6: Verify Deployment

Test all endpoints:

```bash
# Test Workers API
curl https://espacios.me/coms/api/trpc/workers.status

# Test GitHub API
curl https://espacios.me/coms/api/trpc/github.repos

# Test Google Drive API
curl https://espacios.me/coms/api/trpc/google.getAuthUrl

# Test Chat API
curl https://espacios.me/coms/api/trpc/chat.getSessions
```

## API Endpoints

All endpoints are accessed via tRPC at `/api/trpc/`:

### Workers
- `workers.status` - List active Cloudflare Workers
- `workers.logs` - Get Worker logs

### GitHub
- `github.repos` - List organization repositories
- `github.issues` - List open issues
- `github.pullRequests` - List open pull requests

### Google Drive
- `google.getAuthUrl` - Get OAuth consent URL
- `google.files` - List authorized Drive files
- `google.saveToken` - Save OAuth token

### AI Chat
- `chat.createSession` - Create new chat session
- `chat.getSessions` - List user sessions
- `chat.getMessages` - Get session messages
- `chat.sendMessage` - Send message and get AI response

## Monitoring & Troubleshooting

### View Logs

```bash
# Real-time logs
wrangler tail

# Specific environment
wrangler tail --env production
```

### Common Issues

1. **Database Connection Failed**
   - Verify DATABASE_URL is correct
   - Check database credentials in Cloudflare secrets
   - Ensure IP whitelist allows Cloudflare Workers

2. **OAuth Not Working**
   - Verify redirect URI matches `espacios.me/coms/api/google/callback`
   - Check Google OAuth credentials in secrets
   - Ensure cookies are enabled

3. **API Rate Limiting**
   - GitHub API: 60 requests/hour (unauthenticated), 5000/hour (authenticated)
   - Cloudflare API: Check rate limits in dashboard
   - Implement caching in KV for frequently accessed data

## Performance Optimization

### Caching Strategy

Use Cloudflare KV to cache:
- GitHub repository data (1 hour TTL)
- Worker status (5 minute TTL)
- Google Drive file list (30 minute TTL)

### Database Optimization

- Add indexes on frequently queried columns
- Use connection pooling
- Archive old chat sessions periodically

## Security Considerations

1. **Secrets Management**
   - Never commit secrets to git
   - Use Cloudflare Secrets Manager
   - Rotate API keys regularly

2. **OAuth Security**
   - Validate state parameter in callbacks
   - Use HTTPS only
   - Implement CSRF protection

3. **Database Security**
   - Use TLS for database connections
   - Encrypt sensitive data at rest
   - Implement row-level security

## Rollback Procedure

If deployment fails:

```bash
# Rollback to previous version
wrangler rollback --env production

# Or redeploy specific version
wrangler deploy --env production --compatibility-date 2026-03-29
```

## Next Steps

1. Configure custom domain (espacios.me)
2. Set up monitoring and alerting
3. Implement analytics tracking
4. Add CI/CD pipeline
5. Plan for auto-scaling
