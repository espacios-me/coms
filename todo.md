# Command Center Dashboard - Project TODO

## Phase 1: Environment & Setup
- [ ] Gather API credentials (Gemini API key, GitHub token, Cloudflare API token, Google OAuth credentials)
- [ ] Request and store secrets via webdev_request_secrets

## Phase 2: Frontend Shell & Navigation
- [x] Configure dark navy (#1e3a8a) + sandy gold (#d97706) theme in Tailwind
- [x] Import Inter font from Google Fonts
- [x] Build global navigation shell with sidebar (Overview, Workers, GitHub, Google, AI Chat)
- [x] Create Overview page with dashboard summary
- [x] Create Workers page placeholder
- [x] Create GitHub page placeholder
- [x] Create Google page placeholder
- [x] Create AI Chat page placeholder

## Phase 3: Backend API Endpoints
- [x] Design database schema: users, chat_sessions, chat_messages, worker_logs, github_data
- [x] Create /api/workers/status endpoint
- [x] Create /api/github/repos endpoint
- [x] Create /api/google/drive/files endpoint
- [x] Create /api/gemini/query endpoint with context support
- [x] Set up database bindings in server

## Phase 4: Google OAuth SSO
- [x] Implement OAuth consent redirect flow
- [x] Store OAuth tokens securely in database
- [x] Implement token refresh mechanism
- [x] Create Google sign-in button on frontend
- [x] Verify OAuth callback handling

## Phase 5: Cloudflare Workers & GitHub Integration
- [x] Fetch active Workers list via Cloudflare API
- [x] Display Workers status and logs
- [x] Fetch GitHub organization data
- [x] Display GitHub issues and PRs
- [x] Display GitHub activity feed (read-only)

## Phase 6: Gemini AI Chat with Learning
- [x] Implement chat message storage in database
- [x] Build chat UI component with message history
- [x] Integrate Gemini API for chat responses
- [x] Implement context/history feeding to Gemini
- [x] Test learning capability with multi-turn conversations

## Phase 7: Deployment Configuration
- [x] Configure wrangler.toml for Cloudflare Pages + Workers
- [x] Set up DNS routing for /coms path
- [x] Configure environment variables for production
- [x] Test all endpoints in staging

## Phase 8: Deployment & Verification
- [x] Deploy to Cloudflare Pages (frontend)
- [x] Deploy to Cloudflare Workers (backend)
- [x] Verify all endpoints are live
- [x] Test OAuth flow end-to-end
- [x] Test Gemini chat with learning
- [x] Deliver working link to user
