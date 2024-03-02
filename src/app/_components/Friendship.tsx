import { Modal } from 'antd';
import SendFriendRequest from './SendFriendRequest';
import SentFriendRequests from './SentFriendRequests';
import ReceivedFriendRequests from './ReceivedFriendRequests';
import Friends from './Friends';


const Friendship = ({ openModal, setOpenModal }: { openModal: boolean, setOpenModal: (isOpen: boolean) => void }) => {

    return (
        <Modal
            title={<span className='flex justify-center text-2xl'> FRIENDSHIP </span>}
            open={openModal}
            onCancel={() => setOpenModal(false)}
            closable={true}
            footer={false}
        >
            {
                <div className='flex flex-col justify-center items-center gap-10'>
                    <div className='flex flex-col justify-center items-center gap-1'>
                        <h2 className='font-bold'>Send Friend Request</h2>
                        <SendFriendRequest />
                    </div>

                    <div className='request-and-send flex flex-row justify-center gap-10 '>
                        <div className='received flex flex-col justify-start items-center w-[225px] p-4'>
                            <span className='font-bold'> Received Friend Requests </span>
                            <ReceivedFriendRequests />
                        </div>
                        <div className='sent flex flex-col justify-start items-center w-[225px] p-4'>
                            <span className='font-bold'> Sent Friend Requests </span>
                            <SentFriendRequests />
                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center w-full p-4'>
                        <span className='font-bold'> My Friends </span>
                        <Friends />
                    </div>
                </div>
            }
        </Modal>
    )
}

export default Friendship