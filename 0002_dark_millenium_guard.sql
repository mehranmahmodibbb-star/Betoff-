CREATE TABLE `affiliates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`referralCode` varchar(50) NOT NULL,
	`status` enum('pending','active','suspended') NOT NULL DEFAULT 'pending',
	`commissionRate` decimal(5,2) NOT NULL DEFAULT '60',
	`totalCommissionEarned` decimal(18,8) NOT NULL DEFAULT '0',
	`totalReferrals` int NOT NULL DEFAULT 0,
	`activeReferrals` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliates_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliates_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `affiliates_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `commissionPayouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`amount` decimal(18,8) NOT NULL,
	`currency` enum('USDT','USD','EUR','GBP','AUD','CAD') NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`transactionHash` varchar(255),
	`payoutDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `commissionPayouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`status` enum('pending','active','inactive') NOT NULL DEFAULT 'pending',
	`totalBetsPlaced` decimal(18,8) NOT NULL DEFAULT '0',
	`commissionEarned` decimal(18,8) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referredUserId_unique` UNIQUE(`referredUserId`)
);
