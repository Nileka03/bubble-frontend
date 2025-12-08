import React, { useEffect, useRef, useState, useContext } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios'; 

const ChatContainer = ({ showRightSide, setShowRightSide }) => {

    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
    const { authUser, onlineUsers } = useContext(AuthContext)

    
    const [suggestions, setSuggestions] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    
    const scrollEnd = useRef()
    const [input, setInput] = useState('');

    
    useEffect(() => {
        const fetchSmartReplies = async () => {
            if (!messages || messages.length === 0) return;

            // Sort messages 
            const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            const lastMsg = sortedMessages[sortedMessages.length - 1];

            
            if (lastMsg.senderId === selectedUser._id) {
                setLoadingAI(true);
                try {
                    
                    const res = await axiosInstance.post(
                        `/ai/smart-replies/${selectedUser._id}`,
                        {} 
                    );

                    if (res.data.suggestions && res.data.suggestions.length > 0) {
                        setSuggestions(res.data.suggestions);
                    }
                } catch (err) {
                    
                    console.log("AI fetch skipped:", err.message);
                } finally {
                    setLoadingAI(false);
                }
            } else {
                
                setSuggestions([]);
            }
        };

        fetchSmartReplies();
    }, [messages, selectedUser, authUser._id]);

    const handleSuggestionClick = (text) => {
        setInput(text);
        setSuggestions([]); 
    };
    


    // handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return null;
        await sendMessage({ text: input.trim() });
        setInput("");
        setSuggestions([]); 
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
            getMessages(selectedUser._id);
            setSuggestions([]);
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
                    {Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser._id) && (
            <span className='absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black'></span>
        )}
                </div>
                <div className='flex-1 flex flex-col'>
                    <p className='text-lg font-medium text-white leading-tight'>
                        {selectedUser.fullName}
                    </p>
                    <p className='text-xs text-gray-400'>
                        {Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                    </p>
                </div>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7 cursor-pointer hover:opacity-80' />
                <img onClick={() => setShowRightSide(!showRightSide)} src={assets.help_icon} alt="" className='max-md:hidden max-w-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity' />
            </div>



            {/*--------------chat area--------------*/}


            <div className='flex-1 overflow-y-auto p-4 pb-6 custom-scrollbar'>
                {[...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 mb-4 justify-end ${msg.senderId !== authUser._id &&
                        'flex-row-reverse'}`}>

                        {/* Message Content */}
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

                        {/* Avatar */}
                        <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon
                            : selectedUser?.profilePic || assets.avatar_icon} alt=""
                            className='w-8 h-8 object-cover rounded-full border border-white/10 mb-1' />
                    </div>
                ))}
                <div ref={scrollEnd}></div>
            </div>




            {/*--------------bottom area--------------*/}
            <div className='p-4 bg-transparent relative'>

                {/* ai suggestions */}
                {suggestions.length > 0 && (
                    <div className="absolute -top-10 left-4 right-4 flex gap-2 overflow-x-auto no-scrollbar pb-2 z-10">
                        {suggestions.map((reply, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestionClick(reply)}
                                className="whitespace-nowrap bg-black/40 backdrop-blur-md border border-white/10 
                                           text-gray-200 text-sm px-4 py-2 rounded-full hover:bg-orange-500/20 
                                           hover:border-orange-500/50 hover:text-white transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                            >
                                {reply} 
                            </button>
                        ))}
                    </div>
                )}

                <div className='flex items-center gap-3 bg-white/15 border border-white/10 px-4 py-2 rounded-full focus-within:border-orange-500/50 focus-within:bg-white/10 transition-all duration-300'>
                    <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
                    <label htmlFor='image'>
                        <img src={assets.gallery_icon} alt="" className='w-6 cursor-pointer opacity-50 hover:opacity-100 hover:scale-110 transition-all' />
                    </label>

                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
                        type="text"
                        placeholder={loadingAI ? "AI is thinking..." : "Type a message..."}
                        className='flex-1 text-sm bg-transparent border-none outline-none text-white placeholder-white/60'
                    />

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
                <h2 className='text-2xl font-bold text-white/80 mb-1'>Welcome to BubbleChat</h2>
                <p className='text-sm text-black'>Select a chat to start messaging</p>
            </div>
        </div>
    );
}

export default ChatContainer