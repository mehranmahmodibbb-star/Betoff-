import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createBetSlip,
  createBet,
  getUserActiveBets,
  updateBetSlipStatus,
  getOrCreateWallet,
  updateWalletBalance,
  getBetSlipById,
  getBetsByBetSlip,
} from "../db";
import { TRPCError } from "@trpc/server";

export const bettingRouter = router({
  // Place a bet - creates bet slip and individual bets
  placeBet: protectedProcedure
    .input(
      z.object({
        betType: z.enum(["single", "parlay", "system"]),
        stake: z.string(),
        currency: z.enum(["USDT", "USD", "EUR", "GBP", "AUD", "CAD"]),
        potentialWinnings: z.string(),
        selections: z.array(
          z.object({
            eventId: z.number(),
            oddId: z.number(),
            marketType: z.string(),
            selection: z.string(),
            oddValue: z.string(),
          })
        ),
        systemBetConfig: z.object({
          combinationSize: z.number(),
          totalCombinations: z.number(),
        }).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check user has sufficient balance
      const wallet = await getOrCreateWallet(userId, input.currency);
      if (!wallet) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get wallet",
        });
      }

      const stakeAmount = parseFloat(input.stake);
      const currentBalance = parseFloat(wallet.balance || "0");

      if (currentBalance < stakeAmount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient balance for this bet",
        });
      }

      // Create bet slip
      const betSlip = await createBetSlip({
        userId,
        betType: input.betType,
        stake: input.stake,
        currency: input.currency,
        potentialWinnings: input.potentialWinnings,
        systemBetConfig: input.systemBetConfig,
      });

      if (!betSlip) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create bet slip",
        });
      }

      // Create individual bets
      for (const selection of input.selections) {
        await createBet({
          userId,
          betSlipId: betSlip.id,
          eventId: selection.eventId,
          oddId: selection.oddId,
          marketType: selection.marketType,
          selection: selection.selection,
          oddValue: selection.oddValue,
        });
      }

      // Deduct stake from wallet
      const newBalance = (currentBalance - stakeAmount).toString();
      await updateWalletBalance(wallet.id, newBalance);

      return {
        success: true,
        betSlipId: betSlip.id,
        message: "Bet placed successfully",
      };
    }),

  // Get user's active bets
  getActiveBets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    return await getUserActiveBets(userId);
  }),

  // Get bet slip details with all bets
  getBetSlipDetails: protectedProcedure
    .input(z.object({ betSlipId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const betSlip = await getBetSlipById(input.betSlipId);
      if (!betSlip) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bet slip not found",
        });
      }

      if (betSlip.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this bet slip",
        });
      }

      const bets = await getBetsByBetSlip(input.betSlipId);

      return {
        betSlip,
        bets,
      };
    }),

  // Settle a bet (admin only)
  settleBet: protectedProcedure
    .input(
      z.object({
        betSlipId: z.number(),
        result: z.enum(["won", "lost", "void"]),
        winnings: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can settle bets",
        });
      }

      const betSlip = await getBetSlipById(input.betSlipId);
      if (!betSlip) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bet slip not found",
        });
      }

      // Update bet slip status
      await updateBetSlipStatus(input.betSlipId, input.result);

      // If bet won, credit user's wallet
      if (input.result === "won" && input.winnings) {
        const wallet = await getOrCreateWallet(betSlip.userId, betSlip.currency);
        if (wallet) {
          const currentBalance = parseFloat(wallet.balance || "0");
          const winningsAmount = parseFloat(input.winnings);
          const newBalance = (currentBalance + winningsAmount).toString();
          await updateWalletBalance(wallet.id, newBalance);
        }
      }

      return {
        success: true,
        message: `Bet settled as ${input.result}`,
      };
    }),
});
