import { Modal } from 'antd';
import SendFriendRequest from './SendFriendRequest';


const Friendship = ({ openModal, setOpenModal }: { openModal: boolean, setOpenModal: (isOpen: boolean) => void }) => {

    return (
        <Modal
            bodyStyle={{ height: 600 }}
            title="FRIENDSHIP"
            open={openModal}
            onCancel={() => setOpenModal(false)}
            closable={true}
            footer={false}
        >
            {
                <div className='flex flex-col justify-center items-center gap-10'>
                    <SendFriendRequest />
                    <div className='request-and-send flex flex-row justify-center gap-10 '>
                        <div className='received flex flex-col justify-center items-center border border-black w-[225px] p-4'>
                            <span className='font-bold'> Received Friend Requests </span>
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
                        <div className='sent flex flex-col justify-center items-center border border-black w-[225px] p-4'>
                            <span className='font-bold'> Received Friend Requests </span>
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