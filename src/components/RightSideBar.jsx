import React, { useState, useEffect, useContext } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSideBar = () => {

  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])

  const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser?._id);

  return selectedUser ? (
    <div className={`w-full h-full border-l border-white/10 relative flex flex-col bg-black/40 backdrop-blur-lg text-white overflow-hidden
    ${selectedUser ? "max-md:hidden" : ""}`}>

      
      <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
        {/* header and profile section */}
        <div className='pt-12 flex flex-col items-center gap-3 text-center'>
          <div className="relative group">
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
              className='w-28 h-28 object-cover rounded-full border-4 border-transparent group-hover:border-orange-500 transition-all duration-300 shadow-2xl' />
            <span className={`absolute bottom-2 right-2 w-5 h-5 border-4 border-black rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className='text-2xl font-bold flex items-center justify-center gap-2'>
              {selectedUser.fullName}
            </h1>
            <p className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
            <p className="text-sm text-gray-400">{selectedUser.email}</p>
          </div>
        </div>

        <hr className='border-white/10 my-6 mx-6' />

        {/* about section */}
        <div className='px-6'>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 tracking-wider">ABOUT</h3>
          <p className='text-gray-300 text-sm leading-relaxed'>
            {selectedUser.bio || "Hey there! I am using ChatApp."}
          </p>
        </div>

        <hr className='border-white/10 my-6 mx-6' />

        {/* media section */}
        <div className='px-6 mb-6'>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider">MEDIA</h3>
            {msgImages.length > 0 && <span className="text-xs text-gray-500">{msgImages.length} files</span>}
          </div>

          {msgImages.length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className='grid grid-cols-3 gap-2'>
                {msgImages.slice(0, 3).map((url, index) => (
                  <div key={index} onClick={() => window.open(url)}
                    className='cursor-pointer aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-orange-500 transition-all'>
                    <img src={url} alt="" className='w-full h-full object-cover hover:scale-110 transition-transform duration-300' />
                  </div>
                ))}
              </div>
              {msgImages.length > 3 && (
                <button onClick={() => setIsMediaModalOpen(true)}
                  className='text-sm text-orange-500 hover:text-orange-400 font-medium text-left transition-colors'>
                  View More
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No media shared yet</p>
          )}
        </div>
      </div>

      {/* logout */}
      <div className="p-5 text-sm bg-transparent border-none outline-none text-white placeholder-gray-500">
        <button onClick={() => logout()} className='w-full bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-500 
          font-medium border border-white/10 hover:border-red-500/50 text-sm py-3 rounded-full transition-all duration-300'>
          Logout
        </button>
      </div>

      {/* media */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setIsMediaModalOpen(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Shared Media</h2>
              <button onClick={() => setIsMediaModalOpen(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-4 custom-scrollbar">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {msgImages.map((url, index) => (
                  <div key={index} onClick={() => window.open(url)} className="aspect-square rounded-lg overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500 transition-all group relative">
                    <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  ) : (
    <div className='w-full h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-lg text-white border-l border-white/10'>
      <img src={assets.logo} alt="logo" className="w-20 h-20 opacity-20 mb-4 grayscale" />
      <h2 className="text-xl font-semibold text-gray-500">Select a chat to start messaging</h2>
    </div>
  )
}

export default RightSideBar