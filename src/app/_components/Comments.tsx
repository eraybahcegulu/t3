'use client';

import { api } from 'app/trpc/react'
import Image from 'next/image';
import React, { useState } from 'react';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingSpinner from './LoadingSpinner';
import DeleteComment from './DeleteComment';
dayjs.extend(relativeTime);

interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

const Comments = ({ postId, user }: { postId: number, user: User }) => {
    const { data, isLoading: commentsLoading, isFetching: commentsFetching, isFetched: commentsFetched } = api.comment.getAll.useQuery({ postId })
    const [id, setId] = useState<number | null>();
    const handleDeleteComment = (id: number) => {
        setId(id);
    };

    if (commentsLoading) return (<LoadingSpinner p={"4"} />)

    return (
        <div className='max-h-[500px] overflow-y-auto'>
            {
                commentsFetching
                &&

                <LoadingSpinner p={"4"} />
            }
            {
                !data
                &&
                !commentsFetching
                &&
                <div>
                    <span>Something went wrong</span>
                </div>
            }


            {
                data?.length === 0
                &&
                commentsFetched
                &&
                !commentsFetching
                &&
                <span className='flex justify-center text-2xl mt-2 text-blue-600'> No comment yet. </span>
            }
            {data?.map((comment) => (
                <div className='max-w-[100%]  border-b border-gray-700 p-2 text-nowrap' key={comment.id}>
                    {
                        comment.id === id
                            ?
                            <span className='flex justify-center text-2xl text-red-500'> Deleted </span>
                            :
                            <div className=' flex flex-row gap-2 items-start '>
                                <div className='flex-shrink-0'>
                                    <Image className="h-12 w-12 rounded-full" src={comment?.createdBy.image ?? ''} width={64} height={64} alt="User Avatar" />
                                </div>
                                <div className='flex flex-col flex-grow'>
                                    <div className='flex flex-row gap-1'>
                                        <span className={`${user.id === comment?.createdById ? 'text-blue-500 items-end' : 'opacity-25'}`}>
                                            @{comment?.createdBy.name}
                                        </span>
                                        <span className='opacity-25'>· {`${dayjs(comment.createdAt).fromNow()}`}</span>

                                    </div>
                                    <span className='w-full break-words'>{comment.name}</span>
                                </div>

                                {user.id === comment.createdById
                                    &&
                                    <div className='flex flex-row gap-1 justify-center items-center'>
                                        <DeleteComment id={comment.id} postId={comment.postId} isFetching={commentsFetching} onDelete={handleDeleteComment} />
                                    </div>
                                }
                            </div>
                    }
                </div>
            ))}
        </div>
    )
}

export default Comments