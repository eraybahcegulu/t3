'use client';

import React from 'react'
import { api } from "app/trpc/react";
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';

const AllSessionPosts = () => {
    const { data, isLoading: postsLoading } = api.post.getAllSession.useQuery();

    return (
        <div className='h-full overflow-y-auto'>
            {
                postsLoading
                &&
                <LoadingSpinner p={"4"} />
            }
            {
                (!data || !data.author || !data.posts)
                &&
                !postsLoading
                &&
                <div> <span> Something went wrong</span>  </div>
            }
            {
                data?.posts.map(
                    (post) =>
                        <div className=' flex flex-row  gap-2 items-center border-b border-gray-700 p-2'
                            key={post.id}
                        >

                            <div className='flex flex-start'>
                                <Image className="h-12 w-12 rounded-full" src={data.author.image ?? ""} width={64} height={64} alt="User Avatar" />
                            </div>
                            <div className=' flex flex-col grow '>
                                <span className="opacity-25"> @{data.author.name} </span>
                                <span> {post.name} </span>
                            </div>
                        </div>
                )
            }
        </div>
    )
}

export default AllSessionPosts