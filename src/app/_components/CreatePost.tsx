"use client";

import { useState } from "react";
import { api } from "app/trpc/react";
import toast from "react-hot-toast";

export function CreatePost(props: { userName: string }) {

  const [name, setName] = useState("");
  const ctx = api.useContext();
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      void ctx.post.getAll.invalidate();
      toast.success('Posted')
      setName("");
    },
    onError: () => {
      toast.error('Failed to post')
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
        maxLength={200}
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
