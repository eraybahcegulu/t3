import Comments from "app/app/_components/Comments";
import { CreateComment } from "app/app/_components/CreateComment";
import Loby from "app/app/_components/Loby";
import MyLikes from "app/app/_components/MyLikes";
import MyPosts from "app/app/_components/MyPosts";
import { Post } from "app/app/_components/Post";
import SignIn from "app/app/_components/SignIn";
import SignOut from "app/app/_components/SignOut";
import { getServerAuthSession } from "app/server/auth";

import Image from "next/image";

const PostComments = async ({ params }: { params: { id: string } }) => {

    const session = await getServerAuthSession();
    return (
        <main className="flex min-h-screen  flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            {
                session
                    ?
                    <div className="flex flex-col min-h-screen min-w-[30%] max-w-[400px] justify-start border-x border-gray-700">
                        <div className="flex flex-col py-5 border-b border-gray-700 justify-center items-center pb-2">
                            <div className="flex flex-col justify-center gap-4 w-full   border-gray-700">
                                <Post postId={parseInt(params.id)} user={session.user} />

                                <div className="flex flex-row gap-1 p-2">
                                    <div className="flex flex-col items-center">
                                        <Image className="h-20 w-20 rounded-full" src={session.user.image ?? ""} width={64} height={64} alt="User Avatar" />
                                    </div>
                                    <CreateComment postId={parseInt(params.id)} />
                                </div>


                            </div>
                            <div className="flex flex-row">
                                <Loby />
                                <MyPosts />
                                <MyLikes />
                            </div>

                        </div>

                        <div>
                            <Comments user={session.user} postId={parseInt(params.id)}/>
                        </div>

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
    )
}

export default PostComments