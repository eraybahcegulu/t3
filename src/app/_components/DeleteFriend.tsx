"use client";

import { CloseOutlined } from '@ant-design/icons'
import { api } from 'app/trpc/react';
import React from 'react'
import toast from 'react-hot-toast';


interface Res {
    message?: string;
    error?: string;
}

const DeleteFriend = ({ friendId }: { friendId: string }) => {
    const ctx = api.useContext();
    const deleteFriend = api.friendship.deleteFriend.useMutation({
        onSuccess: (res: Res) => {
            if (res.error) {
                toast.error(res.error)
            } else if (res.message) {
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
        <span className='text-red-500 '>
            <CloseOutlined
                onClick={() => {
                    deleteFriend.mutate({ friendId });
                }}
                className='hover:scale-110 cursor-pointer transition-all'
                style={{
                    opacity: deleteFriend.isLoading ? 0.5 : 1,
                    pointerEvents: deleteFriend.isLoading ? 'none' : 'auto'
                }}

            />

        </span>
    )
}

export default DeleteFriend