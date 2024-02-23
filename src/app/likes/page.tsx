import { getServerAuthSession } from 'app/server/auth';
import { unstable_noStore as noStore } from "next/cache";
import React from 'react'
import SignIn from '../_components/SignIn';

export default async function Likes() {
    noStore();

    const session = await getServerAuthSession();
    return (
        <main className="flex min-h-screen max-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            {
                session
                    ?
                    <div>posts page</div>
                    :
                    <SignIn />
            }
        </main >
    )
}

