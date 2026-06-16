CREATE TABLE `bettingMarkets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sportId` int NOT NULL,
	`marketType` varchar(100) NOT NULL,
	`marketName` varchar(255) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bettingMarkets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketSelections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`marketId` int NOT NULL,
	`selectionName` varchar(100) NOT NULL,
	`selectionCode` varchar(50) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `marketSelections_id` PRIMARY KEY(`id`)
);
