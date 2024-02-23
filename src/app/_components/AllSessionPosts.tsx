'use client';

import React from 'react'
import { api } from "app/trpc/react";
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';

const AllSessionPosts = () => {
    const { data,  /* isLoading: postsLoading,*/ isFetching: postsFetching } = api.post.getAllSession.useQuery();

    return (
        <div className='h-full overflow-y-auto'>
            {
                postsFetching
                &&
                <LoadingSpinner p={"4"} />
            }
            {
                (!data || !data.author || !data.posts)
                &&
                !postsFetching
                &&
                <div> <span> Something went wrong</span>  </div>
            }
            {
                data?.posts.map(
                    (post) =>
                        <div className='max-w-[100%]  flex flex-row items-start gap-2 border-b border-gray-700 p-2' key={post.id}>

                            <div className='flex-shrink-0'>
                                <Image className="h-12 w-12 rounded-full" src={data.author.image ?? ""} width={64} height={64} alt="User Avatar" />
                            </div>
                            <div className=' flex flex-col flex-grow min-w-[300px]'>
                                <span className="opacity-25"> @{data.author.name} </span>
                                <span className='w-full break-words'> {post.name} </span>
                            </div>
                        </div>
                )
            }
        </div>
    )
}

export default AllSessionPosts