"use client";

import { CloseOutlined } from '@ant-design/icons'
import { api } from 'app/trpc/react';
import React from 'react'
import toast from 'react-hot-toast';


interface Res {
    message?: string;
    error?: string;
}

const RejectFriendRequest = ({ requestId }: { requestId: string }) => {
    const ctx = api.useContext();
    const rejectRequest = api.friendship.rejectRequest.useMutation({
        onSuccess: (res: Res) => {
            if (res.error) {
                toast.error(res.error)
            } else if (res.message) {
                void ctx.friendship.getReceivedRequests.fetch();
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
        <span className='text-red-500 '>
            <CloseOutlined
                onClick={() => {
                    rejectRequest.mutate({ requestId });
                }}
                className='hover:scale-110 cursor-pointer transition-all'
                style={{
                    opacity: rejectRequest.isLoading ? 0.5 : 1,
                    pointerEvents: rejectRequest.isLoading ? 'none' : 'auto'
                }}

            />

        </span>
    )
}

export default RejectFriendRequest