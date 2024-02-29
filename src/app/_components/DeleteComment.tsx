"use client";

import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { api } from 'app/trpc/react';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";

const DeleteComment = ({ id, postId, isFetching, onDelete }: { id: number, postId: number, isFetching: boolean, onDelete: (id: number) => void }) => {
    const [openModal, setOpenModal] = useState(false);
    const ctx = api.useContext();

    const deleteComment = api.comment.delete.useMutation({
        onSuccess: () => {
            onDelete(id);
            void ctx.comment.getAll.fetch({postId});
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
                title="Delete Comment"
                open={openModal}
                onOk={() => {

                    deleteComment.mutate({ id });
                }}
                onCancel={() => setOpenModal(false)}
                okText="Delete"
                cancelText="Cancel"
                closable={false}
                centered
                footer={[
                    <Button key="cancel" onClick={() => setOpenModal(false)} disabled={deleteComment.isLoading}>Cancel</Button>,
                    <Button key="delete" type="primary" 
                    onClick={() => {
                        deleteComment.mutate({ id });
                    }}
                    disabled={deleteComment.isLoading}>
                        {deleteComment.isLoading ? <p> Deleting... <LoadingOutlined /></p> : "Delete"}
                    </Button>
                ]}
            >
                <p>Are you sure you want to delete this comment?</p>
            </Modal>
        </>
    );
};

export default DeleteComment;