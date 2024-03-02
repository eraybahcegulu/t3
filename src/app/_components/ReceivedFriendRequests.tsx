"use client";

import { api } from 'app/trpc/react'
import React from 'react'
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';
import { CloseOutlined } from '@ant-design/icons';

const ReceivedFriendRequests = () => {
    const { data, isLoading, isFetched, isFetching } = api.friendship.getReceivedRequests.useQuery()

    if (isLoading || isFetching) return (
        <div className='flex flex-col items-center justify-start h-[200px] w-full overflow-x-auto gap-2 p-2'>
            <LoadingSpinner />
        </div>
    )
    return (
        <div className='flex flex-col items-center justify-start h-[200px] w-full overflow-x-auto gap-2 p-2'>
            {
                data?.length === 0
                &&
                isFetched
                &&
                <span> not Found</span>
            }
            {data?.map((request) => (
                <span className='w-full flex flex-row justify-start items-center gap-1 border-b pb-2' key={request.id}>
                    <Image className="rounded-full" src={request?.sender.image ?? ''} width={30} height={30} alt="User Avatar" />
                    <span className='max-w-[125px]'>       {request.sender.name} </span>

                    <div className='flex justify-end items-end w-full'>
                        <span className='text-red-500 '><CloseOutlined className='hover:scale-110 cursor-pointer transition-all' /> </span>
                    </div>
                </span>
            ))}
        </div>
    )
}

export default ReceivedFriendRequests