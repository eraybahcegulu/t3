import { postRouter } from "app/server/api/routers/post";
import { createTRPCRouter } from "app/server/api/trpc";
import { commentRouter } from "./routers/comment";
import { friendshipRouter } from "./routers/friendship";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  comment: commentRouter,
  friendship: friendshipRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
