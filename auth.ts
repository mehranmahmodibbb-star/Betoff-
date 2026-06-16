import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { hashPassword, verifyPassword, isValidEmail, isStrongPassword } from "../_core/auth";
import { getUserByEmail, upsertUser, getOrCreateWallet } from "../db";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { getSessionCookieOptions } from "../_core/cookies";
import { COOKIE_NAME } from "@shared/const";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authRouter = router({
  /**
   * Register a new user with email and password
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Validate email format
      if (!isValidEmail(input.email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid email format",
        });
      }

      // Validate password strength
      if (!isStrongPassword(input.password)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number",
        });
      }

      // Check if user already exists
      const existingUser = await getUserByEmail(input.email);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      try {
        // Hash password
        const passwordHash = hashPassword(input.password);

        // Create user
        await upsertUser({
          email: input.email,
          passwordHash,
          name: input.name || null,
          loginMethod: "email",
          isEmailVerified: true,
          lastSignedIn: new Date(),
        });

        // Get the created user
        const user = await getUserByEmail(input.email);
        if (!user) {
          throw new Error("Failed to create user");
        }

        // Create default wallets for all currencies
        const currencies = ["USDT", "USD", "EUR", "GBP", "AUD", "CAD"];
        for (const currency of currencies) {
          await getOrCreateWallet(user.id, currency);
        }

        // Create JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: "365d" }
        );

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      } catch (error) {
        console.error("[Auth] Registration failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register user",
        });
      }
    }),

  /**
   * Login with email and password
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email format"),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Find user by email
        const user = await getUserByEmail(input.email);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Check if user has password hash (email login method)
        if (!user.passwordHash || user.loginMethod !== "email") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "This account uses a different login method",
          });
        }

        // Verify password
        if (!verifyPassword(input.password, user.passwordHash)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Update last signed in
        await upsertUser({
          email: user.email,
          lastSignedIn: new Date(),
        });

        // Create JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: "365d" }
        );

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("[Auth] Login failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed",
        });
      }
    }),

  /**
   * Check if email is already registered
   */
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const user = await getUserByEmail(input.email);
      return {
        exists: !!user,
      };
    }),

  /**
   * Get current user info
   */
  me: publicProcedure.query(opts => opts.ctx.user),

  /**
   * Logout current user
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    } as const;
  }),
});
