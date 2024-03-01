import { unstable_noStore as noStore } from "next/cache";
import { getServerAuthSession } from "app/server/auth";

import { CreatePost } from "./_components/CreatePost";

import SignIn from "./_components/Buttons/SignIn";

import Image from "next/image";
import AllPosts from "./_components/AllPosts";
import SignOut from "./_components/Buttons/SignOut";
import MyPosts from "./_components/Buttons/MyPosts";
import MyLikes from "./_components/Buttons/MyLikes";
import { api } from "app/trpc/server";
import OpenFriendship from "./_components/Buttons/OpenFriendship";

export default async function Home() {
  noStore();
  const welcomeToLobyGreeting = await api.post.welcomeToLobyGreeting.query();
  const session = await getServerAuthSession();

  return (

    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {
        session
          ?
          <div className="flex flex-col min-h-screen min-w-[30%] max-w-[400px] justify-start border-x border-gray-700">
            <div className="flex flex-row justify-center gap-4 w-full p-2  border-gray-700">
              <div className="flex flex-col items-center">
                <Image className="h-20 w-20 rounded-full" src={session.user.image ?? ""} width={64} height={64} alt="User Avatar" />
              </div>
              <CreatePost userName={session.user.name ?? ""} />
            </div>
            <div className="flex flex-col border-b border-gray-700 justify-center items-center pb-2">
              <div className="flex flex-row ">

                <MyPosts />
                <MyLikes />
                <OpenFriendship/>

              </div>
              <span className="text-2xl opacity-25 my-2"> {  welcomeToLobyGreeting.greeting }</span>
            </div>

            <AllPosts userId={session.user.id ?? ""} />

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
  );
}

