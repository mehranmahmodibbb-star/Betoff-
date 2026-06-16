import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getBettingMarketsForSport, getMarketSelections, seedFootballBettingMarkets } from "../db";

export const marketsRouter = router({
  /**
   * Get all available betting markets for a specific sport
   */
  getMarketsForSport: publicProcedure
    .input(z.object({ sportId: z.number() }))
    .query(async ({ input }) => {
      return await getBettingMarketsForSport(input.sportId);
    }),

  /**
   * Get all selections for a specific market
   */
  getMarketSelections: publicProcedure
    .input(z.object({ marketId: z.number() }))
    .query(async ({ input }) => {
      return await getMarketSelections(input.marketId);
    }),

  /**
   * Initialize football betting markets (admin only)
   */
  initializeFootballMarkets: publicProcedure
    .input(z.object({ footballSportId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await seedFootballBettingMarkets(input.footballSportId);
        return { success: true, message: "Football betting markets initialized" };
      } catch (error) {
        console.error("Error initializing football markets:", error);
        return { success: false, message: "Failed to initialize markets" };
      }
    }),
});
