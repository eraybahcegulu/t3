"use client";

import { api } from 'app/trpc/react';
import Image from 'next/image';
import React, { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { LikePost } from './LikePost';
import LoadingSpinner from './LoadingSpinner';
import { EditOutlined } from '@ant-design/icons';
import Link from 'next/link';
import DeletePost from './DeletePost';
dayjs.extend(relativeTime);

interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

export function Post({ postId, user }: { postId: number, user: User }) {
    const { data, isLoading: postLoading, isFetched: postFetched, isFetching: postFetching } = api.post.getOne.useQuery({ postId });
    const { data: userLikes } = api.post.getLikes.useQuery();
    const [id, setId] = useState<number | null>();
    const handleDeletePost = (id: number) => {
        setId(id);
    };

    if (postFetching || postLoading) return (<div className='max-w-[100%] border-b border-gray-700 p-2'> <LoadingSpinner p={"4"} /> </div> )

    if (!data && !postFetching) return <div className='flex flex-col justify-center items-center'> <span>Something went wrong</span> </div>

    return (
        <div className='max-w-[100%] border-b border-gray-700 p-2' >

            {
                postId === id && postFetched
                    ?
                    <span className='flex justify-center text-2xl text-red-500'> Deleted </span>
                    :
                    <div className=' flex flex-row gap-2 items-start'>
                        <div className='flex-shrink-0'>
                            <Image className="h-12 w-12 rounded-full" src={data?.createdBy.image ?? ''} width={64} height={64} alt="User Avatar" />
                        </div>
                        <div className='flex flex-col flex-grow '>
                            <div className='flex flex-row gap-1'>
                                <span className={`${user.id === data?.createdById ? 'text-blue-500 items-end' : 'opacity-25'}`}>
                                    @{data?.createdBy.name}
                                </span>
                                <span className='opacity-25'>· {`${dayjs(data?.createdAt).fromNow()}`}</span>
                                {
                                    data?.isEdited &&
                                    <span className='opacity-25'> · edited </span>
                                }
                            </div>
                            <span className='w-full break-words'>{data?.name}</span>

                            <div className='flex flex-row mt-4 gap-10 items-center'>
                                <div className='flex flex-row gap-1'>
                                    {
                                        userLikes?.userLikes.some((like) => like.postId === data?.id)
                                            ?
                                            <LikePost liked={true} id={postId} />
                                            :
                                            <LikePost liked={false} id={postId} />
                                    }
                                    <span className='opacity-25'>
                                        {
                                            data && data.likes.length > 0
                                            &&
                                            data.likes.length
                                        }
                                    </span>
                                </div>
                            </div>


                        </div>
                        {user.id === data?.createdBy.id
                            &&
                            <div className='flex flex-row gap-1 justify-center items-center'>
                                <Link href={`/posts/edit/${data?.id}`} className='pt-1'>
                                    <EditOutlined
                                        style={{
                                            color: postFetching ? 'gray' : '#1F75FE',
                                            cursor: postFetching ? 'default' : 'pointer'
                                        }}
                                        className={`text-xl transition-all ${postFetching ? '' : ' hover:scale-125 cursor-pointer'}`}
                                    />
                                </Link>
                                <DeletePost onDelete={handleDeletePost} id={postId} isFetching={postFetching} />
                            </div>
                        }
                    </div>
            }
        </div>
    )
}