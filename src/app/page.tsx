import { unstable_noStore as noStore } from "next/cache";
import { getServerAuthSession } from "app/server/auth";

import { CreatePost } from "./_components/CreatePost";

import SignIn from "./_components/SignIn";

import Image from "next/image";
import AllPosts from "./_components/AllPosts";

export default async function Home() {
  noStore();

  const session = await getServerAuthSession();

  return (

    <main className="flex min-h-screen max-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {
        session
          ?
          <div className="flex flex-col min-h-screen min-w-[30%] max-w-[400px] justify-start border-x border-gray-700">
            <div className="flex flex-row justify-center gap-4 w-full p-2 border-y border-gray-700">
              <Image className="h-20 w-20 rounded-full" src={session.user.image ?? ""} width={64} height={64} alt="User Avatar" />
              <CreatePost userName={session.user.name ?? ""} />
            </div>

            <AllPosts />

          </div>
          :
          <SignIn />
      }

    </main >
  );
}

