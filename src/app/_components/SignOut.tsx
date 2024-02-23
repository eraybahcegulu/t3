import Link from 'next/link'
import React from 'react'

const SignOut = () => {
    return (
        <Link href={"/api/auth/signout"}
        className="rounded-full bg-white/10 mt-4 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
    > Sign Out
    </Link >
    )
}

export default SignOut