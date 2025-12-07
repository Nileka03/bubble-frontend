import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const SideBar = () => {

  const { getUsers, users, selectedUser, setselectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const [input, setInput] = useState("");
  const { logout, onlineUsers } = useContext(AuthContext)
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : [...users].sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  const activeUsers = users.filter(user => onlineUsers.includes(user._id));

  useEffect(() => {
    getUsers();
  }, [onlineUsers])

  return (
    <div className={`h-full p-5 border-r border-white/10 overflow-y-auto text-white flex flex-col
    ${selectedUser ? "max-md:hidden" : 'w-full'} bg-black/40 backdrop-blur-lg`}>

      {/* header */}
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <img src={assets.logo} alt='logo' className='w-8 h-8 object-contain' />
            <span className="font-bold text-xl tracking-wide">Chat<span className="text-orange-500">App</span></span>
          </div>
          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt='menu' className='w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity' />
            <div className='absolute top-full right-0 z-20 w-40 p-3 rounded-xl
                 bg-[#1a1a1a] border border-white/10 text-gray-300 hidden
                 group-hover:block shadow-2xl backdrop-blur-md'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm p-2 hover:bg-white/5 rounded-lg transition-colors hover:text-orange-500'>Edit Profile</p>
              <hr className='my-1 border-white/10' />
              <p onClick={() => logout()} className='cursor-pointer text-sm p-2 hover:bg-white/5 rounded-lg transition-colors hover:text-orange-500'>Logout</p>
            </div>
          </div>
        </div>

        {/* active users */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider">Active Users</h3>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {activeUsers.length > 0 ? (
              activeUsers.map((user) => (
                <div key={user._id} onClick={() => { setselectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
                  className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px] group">
                  <div className="relative">
                    <img src={user.profilePic || assets.avatar_icon} alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-orange-500 transition-all duration-300" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                  </div>
                  <span className="text-xs text-gray-300 truncate w-full text-center group-hover:text-white transition-colors">{user.fullName.split(" ")[0]}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No active users</p>
            )}
          </div>
        </div>

        {/* search */}
        <div className='bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 py-3 px-4 mt-6 focus-within:border-orange-500/50 focus-within:bg-white/10 transition-all duration-300'>
          <img src={assets.search_icon} alt="search" className='w-4 opacity-50' />
          <input onChange={(e) => setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none
            text-white text-sm placeholder-gray-500 flex-1' placeholder='Search or start new chat' />
        </div>
      </div>

      {/* all users */}
      <div className="flex-1 overflow-y-auto mt-2">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wider">ALL CHATS</h3>
        <div className='flex flex-col gap-1'>
          {filteredUsers.map((user, index) => (
            <div onClick={() => { setselectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
              key={index} className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer group
                ${selectedUser?._id === user._id ? 'bg-orange-500/10 border border-orange-500/30' : 'hover:bg-white/5 border border-transparent'}`}>

              <div className="relative">
                <img src={user?.profilePic || assets.avatar_icon} alt=""
                  className='w-12 h-12 object-cover rounded-full' />
                {onlineUsers.includes(user._id) &&
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                }
              </div>

              <div className='flex flex-col flex-1 min-w-0'>
                <div className="flex justify-between items-baseline">
                  <p className={`font-medium truncate ${selectedUser?._id === user._id ? 'text-orange-400' : 'text-gray-200 group-hover:text-white'}`}>
                    {user.fullName}
                  </p>
                </div>
                <p className={`text-sm truncate ${unseenMessages?.[user._id] > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>
                  {unseenMessages?.[user._id] > 0 ? (
                    <span className="text-orange-400">New message</span>
                  ) : (
                    user.lastMessage || <span className="italic opacity-50">No messages yet</span>
                  )}
                </p>
              </div>

              {unseenMessages?.[user._id] > 0 &&
                <div className='min-w-[20px] h-5 flex items-center justify-center rounded-full bg-orange-500 text-black text-xs font-bold px-1'>
                  {unseenMessages[user._id]}
                </div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SideBar