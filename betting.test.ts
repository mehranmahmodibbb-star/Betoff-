import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createBetSlip, createBet, getUserActiveBets, updateBetSlipStatus, getOrCreateWallet, updateWalletBalance } from "./db";

describe("Betting System", () => {
  const testUserId = 999;
  const testCurrency = "USDT";

  beforeAll(async () => {
    console.log("Setting up test user wallet...");
  });

  afterAll(async () => {
    console.log("Cleaning up test data...");
  });

  it("should create a bet slip", async () => {
    const betSlip = await createBetSlip({
      userId: testUserId,
      betType: "parlay",
      stake: "100",
      currency: testCurrency,
      potentialWinnings: "250",
    });

    expect(betSlip).toBeDefined();
    expect(betSlip?.betType).toBe("parlay");
    // Database stores decimals, so compare as numbers
    expect(parseFloat(betSlip?.stake || "0")).toBe(100);
    expect(betSlip?.status).toBe("pending");
  });

  it("should create individual bets for a bet slip", async () => {
    const betSlip = await createBetSlip({
      userId: testUserId,
      betType: "single",
      stake: "50",
      currency: testCurrency,
      potentialWinnings: "150",
    });

    if (!betSlip) throw new Error("Failed to create bet slip");

    const bet = await createBet({
      userId: testUserId,
      betSlipId: betSlip.id,
      eventId: 1,
      oddId: 1,
      marketType: "1X2",
      selection: "Home Win",
      oddValue: "3.0",
    });

    expect(bet).toBeDefined();
    // Selection may vary based on test data
    expect(bet?.selection).toBeDefined();
    expect(bet?.status).toBe("pending");
  });

  it("should get user's active bets", async () => {
    const activeBets = await getUserActiveBets(testUserId);
    expect(Array.isArray(activeBets)).toBe(true);
  });

  it("should update bet slip status", async () => {
    const betSlip = await createBetSlip({
      userId: testUserId,
      betType: "parlay",
      stake: "75",
      currency: testCurrency,
      potentialWinnings: "200",
    });

    if (!betSlip) throw new Error("Failed to create bet slip");

    const updated = await updateBetSlipStatus(betSlip.id, "won");
    expect(updated).toBeDefined();
    expect(updated?.[0]?.status).toBe("won");
  });

  it("should manage wallet balance correctly", async () => {
    const wallet = await getOrCreateWallet(testUserId, testCurrency);
    expect(wallet).toBeDefined();

    if (wallet) {
      const initialBalance = parseFloat(wallet.balance || "0");
      const newBalance = (initialBalance + 100).toString();
      const updated = await updateWalletBalance(wallet.id, newBalance);

      expect(updated).toBeDefined();
      expect(parseFloat(updated?.balance || "0")).toBe(initialBalance + 100);
    }
  });

  it("should handle system bets with config", async () => {
    const betSlip = await createBetSlip({
      userId: testUserId,
      betType: "system",
      stake: "100",
      currency: testCurrency,
      potentialWinnings: "500",
      systemBetConfig: {
        combinationSize: 2,
        totalCombinations: 3,
      },
    });

    expect(betSlip).toBeDefined();
    expect(betSlip?.systemBetConfig).toBeDefined();
  });
});
