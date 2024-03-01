'use client';

import { api } from 'app/trpc/react'
import React from 'react'

const SentFriendRequests = () => {
    const { data } = api.friendship.getSentRequests.useQuery()
    return (
        <div className='flex flex-col items-center justify-start border border-black h-[200px] w-full overflow-x-auto gap-2 p-2'>
            {data?.map((requst) => (
                <span className='border border-black w-full' key={requst.id}> {requst.receiver.name} </span>
            ))}
        </div>
    )
}

export default SentFriendRequests