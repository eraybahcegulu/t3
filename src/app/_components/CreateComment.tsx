"use client";

import { useState } from "react";
import { api } from "app/trpc/react";
import toast from "react-hot-toast";

interface Res {
    message?: string;
    error?: string;
}

export function CreateComment( {postId} : {postId: number }) {
    const [name, setName] = useState("");
    const ctx = api.useContext();
    const createComment = api.comment.create.useMutation({
        onSuccess: (res: Res) => {
            void ctx.post.getAll.fetch();
            void ctx.post.getAllSession.fetch();
            void ctx.comment.getAll.fetch({postId});
            if (res.error) {
                toast.error(res.error)
            } else if (res.message) {
                toast.success(res.message)
            }
            setName("");
        },
        onError: (error) => {
            const errorMessage = error.data?.zodError?.fieldErrors.name;
            if (errorMessage?.[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("An error occurred");
            }
        }
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                createComment.mutate({ postId, name});
            }}
            className="flex flex-row justify-center items-center grow gap-1"
        >
            <input
                maxLength={150}
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder={`Post your reply`}
                className="grow bg-transparent outline-none "
                disabled={createComment.isLoading}
            />

            <button
                type="submit"
                className="text-sm w-[100px] rounded-full bg-white/10 px-4 py-4 font-semibold transition hover:bg-white/20"
                style={{ opacity: createComment.isLoading || name.length === 0 ? 0.5 : 1, pointerEvents: createComment.isLoading || name.length === 0 ? 'none' : 'auto' }}
                disabled={createComment.isLoading || name.length === 0}
            >
                {createComment.isLoading ? "Posting..." : "Post"}
            </button>
        </form>
    );
}
