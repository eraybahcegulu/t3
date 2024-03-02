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
                where: {
                    receiverId: receiverUser.id,
                    senderId: ctx.session.user.id,
                    status: 'PENDING'
                }
            })

            if (alreadySent) {
                return { error: `Friend request already sent.` };
            }

            const requestAlreadyReceived = await ctx.db.friendship.findFirst({
                where:
                {
                    receiverId: ctx.session.user.id,
                    senderId: receiverUser.id
                }
            })

            if (requestAlreadyReceived) {
                return { error: `Friend request already received from this person. Check your received friend requests.` };
            }

            const alreadyFriend = await ctx.db.user.findFirst({
                where: {
                    AND: [
                        {

                            id: receiverUser.id

                        },
                        {
                            OR: [
                                {
                                    receivedRequests: {
                                        some: {
                                            status: 'ACCEPTED'
                                        }
                                    }
                                },
                                {
                                    sentRequests: {
                                        some: {
                                            status: 'ACCEPTED'
                                        }
                                    }
                                }
                            ]
                        }

                    ]

                }
            });

            if (alreadyFriend) {
                return { error: `User already your friend.` };
            }

            await ctx.db.friendship.create({
                data: {
                    senderId: ctx.session.user.id,
                    receiverId: receiverUser.id
                }
            })


            return { message: `Friend request sent` };
        }),

    getSentRequests: protectedProcedure
        .query(async ({ ctx }) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const sentRequests = await ctx.db.friendship.findMany({
                orderBy: { createdAt: "desc" },
                where: {
                    senderId: ctx.session.user.id,
                    status: 'PENDING'
                },
                include: {
                    receiver: true
                }
            });

            return sentRequests;
        }),

    getReceivedRequests: protectedProcedure
        .query(async ({ ctx }) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const sentRequests = await ctx.db.friendship.findMany({
                orderBy: { createdAt: "desc" },
                where: {
                    receiverId: ctx.session.user.id,
                    status: 'PENDING'
                },
                include: {
                    sender: true
                }
            });

            return sentRequests;
        }),

    cancelRequest: protectedProcedure
        .input(z.object({ requestId: z.string().min(1, { message: 'Cannot be empty' }).max(150, { message: 'Max length 150 characters' }) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.friendship.delete({
                where: {
                    id: input.requestId,
                    status: 'PENDING'
                },
            });

            return { message: `friend request cancelled` };
        }),

    rejectRequest: protectedProcedure
        .input(z.object({ requestId: z.string().min(1, { message: 'Cannot be empty' }).max(150, { message: 'Max length 150 characters' }) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.friendship.delete({
                where: {
                    id: input.requestId,
                    status: 'PENDING'
                },
            });

            return { message: `friend request rejected` };
        }),

    acceptRequest: protectedProcedure
        .input(z.object({ requestId: z.string().min(1, { message: 'Cannot be empty' }).max(150, { message: 'Max length 150 characters' }) }))
        .mutation(async ({ ctx, input }) => {

            const request = await ctx.db.friendship.findFirst({
                where: {
                    id: input.requestId
                }
            });

            if (!request) {
                return { message: 'error' }
            }

            await ctx.db.friendship.update({
                where: {
                    id: input.requestId,
                    status: 'PENDING'
                },
                data: {
                    status: 'ACCEPTED'
                }
            });

            return { message: `friend request accepted` };
        }),

    getFriends: protectedProcedure
        .query(async ({ ctx }) => {
            const friends = await ctx.db.user.findMany({
                where: {
                    AND: [
                        {
                            NOT: {
                                id: ctx.session.user.id
                            }
                        },
                        {
                            OR: [
                                {
                                    receivedRequests: {
                                        some: {
                                            status: 'ACCEPTED'
                                        }
                                    }
                                },
                                {
                                    sentRequests: {
                                        some: {
                                            status: 'ACCEPTED'
                                        }
                                    }
                                }
                            ]
                        }

                    ]

                }
            });

            return friends;
        }),

    deleteFriend: protectedProcedure
        .input(z.object({ friendId: z.string().min(1, { message: 'Cannot be empty' }).max(150, { message: 'Max length 150 characters' }) }))
        .mutation(async ({ ctx, input }) => {

            await ctx.db.friendship.deleteMany({
                where: {
                    AND: [
                        {
                            OR: [
                                {
                                    senderId: ctx.session.user.id,
                                    receiverId: input.friendId
                                },
                                {
                                    senderId: input.friendId,
                                    receiverId: ctx.session.user.id
                                }
                            ]
                        },
                        { status: 'ACCEPTED' }
                    ]
                }
            });

            return { message: `friend deleted` };
        }),
});
