import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext)
  const [showRightSide, setShowRightSide] = useState(false)

  return (
    <div className='w-full h-screen sm:px-[10%] sm:py-[5%]'>
      <div className={`bg-black/10 backdrop-blur-xl border border-white/20 rounded-2xl
      overflow-hidden h-[100%] grid grid-cols-1 relative 
      ${selectedUser 
        ? (showRightSide ? "md:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-[1fr_3fr]") 
        : "md:grid-cols-2"}
        `}>
        <SideBar />
        <ChatContainer showRightSide={showRightSide} setShowRightSide={setShowRightSide}/>
        {showRightSide && <RightSideBar />}
      </div>
    </div>
  )
}

export default HomePage