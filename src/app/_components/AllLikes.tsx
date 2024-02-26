'use client';

import React, { useState } from 'react'
import { api } from "app/trpc/react";
import LoadingSpinner from './LoadingSpinner';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import Image from 'next/image';
import DeletePost from './DeletePost';
import { LikePost } from './LikePost';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
dayjs.extend(relativeTime);

interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

const AllLikes = (props: { user: User }) => {
    const { data,  /* isLoading: postsLoading,*/ isFetching: postsFetching, isFetched: postsFetched } = api.post.getLikesPost.useQuery();
    const { data: userLikes } = api.post.getLikes.useQuery();
    const [id, setId] = useState<number | null>();
    const { user } = props;
    const handleDeletePost = (id: number) => {
        setId(id);
    };

    console.log(data)

    return (
        <div className='h-full overflow-y-auto'>
            {
                postsFetching
                &&
                <LoadingSpinner p={"4"} />
            }
            {
                (!data)
                &&
                !postsFetching
                &&
                <div> <span> Something went wrong</span>  </div>
            }

            {
                data?.length === 0
                &&
                postsFetched
                &&
                !postsFetching
                &&
                <span className='flex justify-center text-2xl mt-2 text-blue-600'> No liked posts yet. </span>
            }

            {
                data?.map(
                    (post) => (
                        <div className='max-w-[100%]  border-b border-gray-700 p-2' key={post.id}>
                            {

                                post?.id === id
                                    ?
                                    <span className='flex justify-center text-2xl text-red-500'> Deleted </span>
                                    :
                                    <div className=' flex flex-row gap-2 items-start '>
                                        <div className='flex-shrink-0'>
                                            <Image className="h-12 w-12 rounded-full" src={post.author?.image ?? ''} width={64} height={64} alt="User Avatar" />
                                        </div>
                                        <div className='flex flex-col flex-grow min-w-[300px]'>
                                            <div className='flex flex-row gap-1'>
                                                <span className={`${user.id === post?.createdById ? 'text-blue-500 items-end' : 'opacity-25'}`}>
                                                    @{post.author?.name}
                                                </span>
                                                <span className='opacity-25'>· {`${dayjs(post?.createdAt).fromNow()}`}</span>
                                                {
                                                    post?.isEdited &&
                                                    <span className='opacity-25'> · edited </span>
                                                }
                                            </div>
                                            <span className='w-full break-words'>{post.name}</span>
                                            <div className='flex flex-row mt-4 gap-1 items-center'>
                                                {
                                                    userLikes?.userLikes.some((like) => like.postId === post.id)
                                                        ?
                                                        <LikePost liked={true} id={post.id} />
                                                        :
                                                        <LikePost liked={false} id={post.id} />
                                                }
                                                <span className='opacity-25'>
                                                    {
                                                        post.likedCount > 0
                                                        &&
                                                        post.likedCount
                                                    }
                                                </span>
                                            </div>

                                        </div>
                                        {
                                            user.id === post.createdById
                                            &&
                                            <div className='flex flex-row gap-1 justify-center items-center'>
                                                <Link href={`/posts/edit/${post?.id}`} className='pt-1'>
                                                    <EditOutlined
                                                        style={{
                                                            color: postsFetching ? 'gray' : '#1F75FE',
                                                            cursor: postsFetching ? 'default' : 'pointer'
                                                        }}
                                                        className={`text-xl transition-all ${postsFetching ? '' : ' hover:scale-125 cursor-pointer'}`}
                                                    />
                                                </Link>
                                                <DeletePost onDelete={handleDeletePost} id={post.id} isFetching={postsFetching} />
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

export default AllLikes