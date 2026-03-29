import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here
/**
 * Chat sessions for storing conversation context and history.
 * Used for Gemini AI learning capability.
 */
export const chatSessions = mysqlTable("chat_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }),
  context: text("context"), // Stores context/metadata for the session
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

/**
 * Chat messages for storing conversation history.
 * Linked to chat sessions for context learning.
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * OAuth tokens for Google Drive integration.
 * Stores access and refresh tokens securely.
 */
export const googleOAuthTokens = mysqlTable("google_oauth_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GoogleOAuthToken = typeof googleOAuthTokens.$inferSelect;
export type InsertGoogleOAuthToken = typeof googleOAuthTokens.$inferInsert;

/**
 * Worker logs for storing Cloudflare Workers execution logs.
 */
export const workerLogs = mysqlTable("worker_logs", {
  id: int("id").autoincrement().primaryKey(),
  workerId: varchar("workerId", { length: 255 }).notNull(),
  workerName: varchar("workerName", { length: 255 }),
  status: varchar("status", { length: 50 }), // success, error, etc
  message: text("message"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type WorkerLog = typeof workerLogs.$inferSelect;
export type InsertWorkerLog = typeof workerLogs.$inferInsert;

/**
 * GitHub data cache for storing fetched repository and issue data.
 */
export const githubData = mysqlTable("github_data", {
  id: int("id").autoincrement().primaryKey(),
  dataType: mysqlEnum("dataType", ["repo", "issue", "pr", "activity"]).notNull(),
  externalId: varchar("externalId", { length: 255 }).notNull(),
  data: text("data").notNull(), // JSON stringified data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GitHubData = typeof githubData.$inferSelect;
export type InsertGitHubData = typeof githubData.$inferInsert;
