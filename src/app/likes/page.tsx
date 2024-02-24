import { getServerAuthSession } from 'app/server/auth';
import { unstable_noStore as noStore } from "next/cache";
import React from 'react'
import SignIn from '../_components/SignIn';
import SignOut from '../_components/SignOut';
import Loby from '../_components/Loby';
import AllLikes from '../_components/AllLikes';

export default async function Likes() {
    noStore();

    const session = await getServerAuthSession();
    return (
        <main className="flex min-h-screen max-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            {
                session
                    ?

                    <div className="flex flex-col min-h-screen min-w-[30%] max-w-[400px] justify-start border-x border-gray-700">
                        <div className="flex justify-center border-b border-gray-700 items-end py-5">
                            <Loby />
                        </div>
                        <AllLikes user={session.user} />
                        <div className="flex justify-center items-end m-5">
                            <SignOut />
                        </div>
                    </div>
                    :
                    <SignIn />
            }
        </main >
    )
}

