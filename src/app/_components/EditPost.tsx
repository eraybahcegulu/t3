"use client";

import { useState } from "react";
import { api } from "app/trpc/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

export function EditPost({ existName, id }: { existName: string, id: number }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [changing, setChanging] = useState(false);
    const ctx = api.useContext();
    const editPost = api.post.edit.useMutation({
        onSuccess: (res) => {
            router.refresh();
            void ctx.post.getAll.fetch();
            void ctx.post.getAllSession.fetch();
            void ctx.post.getLikesPost.fetch();
            if (res.error) {
                setTimeout(() => toast.error(res.error), 5000);
            } else if (res.message) {
                setTimeout(() => toast.success(res.message), 5000);
            }
            setTimeout(() => {
                setChanging(false)
            }, 5000);
        },

        onError: (error) => {
            toast.error(error.message)
        }
    });

    return (
        <form
            onSubmit={(e) => {
                setChanging(true)
                e.preventDefault();
                editPost.mutate({ name, id });
            }}
            className="flex flex-col justify-center items-center grow gap-4"
        >
            <TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
                maxLength={150}
                onChange={(e) => setName(e.target.value)}
                defaultValue={existName}
                className="ant-input grow"
                style={{ backgroundColor: 'transparent', border: '1px solid #d9d9d9', borderRadius: '15px', padding: '6px', color: 'white', }}
                disabled={editPost.isLoading || changing}
            />
            <button
                type="submit"
                className="text-sm w-[100px] rounded-full bg-white/10 px-4 py-4 font-semibold transition hover:bg-white/20"
                style={{
                    opacity: editPost.isLoading || name.length === 0 || name === existName || changing ? 0.5 : 1,
                    pointerEvents: editPost.isLoading || name.length === 0 || name === existName || changing ? 'none' : 'auto'
                }}
                disabled={editPost.isLoading || name.length === 0 || name === existName || changing}
            >
                {
                    changing && !editPost.isLoading && "Editing..."
                }
                {editPost.isLoading && <LoadingOutlined />}
                {
                    !editPost.isLoading && !changing && "Edit"
                }
            </button>
        </form>
    );
}
