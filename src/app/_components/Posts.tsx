'use client';

import React from 'react'
import { api } from "app/trpc/react";
import LoadingSpinner from './LoadingSpinner';

const Posts = () => {
    const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

    if (postsLoading) return <LoadingSpinner />

    if (!data) return <div> <span> Something went wrong</span>  </div>

    return (
        <span>
            {data?.map((post) => <div key={post.id}>{post.name}</div>)}
        </span>
    )
}

export default Posts