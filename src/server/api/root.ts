import { submissionRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { setupRouter } from "~/server/api/routers/setup";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  submission: submissionRouter,
  setup: setupRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
