'use client';

import { api } from 'app/trpc/react'
import Image from 'next/image';
import React from 'react'
import LoadingSpinner from './LoadingSpinner';
import CancelFriendRequest from './CancelFriendRequest';

const SentFriendRequests = () => {
    const { data, isLoading, isFetched } = api.friendship.getSentRequests.useQuery()

    if (isLoading ) return (
        <div className='flex flex-col items-center justify-start max-h-[200px] w-full overflow-x-auto gap-2 p-2'>
            <LoadingSpinner />
        </div>
    )
    return (
        <div className='flex flex-col items-center justify-start max-h-[200px] w-full overflow-x-auto gap-2 p-2'>
            {
                data?.length === 0
                &&
                isFetched
                &&
                <span> Not Found</span>
            }
            {data?.map((request) => (
                <span className='w-full flex flex-row justify-start items-center gap-1 border-b pb-2' key={request.id}>
                    <Image className="rounded-full" src={request?.receiver.image ?? ''} width={30} height={30} alt="User Avatar" />
                    <span className='max-w-[125px]'>       {request.receiver.name} </span>

                    <div className='flex justify-end gap-1 items-end w-full'>
                        <CancelFriendRequest requestId={request.id} />
                    </div>
                </span>
            ))}
        </div>
    )
}

export default SentFriendRequests