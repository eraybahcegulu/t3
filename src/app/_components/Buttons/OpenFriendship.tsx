'use client';

import React, { useState } from 'react'
import Friendship from '../Friendship';

const OpenFriendship = () => {
    const [openModal, setOpenModal] = useState(false);
    return (
        <>

        <div  onClick={() => setOpenModal(true)}
            className="m-2 rounded-full cursor-pointer bg-white/10 px-4 py-3 font-semibold no-underline transition hover:bg-white/20">
            Friendship
        </div>
        <Friendship openModal={openModal} setOpenModal={setOpenModal}/>
        </>
    )
}

export default OpenFriendship