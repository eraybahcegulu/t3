"use client";

import { useState } from "react";
import { api } from "app/trpc/react";
import toast from "react-hot-toast";

interface Res {
  message?: string;
  error?: string;
}

export function CreatePost(props: { userName: string }) {

  const [name, setName] = useState("");
  const ctx = api.useContext();
  const createPost = api.post.create.useMutation({
    onSuccess: (res: Res) => {
      void ctx.post.getAll.fetch();
      void ctx.post.getAllSession.fetch();
      if (res.error) {
        console.log(res.error)
        toast.error(res.error)
      } else if (res.message) {
        toast.success(res.message)
      }
      setName("");
    },
    onError: (error) => {
      toast.error(error.message)
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name });
      }}
      className="flex flex-row justify-center items-center grow gap-1"
    >
      <input
        maxLength={150}
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder={`What is happening? @${props.userName}`}
        className="grow bg-transparent outline-none "
        disabled={createPost.isLoading}
      />
      <button
        type="submit"
        className="text-sm w-[100px] rounded-full bg-white/10 px-4 py-4 font-semibold transition hover:bg-white/20"
        style={{ opacity: createPost.isLoading || name.length === 0 ? 0.5 : 1, pointerEvents: createPost.isLoading || name.length === 0 ? 'none' : 'auto' }}
        disabled={createPost.isLoading || name.length === 0}
      >
        {createPost.isLoading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
