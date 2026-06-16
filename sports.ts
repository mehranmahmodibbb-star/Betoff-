import { router, publicProcedure } from "../_core/trpc";
import { sportsDataService } from "../services/sportsDataService";

console.log("[Sports Router] Initialized with multi-API service");

export const sportsRouter = router({
  getLiveEvents: publicProcedure.query(async () => {
    return await sportsDataService.getLiveEvents();
  }),

  getPreGameEvents: publicProcedure.query(async () => {
    return await sportsDataService.getPreGameEvents();
  }),

  getOdds: publicProcedure.query(async () => {
    const events = await sportsDataService.getLiveEvents();
    return events.map((e: any) => e.odds);
  }),
});

export default sportsRouter;
