'use client';

import React, { useState } from 'react';
import { api } from 'app/trpc/react';
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import DeletePost from './DeletePost';
dayjs.extend(relativeTime);

const AllPosts = (props: { userId: string }) => {
    const { data,  /* isLoading: postsLoading,*/ isFetching: postsFetching } = api.post.getAll.useQuery();
    const [id, setId] = useState<number | undefined>();

    const handleDeletePost = (id: number) => {
        setId(id);
    };
    return (
        <div className='h-full overflow-y-auto'>
            {
                postsFetching && !id
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
                data?.map(
                    (post) => (
                        <div className='max-w-[100%]  flex flex-row items-start gap-2 border-b border-gray-700 p-2' key={post.id}>
                            {
                                post?.id === id
                                    ? <LoadingSpinner />
                                    : <>
                                        <div className='flex-shrink-0'>
                                            <Image className="h-12 w-12 rounded-full" src={post?.author?.image ?? ''} width={64} height={64} alt="User Avatar" />
                                        </div>
                                        <div className='flex flex-col flex-grow min-w-[300px]'>
                                            <div className='flex flex-row'>
                                                <span className={`${props.userId === post?.author?.id ? 'text-blue-500 items-end' : 'opacity-25'}`}>
                                                    @{post?.author?.name}
                                                </span>
                                                <span className='opacity-25 flex'> · {` ${dayjs(post.createdAt).fromNow()}`}</span>
                                            </div>
                                            <span className='w-full break-words'>{post.name}</span>
                                        </div>
                                        {props.userId === post?.author?.id &&
                                            <div className='flex flex-row'>
                                                <div>
                                                    <DeletePost onDelete={handleDeletePost} id={post.id} isFetching={postsFetching} />
                                                </div>
                                            </div>
                                        }
                                    </>
                            }


                        </div>
                    ))
            }
        </div >
    );
};

export default AllPosts;
