import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "app/server/api/trpc";

export const friendshipRouter = createTRPCRouter({
    send: protectedProcedure
        .input(z.object({ search: z.string().min(1, { message: 'Cannot be empty' }).max(150, { message: 'Max length 150 characters' }) }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));



            const receiverUser = await ctx.db.user.findFirst({
                where: {
                    name: input.search,
                    NOT: {
                        name: ctx.session.user.name
                    }
                }
            })

            if (!receiverUser) {
                return { error: `Failed. User not found.` };
            }

            const alreadySent = await ctx.db.friendship.findFirst({
                where:{
                    receiverId: receiverUser.id,
                    senderId: ctx.session.user.id
                }
            })

            if(alreadySent){
                return { error: `Friend request already sent.` };
            }

            await ctx.db.friendship.create({
                data:{
                    senderId: ctx.session.user.id,
                    receiverId: receiverUser.id
                }
            })


            return { message: `Friend request sent` };
        }),




});
