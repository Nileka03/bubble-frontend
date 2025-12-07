import React, { useEffect, useRef } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ChatContainer = ({ showRightSide, setShowRightSide }) => {

    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)

    const { authUser, onlineUsers } = useContext(AuthContext)

    const scrollEnd = useRef()
    const [input, setInput] = useState('');


    //handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return null;
        await sendMessage({ text: input.trim() });
        setInput("")
    }

    // handle sending an image
    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("select an image file")
            return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            await sendMessage({ image: reader.result })
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }


    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
        }
    }, [selectedUser])

    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages])

    return selectedUser ? (
        <div className='flex flex-col h-full overflow-hidden relative bg-transparent'>
            {/*--------------header--------------*/}


            <div className='flex items-center gap-3 py-3 mx-4 border-b border-white/10'>
                <div className="relative">
                    <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-10 h-10 object-cover rounded-full border border-white/10' />
                    {onlineUsers.includes(selectedUser._id) && <span className='absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black'></span>}
                </div>
                <div className='flex-1 flex flex-col'>
                    <p className='text-lg font-medium text-white leading-tight'>
                        {selectedUser.fullName}
                    </p>
                    <p className='text-xs text-gray-400'>
                        {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                    </p>
                </div>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7 cursor-pointer hover:opacity-80' />
                <img onClick={() => setShowRightSide(!showRightSide)} src={assets.help_icon} alt="" className='max-md:hidden max-w-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity' />
            </div>



            {/*--------------chat area--------------*/}


            <div className='flex-1 overflow-y-auto p-4 pb-6 custom-scrollbar'>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 mb-4 justify-end ${msg.senderId !== authUser._id &&
                        'flex-row-reverse'}`}>

                        {/* message content */}
                        <div className={`flex flex-col ${msg.senderId === authUser._id ? 'items-end' : 'items-start'} max-w-[70%]`}>
                            {msg.image ? (
                                <img onClick={() => window.open(msg.image)} src={msg.image} alt=""
                                    className='max-w-[250px] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform' />
                            ) : (
                                <p className={`p-3 px-4 text-sm font-light rounded-2xl break-words shadow-sm
                                ${msg.senderId === authUser._id
                                        ? 'bg-orange-500 text-white rounded-br-none'
                                        : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/5'}`}>
                                    {msg.text}
                                </p>
                            )}
                            <p className='text-[10px] text-gray-500 mt-1 px-1'>
                                {formatMessageTime(msg.createdAt)}
                            </p>
                        </div>

                        {/* avatar */}
                        <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon
                            : selectedUser?.profilePic || assets.avatar_icon} alt=""
                            className='w-8 h-8 object-cover rounded-full border border-white/10 mb-1' />
                    </div>
                ))}
                <div ref={scrollEnd}></div>
            </div>




            {/*--------------bottom area--------------*/}
            <div className='p-4 bg-transparent'>
                <div className='flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full focus-within:border-orange-500/50 focus-within:bg-white/10 transition-all duration-300'>
                    <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
                    <label htmlFor='image'>
                        <img src={assets.gallery_icon} alt="" className='w-6 cursor-pointer opacity-50 hover:opacity-100 hover:scale-110 transition-all' />
                    </label>

                    <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder='Type a message...'
                        className='flex-1 text-sm bg-transparent border-none outline-none text-white placeholder-gray-500' />

                    <button onClick={handleSendMessage} disabled={!input.trim()}
                        className={`p-2 rounded-full transition-all ${input.trim() ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-transparent text-gray-600'}`}>
                        <img src={assets.send_button} alt="" className={`w-5 ${input.trim() ? 'brightness-200' : 'opacity-30'}`} />
                    </button>
                </div>
            </div>

        </div>
    ) : (
        <div className='flex flex-col items-center justify-center gap-4 text-gray-500 h-full
    bg-transparent max-md:hidden'>
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                <img src={assets.logo_icon} alt="" className='w-12 opacity-30' />
            </div>
            <div className="text-center">
                <h2 className='text-2xl font-bold text-white/80 mb-1'>Welcome to ChatApp</h2>
                <p className='text-sm text-gray-500'>Select a chat to start messaging</p>
            </div>
        </div>
    );
}

export default ChatContainer