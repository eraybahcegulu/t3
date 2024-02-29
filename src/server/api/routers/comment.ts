import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "app/server/api/trpc";

export const commentRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ postId: z.number().min(1) }))
        .input(z.object({ name: z.string().min(1, { message: 'Cannot be empty' }).max(150, { message: 'Max length 150 characters' }) }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await ctx.db.comment.create({
                data: {
                    createdById: ctx.session.user.id,
                    name: input.name,
                    postId: input.postId
                },
            });

            return { message: `Comment posted` };
        }),

    getAll: protectedProcedure
        .input(z.object({ postId: z.number().min(1) }))
        .query(async ({ ctx, input }) => {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const comments = await ctx.db.comment.findMany({
                orderBy: { createdAt: "desc" },
                where: {
                    postId: input.postId,
                },

                include: {
                    createdBy: true
                }
            });

            return comments;
        }),

});
