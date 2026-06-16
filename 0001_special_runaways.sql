CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(255) NOT NULL,
	`targetUserId` int,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `betSlips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`betType` enum('single','parlay','system') NOT NULL,
	`stake` decimal(18,8) NOT NULL,
	`currency` enum('USDT','USD','EUR','GBP','AUD','CAD') NOT NULL,
	`potentialWinnings` decimal(18,8),
	`actualWinnings` decimal(18,8),
	`status` enum('pending','won','lost','void','partial') NOT NULL DEFAULT 'pending',
	`systemBetConfig` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`settledAt` timestamp,
	CONSTRAINT `betSlips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`betSlipId` int NOT NULL,
	`eventId` int NOT NULL,
	`oddId` int NOT NULL,
	`marketType` varchar(100) NOT NULL,
	`selection` varchar(100) NOT NULL,
	`oddValue` decimal(10,4) NOT NULL,
	`status` enum('pending','won','lost','void') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sportId` int NOT NULL,
	`apiEventId` varchar(255) NOT NULL,
	`homeTeam` varchar(255) NOT NULL,
	`awayTeam` varchar(255) NOT NULL,
	`league` varchar(255),
	`eventDate` timestamp NOT NULL,
	`status` enum('scheduled','live','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`homeScore` int,
	`awayScore` int,
	`result` enum('home_win','away_win','draw','void'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_apiEventId_unique` UNIQUE(`apiEventId`)
);
--> statement-breakpoint
CREATE TABLE `odds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`marketType` varchar(100) NOT NULL,
	`selection` varchar(100) NOT NULL,
	`oddValue` decimal(10,4) NOT NULL,
	`isLive` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `odds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`icon` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sports_id` PRIMARY KEY(`id`),
	CONSTRAINT `sports_name_unique` UNIQUE(`name`),
	CONSTRAINT `sports_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`adminResponse` text,
	`respondedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('deposit','withdrawal') NOT NULL,
	`currency` enum('USDT','USD','EUR','GBP','AUD','CAD') NOT NULL,
	`amount` decimal(18,8) NOT NULL,
	`status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`transactionHash` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currency` enum('USDT','USD','EUR','GBP','AUD','CAD') NOT NULL,
	`balance` decimal(18,8) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`)
);
