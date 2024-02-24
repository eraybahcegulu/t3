import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "app/server/api/trpc";

export const postRouter = createTRPCRouter({
  welcomeToLoby: protectedProcedure
    .query(() => {
      return {
        greeting: `Welcome to Loby`,
      };
    }),

    myPosts: protectedProcedure
    .query(() => {
      return {
        greeting: `My Posts`,
      };
    }),

    myLikes: protectedProcedure
    .query(() => {
      return {
        greeting: `Posts I Liked`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .input(z.object({ name: z.string().max(150) }))
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

  getAll: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const posts = await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
    });

    const postsWithAuthorsAndLikes = await Promise.all(posts.map(async (post) => {
        const author = await ctx.db.user.findUnique({
            where: { id: post.createdById },
        });

        const userLikes = await ctx.db.like.findMany({
            where: {
                userId: ctx.session.user.id
            }
        });

        const likedByUser = userLikes.some((like) => like.postId === post.id);

        const allLikesForPost = await ctx.db.like.findMany({
            where: {
                postId: post.id
            }
        });

        return { ...post, author, userLikes, likedByUser, likedCount: allLikesForPost.length };
    }));

    return postsWithAuthorsAndLikes;
}),

getAllSession: protectedProcedure.query(async ({ ctx }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
  });

  const postsWithAuthorsAndLikes = await Promise.all(posts.map(async (post) => {
      const author = await ctx.db.user.findUnique({
          where: { id: post.createdById },
      });

      const userLikes = await ctx.db.like.findMany({
          where: {
              userId: ctx.session.user.id
          }
      });

      const likedByUser = userLikes.some((like) => like.postId === post.id);

      const allLikesForPost = await ctx.db.like.findMany({
          where: {
              postId: post.id
          }
      });

      return { ...post, author, userLikes, likedByUser, likedCount: allLikesForPost.length };
  }));

  return { posts: postsWithAuthorsAndLikes, author: ctx.session.user };

}),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  like: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {

      const alreadyLiked = await ctx.db.like.findFirst({
        where: {
          postId: input.id,
          userId: ctx.session.user.id,
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
          postId: input.id,
          userId: ctx.session.user.id,
        },
      })

      return { message: `Liked` };
    }),


  getLikes: protectedProcedure.query(async ({ ctx }) => {
    const userLikes = await ctx.db.like.findMany({
      where: {
        userId: ctx.session.user.id
      }
    });


    return { userLikes }

  }),

  getLikesPost: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const likedPostIds: { postId: number }[] = await ctx.db.like.findMany({
        where: {
            userId: ctx.session.user.id,
        },
        select: {
            postId: true,
        },
    });

    const posts = await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: {
            id: {
                in: likedPostIds.map((like) => like.postId),
            },
        }
    });

    const postsWithAuthors = await Promise.all(posts.map(async (post) => {
        const author = await ctx.db.user.findUnique({
            where: { id: post.createdById },
        });

        const allLikesForPost = await ctx.db.like.findMany({
            where: {
                postId: post.id
            }
        });

        return { ...post, author, likedCount: allLikesForPost.length };
    }));

    return postsWithAuthors;
}),

});
