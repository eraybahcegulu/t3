"use client";

import Search from 'antd/es/input/Search'
import { api } from 'app/trpc/react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface Res {
    message?: string;
    error?: string;
}

const SendFriendRequest = () => {
    const [search, setSearch] = useState<string>('');
    const ctx = api.useContext();
    const sendFriendRequest = api.friendship.send.useMutation({
        onSuccess: (res: Res) => {
            if (res.error) {
                toast.error(res.error)
            } else if (res.message) {
                void ctx.friendship.getSentRequests.fetch();
                toast.success(res.message)
            }
            setSearch('')
        },
        onError: (error) => {
            const errorMessage = error.data?.zodError?.fieldErrors.search;
            if (errorMessage?.[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("An error occurred");
            }
        }
    });

    return (
        <Search value={search} addonBefore="@" onSearch={() => { sendFriendRequest.mutate({ search }) }}
            enterButton="Send" onChange={(e) => setSearch(e.target.value)}
            disabled={sendFriendRequest.isLoading}
            className='max-w-[275px]' placeholder="name" />
    )
}

export default SendFriendRequest