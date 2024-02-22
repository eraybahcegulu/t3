"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "app/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
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
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="What is happening?! "
        className="grow bg-transparent outline-none"

      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
