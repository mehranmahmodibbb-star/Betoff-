import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createAffiliate,
  getAffiliateByUserId,
  getAffiliateByReferralCode,
  createReferral,
  getReferralsByAffiliateId,
  getAffiliateStats,
  createCommissionPayout,
} from "../db";
import { TRPCError } from "@trpc/server";

export const affiliateRouter = router({
  // Register as affiliate
  registerAffiliate: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    // Check if already an affiliate
    const existing = await getAffiliateByUserId(userId);
    if (existing) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is already an affiliate",
      });
    }

    const affiliate = await createAffiliate(userId);
    if (!affiliate) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create affiliate account",
      });
    }

    return {
      success: true,
      affiliate,
      message: "Affiliate account created successfully",
    };
  }),

  // Get affiliate info
  getAffiliateInfo: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const affiliate = await getAffiliateByUserId(userId);
    if (!affiliate) {
      return null;
    }

    return affiliate;
  }),

  // Get affiliate dashboard stats
  getAffiliateDashboard: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const affiliate = await getAffiliateByUserId(userId);
    if (!affiliate) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Affiliate account not found",
      });
    }

    const stats = await getAffiliateStats(affiliate.id);
    return stats;
  }),

  // Get referrals list
  getReferrals: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const affiliate = await getAffiliateByUserId(userId);
    if (!affiliate) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Affiliate account not found",
      });
    }

    return await getReferralsByAffiliateId(affiliate.id);
  }),

  // Request commission payout
  requestPayout: protectedProcedure
    .input(
      z.object({
        amount: z.string(),
        currency: z.enum(["USDT", "USD", "EUR", "GBP", "AUD", "CAD"]),
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

      const affiliate = await getAffiliateByUserId(userId);
      if (!affiliate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Affiliate account not found",
        });
      }

      const requestAmount = parseFloat(input.amount);
      const availableCommission = parseFloat(affiliate.totalCommissionEarned || "0");

      if (requestAmount > availableCommission) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient commission balance",
        });
      }

      const payout = await createCommissionPayout(
        affiliate.id,
        input.amount,
        input.currency
      );

      if (!payout) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payout request",
        });
      }

      return {
        success: true,
        payout,
        message: "Payout request created successfully",
      };
    }),

  // Get payout history
  getPayoutHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const affiliate = await getAffiliateByUserId(userId);
    if (!affiliate) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Affiliate account not found",
      });
    }

    const stats = await getAffiliateStats(affiliate.id);
    return stats?.payouts || [];
  }),
});
