CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255),
	`context` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `github_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dataType` enum('repo','issue','pr','activity') NOT NULL,
	`externalId` varchar(255) NOT NULL,
	`data` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `github_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `google_oauth_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `google_oauth_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `worker_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workerId` varchar(255) NOT NULL,
	`workerName` varchar(255),
	`status` varchar(50),
	`message` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `worker_logs_id` PRIMARY KEY(`id`)
);
