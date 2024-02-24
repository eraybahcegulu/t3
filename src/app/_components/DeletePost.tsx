"use client";

import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { api } from 'app/trpc/react';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";

const DeletePost = ({ id, isFetching, onDelete }: { id: number, isFetching: boolean, onDelete: (id: number) => void }) => {
    const [openModal, setOpenModal] = useState(false);
    const ctx = api.useContext();

    const deletePost = api.post.delete.useMutation({
        onSuccess: () => {
            onDelete(id);
            void ctx.post.getAll.fetch();
            void ctx.post.getAllSession.fetch();
            void ctx.post.getLikesPost.fetch();
            setOpenModal(false);
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });


    const handleDeletePost = () => {
        setOpenModal(true);
    }

    return (
        <>
            <DeleteOutlined
                style={{
                    color: isFetching ? 'gray' : 'red',
                    cursor: isFetching ? 'default' : 'pointer'
                }}
                className={`text-xl text-red-500 transition-all ${isFetching ? '' : ' hover:scale-125 cursor-pointer'}`}
                onClick={handleDeletePost}
                disabled={isFetching}
            />
            <Modal
                title="Delete Post"
                open={openModal}
                onOk={() => {

                    deletePost.mutate({ id });
                }}
                onCancel={() => setOpenModal(false)}
                okText="Delete"
                cancelText="Cancel"
                closable={false}
                centered
                footer={[
                    <Button key="cancel" onClick={() => setOpenModal(false)} disabled={deletePost.isLoading}>Cancel</Button>,
                    <Button key="delete" type="primary" 
                    onClick={() => {
                        deletePost.mutate({ id });
                    }}
                    disabled={deletePost.isLoading}>
                        {deletePost.isLoading ? <p> Deleting... <LoadingOutlined /></p> : "Delete"}
                    </Button>
                ]}
            >
                <p>Are you sure you want to delete this post?</p>
            </Modal>
        </>
    );
};

export default DeletePost;