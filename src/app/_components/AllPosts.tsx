'use client';

import React, { useState } from 'react';
import { api } from 'app/trpc/react';
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import DeletePost from './DeletePost';
import { LikePost } from './LikePost';
dayjs.extend(relativeTime);

const AllPosts = (props: { userId: string }) => {
    const { data, isLoading: postsLoading, isFetching: postsFetching, isFetched: postFetcheds } = api.post.getAll.useQuery();
    const { data: userLikes } = api.post.getLikes.useQuery();
    const [id, setId] = useState<number | null>();

    const handleDeletePost = (id: number) => {
        setId(id);
    };

    if (postsLoading) return <LoadingSpinner p={"4"} />

    return (
        <div className='h-full overflow-y-auto'>
            {
                (postsFetching)
                &&
                <LoadingSpinner p={"4"} />
            }

            {
                !data
                &&
                !postsFetching
                &&
                <div><span>Something went wrong</span>
                </div>
            }

            {
                data?.length === 0
                &&
                postFetcheds
                &&
                !postsFetching
                &&
                <span className='flex justify-center text-2xl mt-2 text-blue-600'> No posts yet. </span>
            }
            {
                data?.map(
                    (post) => (
                        <div className='max-w-[100%]  border-b border-gray-700 p-2' key={post.id}>
                            {
                                postFetcheds
                                    &&
                                    !postsLoading
                                    &&
                                    post?.id === id
                                    ?
                                    <span className='flex justify-center text-2xl text-red-500'> Deleted </span>
                                    :
                                    <div className=' flex flex-row gap-2 items-start '>
                                        <div className='flex-shrink-0'>
                                            <Image className="h-12 w-12 rounded-full" src={post?.author?.image ?? ''} width={64} height={64} alt="User Avatar" />
                                        </div>
                                        <div className='flex flex-col flex-grow min-w-[300px]'>
                                            <div className='flex flex-row gap-1'>
                                                <span className={`${props.userId === post?.author?.id ? 'text-blue-500 items-end' : 'opacity-25'}`}>
                                                    @{post?.author?.name}
                                                </span>
                                                <span className='opacity-25 flex'>· {`${dayjs(post.createdAt).fromNow()}`}</span>
                                            </div>
                                            <span className='w-full break-words'>{post.name}</span>
                                            <div>
                                                {
                                                    userLikes?.userLikes.some((like) => like.postId === post.id)
                                                        ?
                                                        <LikePost liked={true} id={post.id} />
                                                        :
                                                        <LikePost liked={false} id={post.id} />
                                                }
                                            </div>

                                        </div>
                                        {props.userId === post?.author?.id
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
        </div >
    );
};

export default AllPosts;
