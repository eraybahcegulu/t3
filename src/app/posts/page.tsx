import { getServerAuthSession } from "app/server/auth";
import { unstable_noStore as noStore } from "next/cache";
import React from 'react'
import SignIn from '../_components/Buttons/SignIn';
import AllSessionPosts from '../_components/AllSessionPosts';
import Loby from '../_components/Loby';
import SignOut from '../_components/Buttons/SignOut';
import MyLikes from '../_components/Buttons/MyLikes';
import { api } from "app/trpc/server";

export default async function Posts() {
    noStore();
    const myPostsGreeting = await api.post.myPostsGreeting.query();
    const session = await getServerAuthSession();
    return (
        <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            {
                session
                    ?
                    <div className="flex flex-col min-h-screen min-w-[30%] max-w-[400px] justify-start border-x border-gray-700">
                        <div className="flex flex-col py-5 border-b border-gray-700 justify-center items-center pb-2">
                            <div className="flex flex-row">
                                <Loby />
                                <MyLikes />
                            </div>
                            <span className="text-2xl opacity-25 my-2"> {myPostsGreeting.greeting}</span>
                        </div>
                        <AllSessionPosts user={session.user} />
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

