import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "app/server/api/trpc";

export const postRouter = createTRPCRouter({
  welcomeToLobyGreeting: publicProcedure
    .query(async ({ ctx }) => {
      return {
        greeting: `Welcome to Loby @${ctx.session?.user.name}`,
      };
    }),

  myPostsGreeting: publicProcedure
    .query(() => {
      return {
        greeting: `My Posts`,
      };
    }),

  myLikesGreeting: publicProcedure
    .query(() => {
      return {
        greeting: `Posts I Liked`,
      };
    }),

  editPostGreeting: publicProcedure
    .query(() => {
      return {
        greeting: `Edit Post`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1, { message: 'Cannot be empty' }).max(150, { message: 'Max length 150 characters' }) }))
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
        return { error: `Failed. Post not found.` };
      }

      await ctx.db.post.update({
        where: { id: input.id },
        data: {
          isDeleted: true
        }
      });

      await ctx.db.like.deleteMany({
        where: {
          postId: existingPost.id
        }
      })

      await ctx.db.comment.deleteMany({
        where: {
          postId: existingPost.id
        }
      })

      return { message: `Post deleted successfully` };
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { isDeleted: false },
      include: {
        likes: true,
        createdBy: true,
        comments: true
      },
    });

    return posts;
  }),

  getAllSession: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        createdBy: { id: ctx.session.user.id },
        isDeleted: false,
      },
      include: {
        likes: true,
        createdBy: true,
        comments: true
      },
    });

    return posts;

  }),

  getLikesPost: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userLikes = await ctx.db.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        likes: {
          select: {
            postId: true,
            post: {
              select: {
                isDeleted: false,
                id: true,
                name: true,
                isEdited: true,
                createdById: true,
                createdAt: true,
                likes: true,
                comments: true
              }
            }
          }
        },
      },
    });

    return userLikes;
  }),


  getLikes: protectedProcedure.query(async ({ ctx }) => {
    const userLikes = await ctx.db.like.findMany({
      where: {
        userId: ctx.session.user.id
      }
    });

    return { userLikes }

  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  like: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const postId = input.id;

      const alreadyLiked = await ctx.db.like.findFirst({
        where: {
          postId,
          userId,
        },
      });

      if (alreadyLiked) {
        await ctx.db.like.delete({
          where: {
            id: alreadyLiked.id,
          },
        });

        return { message: `Like removed` };
      }

      await ctx.db.like.create({
        data: {
          postId,
          userId,
        },
      });

      return { message: `Liked` };
    }),

  getOne: protectedProcedure
    .input(z.object({ postId: z.number().min(1) }))
    .query(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.post.findFirst({
        where: {
          id: input.postId,
          isDeleted: false
        },
        include: {
          createdBy: true,
          likes: true
        }
      },
      );
    }),

  edit: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .input(z.object({ name: z.string().min(1, { message: 'Cannot be empty' }).max(150, { message: 'Max length 150 characters' }) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const post = await ctx.db.post.findFirst({
        where: {
          id: input.id,
        }
      })

      if (!post) {
        return { error: `Post not found.` };
      }

      await ctx.db.post.update({
        where: { id: input.id },
        data: {
          name: input.name,
          isEdited: true
        },
      });

      return { message: `Post edited` };
    }),

});
