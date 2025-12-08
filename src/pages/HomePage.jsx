import React, { useState, useContext } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer.jsx'
import RightSideBar from '../components/RightSideBar'
import { ChatContext } from '../../context/ChatContext'
import MoodCard from '../components/MoodCard'

const HomePage = () => {

  const { selectedUser, isMotionEnabled, currentMood } = useContext(ChatContext)
  const [showRightSide, setShowRightSide] = useState(false)

  return (
    <div className='w-full h-screen sm:px-[10%] sm:py-[5%]'>
      <MoodCard
        currentMood={currentMood}
        motionEnabled={isMotionEnabled}
        
        className={`
          grid grid-cols-1 border border-white/20 relative
          ${selectedUser 
            ? (showRightSide ? "md:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-[1fr_3fr]") 
            : "md:grid-cols-2"}
        `}
      >
        <SideBar />
        <ChatContainer showRightSide={showRightSide} setShowRightSide={setShowRightSide}/>
        {showRightSide && <RightSideBar />}
      </MoodCard>
    </div>
  )
}

export default HomePage