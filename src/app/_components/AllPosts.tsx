'use client';

import React, { useState } from 'react';
import { api } from 'app/trpc/react';
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import DeletePost from './DeletePost';
import { LikePost } from './LikePost';
import { EditOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { TfiComment } from 'react-icons/tfi';
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
        <div className='max-h-[600px] overflow-y-auto'>
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
                <div>
                    <span>Something went wrong</span>
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
                        <div className=' w-full border-b border-gray-700 p-2  text-nowrap' key={post.id}>
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
                                            <Image className="h-12 w-12 rounded-full" src={post?.createdBy.image ?? ''} width={64} height={64} alt="User Avatar" />
                                        </div>
                                        <div className='flex flex-col flex-grow '>
                                            <div className='flex flex-row gap-1'>
                                                <span className={`${props.userId === post?.createdById ? 'text-blue-500 items-end' : 'opacity-25'}`}>
                                                    @{post?.createdBy.name}
                                                </span>
                                                <span className='opacity-25'>· {`${dayjs(post.createdAt).fromNow()}`}</span>
                                                {
                                                    post?.isEdited &&
                                                    <span className='opacity-25'> · edited </span>
                                                }
                                            </div>
                                            <span className='w-full break-words'>{post.name}</span>

                                            <div className='flex flex-row gap-10 mt-4 items-center'>
                                                <div className='flex flex-row gap-1 w-[50px]'>
                                                    {
                                                        userLikes?.userLikes.some((like) => like.postId === post.id)
                                                            ?
                                                            <LikePost liked={true} id={post.id} />
                                                            :
                                                            <LikePost liked={false} id={post.id} />
                                                    }
                                                    <span className='opacity-25'>
                                                        {
                                                            post.likes.length > 0
                                                            &&
                                                            post.likes.length
                                                        }
                                                    </span>
                                                </div>
                                                <div className='flex flex-row gap-1'>
                                                    <Link href={`/posts/${post?.id}`} className='pt-1'>
                                                        <TfiComment className=" opacity-25 hover:text-blue-600 hover:opacity-100 transition-all hover:scale-125 cursor-pointer" />
                                                    </Link>
                                                    <span className='opacity-25'>
                                                        {
                                                            post.comments.length > 0
                                                            &&
                                                            post.comments.length
                                                        }
                                                    </span>
                                                </div>
                                            </div>


                                        </div>
                                        {props.userId === post?.createdBy.id
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
        </div >
    );
};

export default AllPosts;
