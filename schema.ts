import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with betting platform specific fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  name: text("name"),
  loginMethod: mysqlEnum("loginMethod", ["email", "google", "manus"]).default("email").notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isEmailVerified: boolean("isEmailVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User wallet table - stores balance in each supported currency
 */
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  currency: mysqlEnum("currency", ["USDT", "USD", "EUR", "GBP", "AUD", "CAD"]).notNull(),
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

/**
 * Transaction history table - tracks deposits and withdrawals
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["deposit", "withdrawal"]).notNull(),
  currency: mysqlEnum("currency", ["USDT", "USD", "EUR", "GBP", "AUD", "CAD"]).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  transactionHash: varchar("transactionHash", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Sports table - stores available sports for betting
 */
export const sports = mysqlTable("sports", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Sport = typeof sports.$inferSelect;
export type InsertSport = typeof sports.$inferInsert;

/**
 * Events table - stores sporting events
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  sportId: int("sportId").notNull(),
  apiEventId: varchar("apiEventId", { length: 255 }).notNull().unique(),
  homeTeam: varchar("homeTeam", { length: 255 }).notNull(),
  awayTeam: varchar("awayTeam", { length: 255 }).notNull(),
  league: varchar("league", { length: 255 }),
  eventDate: timestamp("eventDate").notNull(),
  status: mysqlEnum("status", ["scheduled", "live", "completed", "cancelled"]).default("scheduled").notNull(),
  homeScore: int("homeScore"),
  awayScore: int("awayScore"),
  result: mysqlEnum("result", ["home_win", "away_win", "draw", "void"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Odds table - stores current odds for events
 */
export const odds = mysqlTable("odds", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  marketType: varchar("marketType", { length: 100 }).notNull(), // e.g., "1X2", "Over/Under", "Both Teams Score"
  selection: varchar("selection", { length: 100 }).notNull(), // e.g., "Home Win", "Over 2.5", "Yes"
  oddValue: decimal("oddValue", { precision: 10, scale: 4 }).notNull(),
  isLive: boolean("isLive").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Odd = typeof odds.$inferSelect;
export type InsertOdd = typeof odds.$inferInsert;

/**
 * Bets table - stores individual bet selections
 */
export const bets = mysqlTable("bets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  betSlipId: int("betSlipId").notNull(),
  eventId: int("eventId").notNull(),
  oddId: int("oddId").notNull(),
  marketType: varchar("marketType", { length: 100 }).notNull(),
  selection: varchar("selection", { length: 100 }).notNull(),
  oddValue: decimal("oddValue", { precision: 10, scale: 4 }).notNull(),
  status: mysqlEnum("status", ["pending", "won", "lost", "void"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Bet = typeof bets.$inferSelect;
export type InsertBet = typeof bets.$inferInsert;

/**
 * Bet slips table - groups multiple bets together (single, parlay, system)
 */
export const betSlips = mysqlTable("betSlips", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  betType: mysqlEnum("betType", ["single", "parlay", "system"]).notNull(),
  stake: decimal("stake", { precision: 18, scale: 8 }).notNull(),
  currency: mysqlEnum("currency", ["USDT", "USD", "EUR", "GBP", "AUD", "CAD"]).notNull(),
  potentialWinnings: decimal("potentialWinnings", { precision: 18, scale: 8 }),
  actualWinnings: decimal("actualWinnings", { precision: 18, scale: 8 }),
  status: mysqlEnum("status", ["pending", "won", "lost", "void", "partial"]).default("pending").notNull(),
  systemBetConfig: json("systemBetConfig"), // For system bets: { combinationSize: number, totalCombinations: number }
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  settledAt: timestamp("settledAt"),
});

export type BetSlip = typeof betSlips.$inferSelect;
export type InsertBetSlip = typeof betSlips.$inferInsert;

/**
 * Support tickets table - for user support requests
 */
export const supportTickets = mysqlTable("supportTickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  adminResponse: text("adminResponse"),
  respondedBy: int("respondedBy"), // admin user id
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

/**
 * Audit log table - tracks admin actions
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  targetUserId: int("targetUserId"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Affiliate table - stores affiliate/referral information
 */
export const affiliates = mysqlTable("affiliates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  referralCode: varchar("referralCode", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "active", "suspended"]).default("pending").notNull(),
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).default("60").notNull(), // 60% commission
  totalCommissionEarned: decimal("totalCommissionEarned", { precision: 18, scale: 8 }).default("0").notNull(),
  totalReferrals: int("totalReferrals").default(0).notNull(),
  activeReferrals: int("activeReferrals").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = typeof affiliates.$inferInsert;

/**
 * Referrals table - tracks users referred by affiliates
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId").notNull(),
  referredUserId: int("referredUserId").notNull().unique(),
  status: mysqlEnum("status", ["pending", "active", "inactive"]).default("pending").notNull(),
  totalBetsPlaced: decimal("totalBetsPlaced", { precision: 18, scale: 8 }).default("0").notNull(),
  commissionEarned: decimal("commissionEarned", { precision: 18, scale: 8 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Commission payouts table - tracks affiliate commission payments
 */
export const commissionPayouts = mysqlTable("commissionPayouts", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  currency: mysqlEnum("currency", ["USDT", "USD", "EUR", "GBP", "AUD", "CAD"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  transactionHash: varchar("transactionHash", { length: 255 }),
  payoutDate: timestamp("payoutDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommissionPayout = typeof commissionPayouts.$inferSelect;
export type InsertCommissionPayout = typeof commissionPayouts.$inferInsert;


/**
 * Betting Markets table - stores available betting market types for each sport
 */
export const bettingMarkets = mysqlTable("bettingMarkets", {
  id: int("id").autoincrement().primaryKey(),
  sportId: int("sportId").notNull(),
  marketType: varchar("marketType", { length: 100 }).notNull(), // e.g., "1X2", "Double Chance", "Over/Under"
  marketName: varchar("marketName", { length: 255 }).notNull(), // e.g., "Win/Draw/Loss"
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BettingMarket = typeof bettingMarkets.$inferSelect;
export type InsertBettingMarket = typeof bettingMarkets.$inferInsert;

/**
 * Market Selections table - stores available selections for each market type
 */
export const marketSelections = mysqlTable("marketSelections", {
  id: int("id").autoincrement().primaryKey(),
  marketId: int("marketId").notNull(),
  selectionName: varchar("selectionName", { length: 100 }).notNull(), // e.g., "Home Win", "Draw", "Away Win"
  selectionCode: varchar("selectionCode", { length: 50 }).notNull(), // e.g., "1", "X", "2"
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MarketSelection = typeof marketSelections.$inferSelect;
export type InsertMarketSelection = typeof marketSelections.$inferInsert;
