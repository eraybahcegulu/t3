import { EditPost } from "app/app/_components/EditPost";
import Loby from "app/app/_components/Loby";
import MyLikes from "app/app/_components/MyLikes";
import MyPosts from "app/app/_components/MyPosts";
import SignIn from "app/app/_components/SignIn";
import SignOut from "app/app/_components/SignOut";
import { getServerAuthSession } from "app/server/auth";
import { api } from "app/trpc/server";
import Image from "next/image";

const Edit = async ({ params }: { params: { id: string } }) => {

    const session = await getServerAuthSession();
    const editPostGreeting = await api.post.editPostGreeting.query();
    const post = await api.post.getOne.query({ id: parseInt(params.id) });

    if (!post) return <div> <span> Something went wrong</span>  </div>

    return (
        <main className="flex min-h-screen max-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            {
                session
                    ?
                    <div className="flex flex-col min-h-screen min-w-[30%] max-w-[400px] justify-start border-x border-gray-700">
                        <div className="flex flex-col py-5 border-b border-gray-700 justify-center items-center pb-2">
                            <div className="flex flex-row">
                                <Loby />
                                <MyPosts />
                                <MyLikes />
                            </div>
                            <span className="text-2xl opacity-25 my-2"> {editPostGreeting.greeting}</span>
                        </div>


                        <div className=" flex flex-col justify-center items-center mt-auto gap-2 m-4">
                            <Image className="h-20 w-20 rounded-full" src={session.user.image ?? ""} width={64} height={64} alt="User Avatar" />
                            <span className="opacity-25">@{session.user.name}</span>
                            <EditPost existName={post.name} id={post.id} />
                        </div>

                        <div className="mt-auto">
                            <div className="flex justify-center items-end m-5">
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

export default Edit