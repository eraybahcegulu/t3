"use client";

import { CheckOutlined } from '@ant-design/icons'
import { api } from 'app/trpc/react';
import React from 'react'
import toast from 'react-hot-toast';


interface Res {
    message?: string;
    error?: string;
}

const AcceptFriendRequest = ({ requestId }: { requestId: string }) => {
    const ctx = api.useContext();
    const acceptRequest = api.friendship.acceptRequest.useMutation({
        onSuccess: (res: Res) => {
            if (res.error) {
                toast.error(res.error)
            } else if (res.message) {
                void ctx.friendship.getReceivedRequests.fetch();
                void ctx.friendship.getFriends.fetch();
                toast.success(res.message)
            }
        },
        onError: (error) => {
            const errorMessage = error.data?.zodError?.fieldErrors.name;
            if (errorMessage?.[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("An error occurred");
            }
        }
    });

    return (
        <span className='text-blue-600 '>
            <CheckOutlined
                onClick={() => {
                    acceptRequest.mutate({ requestId });
                }}
                className='hover:scale-110 cursor-pointer transition-all'
                style={{
                    opacity: acceptRequest.isLoading ? 0.5 : 1,
                    pointerEvents: acceptRequest.isLoading ? 'none' : 'auto'
                }}
            />
        </span>
    )
}

export default AcceptFriendRequest