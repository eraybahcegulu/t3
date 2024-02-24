"use client";

import { api } from "app/trpc/react";
import toast from "react-hot-toast";
import { HeartOutlined } from "@ant-design/icons";

interface Res {
    message?: string;
    error?: string;
}

export function LikePost({ id }: { id: number }) {
    const ctx = api.useContext();
    const likePost = api.post.like.useMutation({
        onSuccess: (res: Res) => {
            void ctx.post.getAll.fetch();
            void ctx.post.getAllSession.fetch();
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
        <HeartOutlined
            onClick={() => {
                likePost.mutate({ id });
            }} className='opacity-25 mt-4 hover:text-red-500 hover:opacity-100 transition-all hover:scale-125 cursor-pointer' />
    );
}
