import { describe, it, expect, beforeAll } from "vitest";
import { getBettingMarketsForSport, getMarketSelections, seedFootballBettingMarkets } from "./db";

describe("Betting Markets", () => {
  const FOOTBALL_SPORT_ID = 1;

  beforeAll(async () => {
    // Initialize football markets before running tests
    await seedFootballBettingMarkets(FOOTBALL_SPORT_ID);
  });

  it("should retrieve betting markets for a sport", async () => {
    const markets = await getBettingMarketsForSport(FOOTBALL_SPORT_ID);
    
    expect(markets).toBeDefined();
    expect(Array.isArray(markets)).toBe(true);
    
    // Should have at least the main football markets
    const marketTypes = markets.map((m: any) => m.marketType);
    expect(marketTypes).toContain("1X2");
    expect(marketTypes).toContain("DOUBLE_CHANCE");
    expect(marketTypes).toContain("OVER_UNDER");
    expect(marketTypes).toContain("BTTS");
  });

  it("should have 1X2 market with correct selections", async () => {
    const markets = await getBettingMarketsForSport(FOOTBALL_SPORT_ID);
    const oneX2Market = markets.find((m: any) => m.marketType === "1X2");
    
    expect(oneX2Market).toBeDefined();
    expect(oneX2Market?.marketName).toBe("Win/Draw/Loss");
    
    if (oneX2Market) {
      const selections = await getMarketSelections(oneX2Market.id);
      expect(selections.length).toBe(3); // Home, Draw, Away
      
      const selectionNames = selections.map((s: any) => s.selectionName);
      expect(selectionNames).toContain("Home Win");
      expect(selectionNames).toContain("Draw");
      expect(selectionNames).toContain("Away Win");
    }
  });

  it("should have Double Chance market with correct selections", async () => {
    const markets = await getBettingMarketsForSport(FOOTBALL_SPORT_ID);
    const dcMarket = markets.find((m: any) => m.marketType === "DOUBLE_CHANCE");
    
    expect(dcMarket).toBeDefined();
    
    if (dcMarket) {
      const selections = await getMarketSelections(dcMarket.id);
      expect(selections.length).toBe(3); // 1X, 12, X2
      
      const selectionCodes = selections.map((s: any) => s.selectionCode);
      expect(selectionCodes).toContain("1X");
      expect(selectionCodes).toContain("12");
      expect(selectionCodes).toContain("X2");
    }
  });

  it("should have Over/Under market with correct selections", async () => {
    const markets = await getBettingMarketsForSport(FOOTBALL_SPORT_ID);
    const ouMarket = markets.find((m: any) => m.marketType === "OVER_UNDER");
    
    expect(ouMarket).toBeDefined();
    
    if (ouMarket) {
      const selections = await getMarketSelections(ouMarket.id);
      expect(selections.length).toBeGreaterThan(0);
      
      const selectionCodes = selections.map((s: any) => s.selectionCode);
      expect(selectionCodes.some((code: string) => code.includes("O"))).toBe(true); // Over
      expect(selectionCodes.some((code: string) => code.includes("U"))).toBe(true); // Under
    }
  });

  it("should have BTTS market with Yes/No selections", async () => {
    const markets = await getBettingMarketsForSport(FOOTBALL_SPORT_ID);
    const bttsMarket = markets.find((m: any) => m.marketType === "BTTS");
    
    expect(bttsMarket).toBeDefined();
    expect(bttsMarket?.marketName).toBe("Both Teams to Score");
    
    if (bttsMarket) {
      const selections = await getMarketSelections(bttsMarket.id);
      expect(selections.length).toBe(2); // Yes, No
      
      const selectionNames = selections.map((s: any) => s.selectionName);
      expect(selectionNames).toContain("Yes");
      expect(selectionNames).toContain("No");
    }
  });

  it("should have Correct Score market with multiple selections", async () => {
    const markets = await getBettingMarketsForSport(FOOTBALL_SPORT_ID);
    const csMarket = markets.find((m: any) => m.marketType === "CORRECT_SCORE");
    
    expect(csMarket).toBeDefined();
    
    if (csMarket) {
      const selections = await getMarketSelections(csMarket.id);
      expect(selections.length).toBeGreaterThan(10); // Should have many score combinations
      
      const selectionCodes = selections.map((s: any) => s.selectionCode);
      expect(selectionCodes).toContain("0-0");
      expect(selectionCodes).toContain("1-0");
      expect(selectionCodes).toContain("1-1");
    }
  });

  it("should have Half-time/Full-time market with correct selections", async () => {
    const markets = await getBettingMarketsForSport(FOOTBALL_SPORT_ID);
    const htftMarket = markets.find((m: any) => m.marketType === "HT_FT");
    
    expect(htftMarket).toBeDefined();
    
    if (htftMarket) {
      const selections = await getMarketSelections(htftMarket.id);
      expect(selections.length).toBe(9); // 3x3 combinations
      
      const selectionCodes = selections.map((s: any) => s.selectionCode);
      expect(selectionCodes).toContain("1/1"); // Home/Home
      expect(selectionCodes).toContain("X/X"); // Draw/Draw
      expect(selectionCodes).toContain("2/2"); // Away/Away
    }
  });

  it("should only return active markets", async () => {
    const markets = await getBettingMarketsForSport(FOOTBALL_SPORT_ID);
    
    // All markets should be active
    const allActive = markets.every((m: any) => m.isActive === true);
    expect(allActive).toBe(true);
  });

  it("should only return active selections", async () => {
    const markets = await getBettingMarketsForSport(FOOTBALL_SPORT_ID);
    
    if (markets.length > 0) {
      const selections = await getMarketSelections(markets[0].id);
      
      // All selections should be active
      const allActive = selections.every((s: any) => s.isActive === true);
      expect(allActive).toBe(true);
    }
  });
});
