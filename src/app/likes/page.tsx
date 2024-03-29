import { getServerAuthSession } from 'app/server/auth';
import { unstable_noStore as noStore } from "next/cache";
import React from 'react'
import SignIn from '../_components/Buttons/SignIn';
import SignOut from '../_components/Buttons/SignOut';
import Loby from '../_components/Loby';
import AllLikes from '../_components/AllLikes';
import MyPosts from '../_components/Buttons/MyPosts';
import { api } from 'app/trpc/server';

export default async function Likes() {
    noStore();
    const myLikesGreeting = await api.post.myLikesGreeting.query();
    const session = await getServerAuthSession();
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            {
                session
                    ?

                    <div className="flex flex-col min-h-screen min-w-[30%] max-w-[400px] justify-start border-x border-gray-700">
                        <div className="flex flex-col border-b py-5  border-gray-700 justify-center items-center pb-2">
                            <div className="flex flex-row">
                                <Loby />
                                <MyPosts />
                            </div>
                            <span className="text-2xl opacity-25 my-2"> {myLikesGreeting.greeting} </span>
                        </div>
                        <AllLikes user={session.user} />
                        <div className="mt-auto">
                            <div className="flex justify-center items-end m-4">
                                <SignOut />
                            </div>
                        </div>
                    </div>
                    :
                    <SignIn />
            }
        </main >
    )
}

