import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "app/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .input(z.object({ name: z.string().max(200) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });

      return { message: `Post created` };
    }),

    delete: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const existingPost = await ctx.db.post.findFirst({
        where: { id: input.id },
      });

      if (!existingPost) {
        return { error: `Failed. Movie with id ${input.id} not found.` };
      }

      await ctx.db.post.delete({
        where: { id: input.id },
      });

      return { message: `Movie "${existingPost.name}" deleted successfully` };
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getAll: protectedProcedure.query( async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  
    const postsWithAuthors = await Promise.all(posts.map(async (post) => {
      const author = await ctx.db.user.findUnique({
          where: { id: post.createdById },
      });

      return { ...post, author };
  }));
  
    return postsWithAuthors;
  }),

  getAllSession: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    const author = ctx.session.user;

    return { posts, author }
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
