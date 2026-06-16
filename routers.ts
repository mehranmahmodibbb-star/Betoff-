import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sportsRouter } from "./routers/sports";
import { bettingRouter } from "./routers/betting";
import { affiliateRouter } from "./routers/affiliate";
import { authRouter } from "./routers/auth";
import { marketsRouter } from "./routers/markets";

export const appRouter = router({
  system: systemRouter,
  sports: sportsRouter,
  betting: bettingRouter,
  affiliate: affiliateRouter,
  auth: authRouter,
  markets: marketsRouter,
});

export type AppRouter = typeof appRouter;
