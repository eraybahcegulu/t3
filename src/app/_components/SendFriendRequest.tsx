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

    const createPost = api.friendship.send.useMutation({
        onSuccess: (res: Res) => {
            if (res.error) {
                toast.error(res.error)
            } else if (res.message) {
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
        <Search value={search} addonBefore="@" onSearch={() => { createPost.mutate({ search }) }}
            enterButton="Send" onChange={(e) => setSearch(e.target.value)}
            className='max-w-[275px]' placeholder="Send Friend Request" />
    )
}

export default SendFriendRequest