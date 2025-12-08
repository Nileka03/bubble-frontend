import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'
import bgImg from './assets/bgimg3.jpg'

import ServerAwake from './components/ServerAwake'

const App = () => {
  const { authUser } = useContext(AuthContext)
  return (
    <ServerAwake>
      <div
        style={{ backgroundImage: `url(${bgImg})` }}
        className="bg-cover bg-no-repeat bg-center bg-black/60 bg-blend-multiply h-screen w-full">
        <Toaster />
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </ServerAwake>
  )
}

export default App