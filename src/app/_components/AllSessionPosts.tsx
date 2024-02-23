'use client';

import React, { useState } from 'react'
import { api } from "app/trpc/react";
import LoadingSpinner from './LoadingSpinner';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import Image from 'next/image';
import { HeartOutlined } from '@ant-design/icons';
import DeletePost from './DeletePost';
dayjs.extend(relativeTime);

interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

const AllSessionPosts = (props: { user: User }) => {
    const { data,  /* isLoading: postsLoading,*/ isFetching: postsFetching, isFetched: postsFetched } = api.post.getAllSession.useQuery();
    const [id, setId] = useState<number | null>();
    const { user } = props;
    const handleDeletePost = (id: number) => {
        setId(id);
    };
    
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
                data?.posts.length === 0
                &&
                postsFetched
                &&
                !postsFetching
                &&
                <span className='flex justify-center text-2xl mt-2 text-blue-600'> No posts yet. </span>
            }

            {
                data?.posts.map(
                    (post) => (
                        <div className='max-w-[100%]  border-b border-gray-700 p-2' key={post.id}>
                            {
                                post?.id === id
                                    ?
                                    <span className='flex justify-center text-2xl text-red-500'> Deleted </span>
                                    :
                                    <div className=' flex flex-row gap-2 items-start '>
                                        <div className='flex-shrink-0'>
                                            <Image className="h-12 w-12 rounded-full" src={user.image ?? ''} width={64} height={64} alt="User Avatar" />
                                        </div>
                                        <div className='flex flex-col flex-grow min-w-[300px]'>
                                            <div className='flex flex-row gap-1'>
                                                <span className={`${user.id === post?.createdById ? 'text-blue-500 items-end' : 'opacity-25'}`}>
                                                    @{user.name}
                                                </span>
                                                <span className='opacity-25 flex'>· {`${dayjs(post.createdAt).fromNow()}`}</span>
                                            </div>
                                            <span className='w-full break-words'>{post.name}</span>
                                            <div>
                                                <HeartOutlined className='mt-4 hover:text-red-500 hover:scale-125 cursor-pointer' />
                                            </div>

                                        </div>
                                        {
                                            user.id === post.createdById
                                            &&
                                            <div className='flex flex-row'>
                                                <div>
                                                    <DeletePost onDelete={handleDeletePost} id={post.id} isFetching={postsFetching} />
                                                </div>
                                            </div>
                                        }
                                    </div>
                            }
                        </div>
                    ))
            }
        </div>
    )
}

export default AllSessionPosts