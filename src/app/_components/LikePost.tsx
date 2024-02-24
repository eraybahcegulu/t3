"use client";

import { api } from "app/trpc/react";
import toast from "react-hot-toast";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoHeart } from "react-icons/io5";

interface Res {
    message?: string;
    error?: string;
}

export function LikePost({ id, liked }: { id: number, liked: boolean }) {
    const ctx = api.useContext();
    const likePost = api.post.like.useMutation({
        onSuccess: (res: Res) => {
            void ctx.post.getLikes.fetch();
            if (res.error) {
                void toast.error(res.error)
            } else if (res.message) {
                toast.success(res.message)
            }
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    return (
        <>
            {
                liked
                    ?
                    <IoHeart
                        onClick={() => {
                            likePost.mutate({ id });
                        }}
                        className="text-xl mt-4 text-red-600 transition-all hover:scale-125 cursor-pointer"
                    />
                    :
                    <IoMdHeartEmpty
                        onClick={() => {
                            likePost.mutate({ id });
                        }}
                        className="opacity-25 text-xl mt-4 hover:text-red-600 hover:opacity-100 transition-all hover:scale-125 cursor-pointer"
                    />
            }
        </>
    );
}
