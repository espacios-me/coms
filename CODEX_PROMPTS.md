# Codex Prompts — Phase 2: Data Ingestion Layer

Use these prompts with Codex to generate production-ready code for the Atom Second Brain.

---

## Prompt 1: Gmail API Integration

**File:** `src/integrations/gmail.ts`

```
Create a TypeScript module for Gmail API integration in a Cloudflare Worker.

Requirements:
1. Function to authenticate with Gmail API using OAuth2 access token
2. Function to fetch emails with pagination (limit 50 per request)
3. Function to fetch email labels
4. Function to fetch email threads
5. Function to search emails by query
6. Error handling for rate limits and authentication failures
7. Type definitions for Gmail responses

The module should:
- Export async functions for each Gmail operation
- Accept Gmail API key from environment variables
- Return typed responses matching Gmail API schema
- Include retry logic for failed requests
- Log errors but not sensitive data

Example function signatures:
- async function getEmails(pageToken?: string): Promise<GmailEmail[]>
- async function getLabels(): Promise<GmailLabel[]>
- async function searchEmails(query: string): Promise<GmailEmail[]>
- async function getThread(threadId: string): Promise<GmailThread>

Use the Gmail API v1 REST endpoints.
```

---

## Prompt 2: Google Drive API Integration

**File:** `src/integrations/drive.ts`

```
Create a TypeScript module for Google Drive API integration in a Cloudflare Worker.

Requirements:
1. Function to list files and folders with pagination
2. Function to get file metadata (name, size, modified date, owner)
3. Function to search files by name or type
4. Function to get folder contents recursively
5. Function to get file download URL
6. Error handling for authentication and rate limits
7. Type definitions for Drive responses

The module should:
- Export async functions for each Drive operation
- Accept Google Drive API key from environment variables
- Return typed responses matching Drive API schema
- Include retry logic for failed requests
- Support filtering by file type (documents, spreadsheets, images, etc.)

Example function signatures:
- async function listFiles(folderId?: string, pageToken?: string): Promise<DriveFile[]>
- async function searchFiles(query: string): Promise<DriveFile[]>
- async function getFileMetadata(fileId: string): Promise<DriveFile>
- async function getFolderContents(folderId: string): Promise<DriveFile[]>

Use the Google Drive API v3 REST endpoints.
```

---

## Prompt 3: Linear API Integration

**File:** `src/integrations/linear.ts`

```
Create a TypeScript module for Linear API integration in a Cloudflare Worker.

Requirements:
1. Function to fetch issues with filters and pagination
2. Function to fetch projects
3. Function to fetch team members
4. Function to fetch issue comments
5. Function to search issues by query
6. Function to get issue details
7. Error handling for authentication and rate limits
8. Type definitions for Linear responses

The module should:
- Export async functions for each Linear operation
- Accept Linear API key from environment variables
- Use GraphQL queries for efficient data fetching
- Return typed responses matching Linear schema
- Include retry logic for failed requests
- Support filtering by status, assignee, project, etc.

Example function signatures:
- async function getIssues(filters?: IssueFilters): Promise<LinearIssue[]>
- async function getProjects(): Promise<LinearProject[]>
- async function getIssueDetails(issueId: string): Promise<LinearIssue>
- async function searchIssues(query: string): Promise<LinearIssue[]>
- async function getTeamMembers(): Promise<LinearUser[]>

Use the Linear API GraphQL endpoint.
```

---

## Prompt 4: Vercel API Integration

**File:** `src/integrations/vercel.ts`

```
Create a TypeScript module for Vercel API integration in a Cloudflare Worker.

Requirements:
1. Function to fetch deployments with pagination
2. Function to fetch builds for a project
3. Function to get deployment status
4. Function to list projects
5. Function to get project details
6. Function to fetch deployment logs
7. Error handling for authentication and rate limits
8. Type definitions for Vercel responses

The module should:
- Export async functions for each Vercel operation
- Accept Vercel API key from environment variables
- Return typed responses matching Vercel API schema
- Include retry logic for failed requests
- Support filtering by status, date range, etc.

Example function signatures:
- async function getDeployments(projectId?: string, limit?: number): Promise<VercelDeployment[]>
- async function getProjects(): Promise<VercelProject[]>
- async function getDeploymentStatus(deploymentId: string): Promise<VercelDeployment>
- async function getProjectDetails(projectId: string): Promise<VercelProject>
- async function getDeploymentLogs(deploymentId: string): Promise<string>

Use the Vercel API v12 REST endpoints.
```

---

## Prompt 5: Data Normalization Layer

**File:** `src/services/dataNormalizer.ts`

```
Create a TypeScript module for normalizing data from multiple sources into a unified schema.

Requirements:
1. Define a unified data model for:
   - Communications (emails, messages, comments)
   - Tasks (issues, todos, reminders)
   - Files (documents, spreadsheets, images)
   - People (contacts, team members, collaborators)
   - Projects (repositories, workspaces, teams)

2. Create converter functions:
   - convertGmailToUnified(email: GmailEmail): UnifiedCommunication
   - convertLinearToUnified(issue: LinearIssue): UnifiedTask
   - convertDriveToUnified(file: DriveFile): UnifiedFile
   - convertVercelToUnified(deployment: VercelDeployment): UnifiedEvent

3. Implement privacy filtering:
   - Remove sensitive data (passwords, tokens, API keys)
   - Anonymize email addresses if needed
   - Remove internal IDs and references

4. Add metadata:
   - Source system (gmail, linear, drive, vercel)
   - Sync timestamp
   - Last modified date
   - Owner information

The module should:
- Export type definitions for all unified models
- Export converter functions
- Include validation for converted data
- Handle missing or malformed data gracefully
- Log conversion errors

Example type definitions:
- type UnifiedCommunication = { id, source, from, to, subject, body, timestamp, metadata }
- type UnifiedTask = { id, source, title, description, status, assignee, dueDate, metadata }
- type UnifiedFile = { id, source, name, type, size, owner, modifiedDate, metadata }
- type UnifiedPerson = { id, source, name, email, role, metadata }
```

---

## Prompt 6: Webhook Handler & Real-time Sync

**File:** `src/services/webhookHandler.ts`

```
Create a TypeScript module for handling webhooks from integrated services.

Requirements:
1. Function to verify webhook signatures for each service:
   - Gmail webhook verification
   - Linear webhook verification
   - Vercel webhook verification
   - Drive webhook verification

2. Function to process webhook payloads:
   - Parse webhook data
   - Normalize to unified schema
   - Store in database
   - Trigger analysis pipeline

3. Webhook routes:
   - POST /webhooks/gmail
   - POST /webhooks/linear
   - POST /webhooks/vercel
   - POST /webhooks/drive

4. Error handling:
   - Invalid signatures (reject)
   - Malformed payloads (log and skip)
   - Database errors (retry with exponential backoff)
   - Rate limiting (queue for later processing)

The module should:
- Export async functions for webhook processing
- Verify webhook authenticity using signatures
- Support batch webhook processing
- Include request validation
- Log all webhook events
- Return appropriate HTTP status codes

Example function signatures:
- async function handleGmailWebhook(payload: any, signature: string): Promise<void>
- async function handleLinearWebhook(payload: any, signature: string): Promise<void>
- async function handleVercelWebhook(payload: any, signature: string): Promise<void>
- async function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean

Use HMAC-SHA256 for signature verification.
```

---

## Prompt 7: Sync Scheduler

**File:** `src/services/syncScheduler.ts`

```
Create a TypeScript module for scheduling background data syncs in a Cloudflare Worker.

Requirements:
1. Function to sync data from all sources:
   - Gmail (fetch new emails)
   - Google Drive (fetch new files)
   - Linear (fetch new issues)
   - Vercel (fetch new deployments)

2. Scheduling logic:
   - Full sync every 24 hours
   - Incremental sync every 6 hours
   - Real-time sync via webhooks

3. Sync state management:
   - Track last sync time for each source
   - Store sync tokens/cursors
   - Handle sync failures and retries

4. Error handling:
   - Retry failed syncs with exponential backoff
   - Log sync errors
   - Alert on repeated failures
   - Continue with other sources if one fails

5. Performance optimization:
   - Batch API requests
   - Implement rate limiting
   - Cache results
   - Compress stored data

The module should:
- Export async functions for triggering syncs
- Support scheduled execution via Cron Triggers
- Include sync status tracking
- Provide sync history/logs
- Handle concurrent syncs safely

Example function signatures:
- async function syncAll(): Promise<SyncResult>
- async function syncSource(source: DataSource): Promise<SyncResult>
- async function getSyncStatus(): Promise<SyncStatus>
- async function getLastSyncTime(source: DataSource): Promise<Date>

Use Cloudflare Durable Objects or KV for state management.
```

---

## Prompt 8: API Router

**File:** `src/routers/integrations.ts`

```
Create a TypeScript module that exposes integration APIs via tRPC procedures.

Requirements:
1. Create tRPC router with procedures:
   - getEmails(limit?: number): Promise<UnifiedCommunication[]>
   - getFiles(limit?: number): Promise<UnifiedFile[]>
   - getIssues(filters?: IssueFilters): Promise<UnifiedTask[]>
   - getDeployments(limit?: number): Promise<UnifiedEvent[]>
   - searchAcrossAll(query: string): Promise<SearchResult[]>
   - getSyncStatus(): Promise<SyncStatus>

2. Add authentication:
   - Require user authentication for all procedures
   - Return only user's own data
   - Validate user permissions

3. Add caching:
   - Cache results for 5 minutes
   - Invalidate cache on new data
   - Support cache bypass with force flag

4. Add pagination:
   - Support limit and offset parameters
   - Return total count
   - Include hasMore flag

5. Error handling:
   - Return user-friendly error messages
   - Log errors for debugging
   - Handle rate limits gracefully

The module should:
- Export tRPC router with all procedures
- Include input validation with Zod
- Include output validation with Zod
- Support real-time subscriptions if needed
- Include proper TypeScript types

Example procedure signatures:
- getEmails: input { limit: number, offset: number } → output { emails: UnifiedCommunication[], total: number, hasMore: boolean }
- searchAcrossAll: input { query: string } → output { results: SearchResult[] }
```

---

## Implementation Order

1. **Start with:** Gmail Integration (Prompt 1)
2. **Then:** Google Drive Integration (Prompt 2)
3. **Then:** Linear Integration (Prompt 3)
4. **Then:** Vercel Integration (Prompt 4)
5. **Then:** Data Normalization (Prompt 5)
6. **Then:** Webhook Handler (Prompt 6)
7. **Then:** Sync Scheduler (Prompt 7)
8. **Finally:** API Router (Prompt 8)

## Testing

After Codex generates each module:
1. Review the code for security issues
2. Test with real API credentials (use test accounts)
3. Verify error handling
4. Check TypeScript compilation
5. Run unit tests if available
6. Commit to a feature branch
7. Create a PR for review
8. Merge to main to auto-deploy

## Notes

- All modules should follow the existing code style in `src/auth.ts`
- Use environment variables for all API keys (never hardcode)
- Include proper error logging but avoid logging sensitive data
- Add JSDoc comments to all exported functions
- Use TypeScript strict mode
- Include type definitions for all API responses
