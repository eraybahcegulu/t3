import Link from 'next/link'
import React from 'react'

const Loby = () => {
    return (
        <Link href={"/"}
            className="m-2 rounded-full cursor-pointer bg-white/10 px-6 py-3 font-semibold no-underline transition hover:bg-white/20">
            Loby
        </Link>
    )
}

export default Loby