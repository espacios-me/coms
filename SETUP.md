# Flow — Setup & Deployment Guide

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/espacios-me/flow.git
cd flow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your actual API keys:

```
CLOUDFLARE_API_TOKEN=your_token_here
OPENAI_API_KEY=your_key_here
CLAUDE_API_KEY=your_key_here
# ... etc
```

### 4. Local Development

Start the development server:

```bash
npm run dev
```

The worker will be available at `http://localhost:8787`

### 5. Build for Production

```bash
npm run build
```

## Deployment

### Automatic Deployment (GitHub Actions)

1. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add all secrets from `.env.example`:
     - `CLOUDFLARE_API_TOKEN`
     - `CLOUDFLARE_ACCOUNT_ID`
     - `OPENAI_API_KEY`
     - `CLAUDE_API_KEY`
     - All other API keys...

2. **Push to Main:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **GitHub Actions will automatically:**
   - Install dependencies
   - Build the project
   - Deploy to Cloudflare Workers
   - Comment on PRs with deployment status

### Manual Deployment

If you need to deploy manually:

```bash
# Set your Cloudflare credentials
export CLOUDFLARE_API_TOKEN=your_token
export CLOUDFLARE_ACCOUNT_ID=your_account_id

# Deploy
npm run deploy
```

## API Keys Setup

### Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Profile → API Tokens
3. Create token with "Edit Cloudflare Workers" template
4. Copy the token to `CLOUDFLARE_API_TOKEN`
5. Get Account ID from Workers dashboard

### OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. API keys → Create new secret key
3. Copy to `OPENAI_API_KEY`

### Claude (Anthropic)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. API keys → Create new key
3. Copy to `CLAUDE_API_KEY`

### Google APIs

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable APIs:
   - Gmail API
   - Google Drive API
   - Google Calendar API
4. Create API keys for each service
5. Copy to respective environment variables

### Linear

1. Go to [linear.app/settings/api](https://linear.app/settings/api)
2. Create API key
3. Copy to `LINEAR_API_KEY`

### Vercel

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create new token
3. Copy to `VERCEL_API_KEY`

### OAuth Configuration

#### Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Authorized redirect URIs: `https://espacios.me/auth/google/callback`
5. Copy Client ID to `GOOGLE_OAUTH_CLIENT_ID`
6. Copy Client Secret to `GOOGLE_OAUTH_CLIENT_SECRET`

#### GitHub OAuth

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. New OAuth App
3. Authorization callback URL: `https://espacios.me/auth/github/callback`
4. Copy Client ID to `GITHUB_OAUTH_CLIENT_ID`
5. Copy Client Secret to `GITHUB_OAUTH_CLIENT_SECRET`

## Project Structure

```
flow/
├── src/
│   ├── index.ts          # Main Worker entry point
│   ├── auth.ts           # Authentication logic
│   └── guidelines.ts     # UI Guidelines page
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment
├── wrangler.jsonc        # Cloudflare Worker config
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── .env.example          # Environment template
└── README.md             # Project documentation
```

## Routes

| Route | Purpose | Auth Required |
|---|---|---|
| `/` | Redirect to `/plan` | No |
| `/signin` | Sign-in page (Google/GitHub OAuth) | No |
| `/auth/google/callback` | Google OAuth callback | No |
| `/auth/github/callback` | GitHub OAuth callback | No |
| `/logout` | Sign out | No |
| `/plan` | Atom Dashboard | Yes |
| `/plan/roadmap` | Development Roadmap | Yes |
| `/guidelines` | UI Guidelines (authenticated) | Yes |
| `/ui-guide` | UI Guidelines (public) | No |
| `/health` | Health check | No |

## Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Edit files in `src/`
   - Test locally with `npm run dev`

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request:**
   - GitHub Actions will run tests and create a deployment preview
   - Review the changes
   - Merge to `main` to deploy to production

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Fails

1. Check GitHub Actions logs
2. Verify all secrets are set in GitHub
3. Ensure `wrangler.jsonc` has correct account ID
4. Check Cloudflare dashboard for any issues

### Local Development Issues

```bash
# Clear Wrangler cache
rm -rf .wrangler

# Restart dev server
npm run dev
```

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Yes | Cloudflare API token for deployment |
| `CLOUDFLARE_ACCOUNT_ID` | Yes | Your Cloudflare account ID |
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT models |
| `CLAUDE_API_KEY` | Yes | Anthropic Claude API key |
| `FIREBASE_API_KEY` | Yes | Firebase API key for data storage |
| `GMAIL_API_KEY` | Yes | Gmail API key for email integration |
| `GOOGLE_DRIVE_API_KEY` | Yes | Google Drive API key |
| `LINEAR_API_KEY` | Yes | Linear API key for issue tracking |
| `VERCEL_API_KEY` | Yes | Vercel API key for deployment tracking |
| `GROK_API_KEY` | No | Grok API key for alternative AI |
| `WEBHOOK_API_KEY` | Yes | Webhook authentication key |
| `GOOGLE_OAUTH_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `GITHUB_OAUTH_CLIENT_ID` | Yes | GitHub OAuth client ID |
| `GITHUB_OAUTH_CLIENT_SECRET` | Yes | GitHub OAuth client secret |
| `OAUTH_REDIRECT_URI` | Yes | OAuth redirect URI (https://espacios.me) |
| `JWT_SECRET` | Yes | Secret key for JWT token signing |

## Support

For issues or questions:
- Check the [README.md](./README.md)
- Review [GitHub Issues](https://github.com/espacios-me/flow/issues)
- Contact: hello@espacios.me
