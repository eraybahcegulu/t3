import Link from 'next/link'
import React from 'react'

const MyPosts = () => {
  return (
    <Link href={"/posts"} className="m-2 rounded-full cursor-pointer bg-white/10 px-4 py-3 font-semibold no-underline transition hover:bg-white/20"> My Posts </Link>
  )
}

export default MyPosts