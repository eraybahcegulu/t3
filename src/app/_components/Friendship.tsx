import { Modal } from 'antd';
import SendFriendRequest from './SendFriendRequest';
import SentFriendRequests from './SentFriendRequests';
import ReceivedFriendRequests from './ReceivedFriendRequests';


const Friendship = ({ openModal, setOpenModal }: { openModal: boolean, setOpenModal: (isOpen: boolean) => void }) => {

    return (
        <Modal
            title="FRIENDSHIP"
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
                        <div className='received flex flex-col justify-center items-center border border-black w-[225px] p-4'>
                            <span className='font-bold'> Received Friend Requests </span>
                            <ReceivedFriendRequests />
                        </div>
                        <div className='sent flex flex-col justify-center items-center border border-black w-[225px] p-4'>
                            <span className='font-bold'> Sent Friend Requests </span>
                            <SentFriendRequests />
                        </div>


                    </div>

                    <div className='flex flex-col items-center justify-center border border-black w-full p-4'>
                        <span className='font-bold'> My Friends </span>
                        <div className='flex flex-col items-center justify-start border border-black h-[200px] w-full overflow-x-auto gap-2 p-2'>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                            <span className='border border-black w-full'>a</span>
                        </div>
                    </div>
                </div>
            }
        </Modal>
    )
}

export default Friendship