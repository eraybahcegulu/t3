import { unstable_noStore as noStore } from "next/cache";
import { getServerAuthSession } from "app/server/auth";


import { CreatePost } from "./_components/create-post";
import Posts from "./_components/Posts";


export default async function Home() {
  noStore();

  const session = await getServerAuthSession();
  
  return (

    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div>
        {
          session
          &&
          <span>
            <Posts/>
            {session.user.email}
            <CreatePost />
          </span>

        }
      </div>
    </main >
  );
}


