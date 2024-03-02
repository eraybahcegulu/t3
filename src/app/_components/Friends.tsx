import { api } from 'app/trpc/react';
import Image from 'next/image';
import React from 'react'
import LoadingSpinner from './LoadingSpinner';
import DeleteFriend from './DeleteFriend';

const Friends = () => {
    const { data, isLoading, isFetching, isFetched } = api.friendship.getFriends.useQuery();

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
                <span> Not Found</span>
            }
            {data?.map((friend) => (
                <div className='w-full flex flex-row justify-start items-center gap-1 border-b pb-2' key={friend.id}>
                    <Image className="rounded-full" src={friend.image ?? ''} width={30} height={30} alt="User Avatar" />
                    <span className='max-w-[125px]'> {friend.name} </span>

                    <div className='w-full flex flex-row justify-end'>
                        <DeleteFriend friendId={friend.id} />
                    </div>

                </div>
            ))}
        </div>
    )
}

export default Friends