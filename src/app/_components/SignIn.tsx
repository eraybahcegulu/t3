import Link from 'next/link'
import React from 'react'

const SignIn = () => {
    return (
        <Link href={"/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
            Sign In
        </Link>
    )
}

export default SignIn