import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  wallets,
  transactions,
  sports,
  events,
  odds,
  bets,
  betSlips,
  supportTickets,
  auditLogs,
  affiliates,
  referrals,
  commissionPayouts,
  bettingMarkets,
  marketSelections,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.email) {
    throw new Error("User email is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      email: user.email,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "passwordHash"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Wallet functions
export async function getOrCreateWallet(userId: number, currency: string) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db
    .select()
    .from(wallets)
    .where(and(eq(wallets.userId, userId), eq(wallets.currency, currency as any)))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  await db.insert(wallets).values({
    userId,
    currency: currency as any,
    balance: "0",
  });

  const created = await db
    .select()
    .from(wallets)
    .where(and(eq(wallets.userId, userId), eq(wallets.currency, currency as any)))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function getUserWallets(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(wallets).where(eq(wallets.userId, userId));
}

export async function updateWalletBalance(
  walletId: number,
  newBalance: string
) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(wallets)
    .set({ balance: newBalance })
    .where(eq(wallets.id, walletId));

  const updated = await db
    .select()
    .from(wallets)
    .where(eq(wallets.id, walletId))
    .limit(1);

  return updated.length > 0 ? updated[0] : undefined;
}

// Transaction functions
export async function createTransaction(data: {
  userId: number;
  type: "deposit" | "withdrawal";
  currency: string;
  amount: string;
  transactionHash?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(transactions).values({
    userId: data.userId,
    type: data.type,
    currency: data.currency as any,
    amount: data.amount,
    status: "pending",
    transactionHash: data.transactionHash,
  });

  const created = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.id))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function getUserTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt));
}

export async function getPendingTransactions() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.status, "pending"))
    .orderBy(desc(transactions.createdAt));
}

export async function approveTransaction(
  transactionId: number,
  walletId?: number
) {
  const db = await getDb();
  if (!db) return undefined;

  const transaction = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))
    .limit(1);

  if (!transaction.length) return undefined;

  const txn = transaction[0];

  // Update transaction status
  await db
    .update(transactions)
    .set({ status: "completed" })
    .where(eq(transactions.id, transactionId));

  // If deposit, update wallet balance
  if (txn.type === "deposit" && walletId) {
    const wallet = await db
      .select()
      .from(wallets)
      .where(eq(wallets.id, walletId))
      .limit(1);

    if (wallet.length) {
      const currentBalance = parseFloat(wallet[0].balance || "0");
      const newBalance = (currentBalance + parseFloat(txn.amount)).toString();
      await updateWalletBalance(walletId, newBalance);
    }
  }

  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))
    .limit(1);
}

export async function rejectTransaction(transactionId: number) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(transactions)
    .set({ status: "failed" })
    .where(eq(transactions.id, transactionId));

  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))
    .limit(1);
}

// Sports functions
export async function getSports() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(sports)
    .where(eq(sports.isActive, true));
}

// Events functions
export async function getEventsByStatus(status: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(events)
    .where(eq(events.status, status as any))
    .orderBy(events.eventDate);
}

export async function getEventById(eventId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Odds functions
export async function getOddsByEvent(eventId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(odds).where(eq(odds.eventId, eventId));
}

// Bet slip functions
export async function createBetSlip(data: {
  userId: number;
  betType: "single" | "parlay" | "system";
  stake: string;
  currency: string;
  potentialWinnings: string;
  systemBetConfig?: any;
}) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(betSlips).values({
    userId: data.userId,
    betType: data.betType,
    stake: data.stake,
    currency: data.currency as any,
    potentialWinnings: data.potentialWinnings,
    status: "pending",
    systemBetConfig: data.systemBetConfig,
  });

  const created = await db
    .select()
    .from(betSlips)
    .orderBy(desc(betSlips.id))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function getUserBetSlips(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(betSlips)
    .where(eq(betSlips.userId, userId))
    .orderBy(desc(betSlips.createdAt));
}

export async function getBetSlipById(betSlipId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(betSlips)
    .where(eq(betSlips.id, betSlipId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getBetsByBetSlip(betSlipId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(bets).where(eq(bets.betSlipId, betSlipId));
}

// Support ticket functions
export async function createSupportTicket(data: {
  userId: number;
  subject: string;
  message: string;
  priority?: "low" | "medium" | "high";
}) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(supportTickets).values({
    userId: data.userId,
    subject: data.subject,
    message: data.message,
    priority: data.priority || "medium",
  });

  const created = await db
    .select()
    .from(supportTickets)
    .orderBy(desc(supportTickets.id))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function getSupportTickets(status?: string) {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.status, status as any))
      .orderBy(desc(supportTickets.createdAt));
  }

  return await db
    .select()
    .from(supportTickets)
    .orderBy(desc(supportTickets.createdAt));
}

export async function respondToTicket(
  ticketId: number,
  response: string,
  adminId: number
) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(supportTickets)
    .set({
      adminResponse: response,
      respondedBy: adminId,
      status: "resolved",
      resolvedAt: new Date(),
    })
    .where(eq(supportTickets.id, ticketId));

  return await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.id, ticketId))
    .limit(1);
}


// Bet placement functions
export async function createBet(data: {
  userId: number;
  betSlipId: number;
  eventId: number;
  oddId: number;
  marketType: string;
  selection: string;
  oddValue: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(bets).values({
    userId: data.userId,
    betSlipId: data.betSlipId,
    eventId: data.eventId,
    oddId: data.oddId,
    marketType: data.marketType,
    selection: data.selection,
    oddValue: data.oddValue,
    status: "pending",
  });

  const created = await db
    .select()
    .from(bets)
    .orderBy(desc(bets.id))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function getUserActiveBets(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(betSlips)
    .where(and(eq(betSlips.userId, userId), eq(betSlips.status, "pending")))
    .orderBy(desc(betSlips.createdAt));
}

export async function updateBetSlipStatus(
  betSlipId: number,
  status: "pending" | "won" | "lost" | "void" | "partial"
) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(betSlips)
    .set({ status, updatedAt: new Date() })
    .where(eq(betSlips.id, betSlipId));

  return await db
    .select()
    .from(betSlips)
    .where(eq(betSlips.id, betSlipId))
    .limit(1);
}


// ============ AFFILIATE FUNCTIONS ============

export async function createAffiliate(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const referralCode = `REF${userId}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  await db.insert(affiliates).values({
    userId,
    referralCode,
    status: "active",
    commissionRate: "60",
  });

  const created = await db
    .select()
    .from(affiliates)
    .orderBy(desc(affiliates.id))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function getAffiliateByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAffiliateByReferralCode(referralCode: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.referralCode, referralCode))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createReferral(affiliateId: number, referredUserId: number) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(referrals).values({
    affiliateId,
    referredUserId,
    status: "active",
  });

  const created = await db
    .select()
    .from(referrals)
    .orderBy(desc(referrals.id))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function getReferralsByAffiliateId(affiliateId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(referrals)
    .where(eq(referrals.affiliateId, affiliateId));
}

export async function updateAffiliateStats(affiliateId: number, commissionAmount: string) {
  const db = await getDb();
  if (!db) return undefined;

  const affiliate = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.id, affiliateId))
    .limit(1);

  if (!affiliate.length) return undefined;

  const newTotal = (parseFloat(affiliate[0].totalCommissionEarned || "0") + parseFloat(commissionAmount)).toString();

  await db
    .update(affiliates)
    .set({
      totalCommissionEarned: newTotal,
    })
    .where(eq(affiliates.id, affiliateId));

  return await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.id, affiliateId))
    .limit(1);
}

export async function createCommissionPayout(affiliateId: number, amount: string, currency: string) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(commissionPayouts).values({
    affiliateId,
    amount,
    currency: currency as any,
    status: "pending",
  });

  const created = await db
    .select()
    .from(commissionPayouts)
    .orderBy(desc(commissionPayouts.id))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function getAffiliateStats(affiliateId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const affiliate = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.id, affiliateId))
    .limit(1);

  if (!affiliate.length) return undefined;

  const referralsList = await db
    .select()
    .from(referrals)
    .where(eq(referrals.affiliateId, affiliateId));

  const payouts = await db
    .select()
    .from(commissionPayouts)
    .where(eq(commissionPayouts.affiliateId, affiliateId));

  return {
    affiliate: affiliate[0],
    referrals: referralsList,
    payouts,
    totalReferrals: referralsList.length,
    activeReferrals: referralsList.filter(r => r.status === "active").length,
  };
}

export async function updateReferralBetAmount(referralId: number, betAmount: string) {
  const db = await getDb();
  if (!db) return undefined;

  const referral = await db
    .select()
    .from(referrals)
    .where(eq(referrals.id, referralId))
    .limit(1);

  if (!referral.length) return undefined;

  const newTotal = (parseFloat(referral[0].totalBetsPlaced || "0") + parseFloat(betAmount)).toString();

  await db
    .update(referrals)
    .set({
      totalBetsPlaced: newTotal,
    })
    .where(eq(referrals.id, referralId));

  return await db
    .select()
    .from(referrals)
    .where(eq(referrals.id, referralId))
    .limit(1);
}


// ============================================================================
// Betting Markets Functions
// ============================================================================

export async function getBettingMarketsForSport(sportId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(bettingMarkets)
    .where(and(eq(bettingMarkets.sportId, sportId), eq(bettingMarkets.isActive, true)))
    .orderBy(bettingMarkets.marketType);
}

export async function getMarketSelections(marketId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(marketSelections)
    .where(and(eq(marketSelections.marketId, marketId), eq(marketSelections.isActive, true)))
    .orderBy(marketSelections.selectionName);
}

export async function createBettingMarket(data: {
  sportId: number;
  marketType: string;
  marketName: string;
  description?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(bettingMarkets).values({
    sportId: data.sportId,
    marketType: data.marketType,
    marketName: data.marketName,
    description: data.description,
  });

  const created = await db
    .select()
    .from(bettingMarkets)
    .orderBy(desc(bettingMarkets.id))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function createMarketSelection(data: {
  marketId: number;
  selectionName: string;
  selectionCode: string;
  description?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(marketSelections).values({
    marketId: data.marketId,
    selectionName: data.selectionName,
    selectionCode: data.selectionCode,
    description: data.description,
  });

  const created = await db
    .select()
    .from(marketSelections)
    .orderBy(desc(marketSelections.id))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

export async function seedFootballBettingMarkets(footballSportId: number) {
  const db = await getDb();
  if (!db) return;

  // Football betting markets
  const markets = [
    {
      marketType: "1X2",
      marketName: "Win/Draw/Loss",
      description: "Predict the match result: Home Win, Draw, or Away Win",
    },
    {
      marketType: "DOUBLE_CHANCE",
      marketName: "Double Chance",
      description: "Bet on two possible outcomes: 1X (Home or Draw), 12 (Home or Away), X2 (Draw or Away)",
    },
    {
      marketType: "OVER_UNDER",
      marketName: "Over/Under Goals",
      description: "Predict if total goals will be over or under a specific number",
    },
    {
      marketType: "BTTS",
      marketName: "Both Teams to Score",
      description: "Predict if both teams will score in the match",
    },
    {
      marketType: "CORRECT_SCORE",
      marketName: "Correct Score",
      description: "Predict the exact final score of the match",
    },
    {
      marketType: "FIRST_GOAL",
      marketName: "First Goal Scorer",
      description: "Predict which player will score first",
    },
    {
      marketType: "HANDICAP",
      marketName: "Asian Handicap",
      description: "Bet with a goal handicap applied to one team",
    },
    {
      marketType: "HT_FT",
      marketName: "Half-time/Full-time",
      description: "Predict the result at half-time and full-time",
    },
  ];

  for (const market of markets) {
    const existing = await db
      .select()
      .from(bettingMarkets)
      .where(
        and(
          eq(bettingMarkets.sportId, footballSportId),
          eq(bettingMarkets.marketType, market.marketType)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      const created = await db.insert(bettingMarkets).values({
        sportId: footballSportId,
        marketType: market.marketType,
        marketName: market.marketName,
        description: market.description,
      });

      // Get the created market ID
      const marketId = (created as any).insertId || (await db
        .select()
        .from(bettingMarkets)
        .where(
          and(
            eq(bettingMarkets.sportId, footballSportId),
            eq(bettingMarkets.marketType, market.marketType)
          )
        )
        .limit(1))[0]?.id;

      if (!marketId) continue;

      // Add selections for each market
      const selections: Record<string, Array<{ name: string; code: string }>> = {
        "1X2": [
          { name: "Home Win", code: "1" },
          { name: "Draw", code: "X" },
          { name: "Away Win", code: "2" },
        ],
        DOUBLE_CHANCE: [
          { name: "Home or Draw", code: "1X" },
          { name: "Home or Away", code: "12" },
          { name: "Draw or Away", code: "X2" },
        ],
        OVER_UNDER: [
          { name: "Over 2.5", code: "O2.5" },
          { name: "Under 2.5", code: "U2.5" },
          { name: "Over 3.5", code: "O3.5" },
          { name: "Under 3.5", code: "U3.5" },
        ],
        BTTS: [
          { name: "Yes", code: "YES" },
          { name: "No", code: "NO" },
        ],
        CORRECT_SCORE: [
          { name: "0-0", code: "0-0" },
          { name: "1-0", code: "1-0" },
          { name: "0-1", code: "0-1" },
          { name: "1-1", code: "1-1" },
          { name: "2-0", code: "2-0" },
          { name: "0-2", code: "0-2" },
          { name: "2-1", code: "2-1" },
          { name: "1-2", code: "1-2" },
          { name: "2-2", code: "2-2" },
          { name: "3-0", code: "3-0" },
          { name: "0-3", code: "0-3" },
          { name: "3-1", code: "3-1" },
          { name: "1-3", code: "1-3" },
          { name: "3-2", code: "3-2" },
          { name: "2-3", code: "2-3" },
          { name: "3-3", code: "3-3" },
          { name: "Any Other", code: "OTHER" },
        ],
        FIRST_GOAL: [
          { name: "Player 1", code: "P1" },
          { name: "Player 2", code: "P2" },
          { name: "No Goal", code: "NG" },
        ],
        HANDICAP: [
          { name: "Home -0.5", code: "H-0.5" },
          { name: "Home +0.5", code: "H+0.5" },
          { name: "Away -0.5", code: "A-0.5" },
          { name: "Away +0.5", code: "A+0.5" },
        ],
        HT_FT: [
          { name: "Home/Home", code: "1/1" },
          { name: "Home/Draw", code: "1/X" },
          { name: "Home/Away", code: "1/2" },
          { name: "Draw/Home", code: "X/1" },
          { name: "Draw/Draw", code: "X/X" },
          { name: "Draw/Away", code: "X/2" },
          { name: "Away/Home", code: "2/1" },
          { name: "Away/Draw", code: "2/X" },
          { name: "Away/Away", code: "2/2" },
        ],
      };

      if (selections[market.marketType]) {
        for (const selection of selections[market.marketType]) {
          const existingSelection = await db
            .select()
            .from(marketSelections)
            .where(
              and(
                eq(marketSelections.marketId, marketId),
                eq(marketSelections.selectionCode, selection.code)
              )
            )
            .limit(1);

          if (existingSelection.length === 0) {
            await db.insert(marketSelections).values({
              marketId: marketId,
              selectionName: selection.name,
              selectionCode: selection.code,
            });
          }
        }
      }
    }
  }
}
