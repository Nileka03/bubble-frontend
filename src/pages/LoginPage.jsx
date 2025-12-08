import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  {/*state variables */ }
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }

    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio })
  }

  return (
    <div className='min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden'>
      
      <div className='absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-800/20 rounded-full blur-[100px] pointer-events-none'></div>

      <div className='w-full max-w-5xl flex items-center justify-center gap-10 sm:gap-20 max-sm:flex-col relative z-10'>
        {/*------------left---------- */}
        <div className='flex flex-col items-center justify-center'>
          <img src={assets.logo_big} alt="" className='w-[min(40vw,200px)] drop-shadow-2xl' />
          <div className='mt-8 text-center hidden sm:block'>
            <h1 className='text-4xl font-bold text-white mb-2 tracking-tight'>Welcome Back</h1>
            <p className='text-gray-400'>Connect, Chat, and Share instantly.</p>
          </div>
        </div>

        {/*------------right---------- */}
        <form onSubmit={onSubmitHandler} className='w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl flex flex-col gap-6'>

          <div className='flex justify-between items-center mb-2'>
            <h2 className='font-bold text-3xl text-white tracking-tight'>
              {currState}
            </h2>
            {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon}
              alt="" className='w-6 invert cursor-pointer hover:scale-110 transition-transform' />}
          </div>

          {/*only show the full name if the user is signing up not when login */}
          {currState === "Sign up" && !isDataSubmitted && (
            <div className='space-y-1'>
              <input onChange={(e) => setFullName(e.target.value)} value={fullName}
                type="text" className='w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300'
                placeholder='Full Name' required />
            </div>
          )}

          {!isDataSubmitted && (
            <div className='space-y-4'>
              <input onChange={(e) => setEmail(e.target.value)} value={email}
                type="email" placeholder='Email Address' required
                className='w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300' />

              <input onChange={(e) => setPassword(e.target.value)} value={password}
                type="password" placeholder='Password' required
                className='w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300' />
            </div>
          )}

          {currState === "Sign up" && isDataSubmitted && (
            <div className='space-y-1'>
              <textarea onChange={(e) => setBio(e.target.value)} value={bio}
                rows={4} className='w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300 resize-none'
                placeholder='Provide a Short bio...' required></textarea>
            </div>
          )}

          <button type='submit' className='w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer'>
            {currState === "Sign up" ? "Create Account" : "Login Now"}
          </button>

          <div className='flex items-center gap-3 text-sm text-gray-400'>
            <input type="checkbox" className='accent-orange-500 w-4 h-4' />
            <p>Agree to the terms of use & privacy policy</p>
          </div>

          <div className='flex flex-col gap-2 mt-2'>
            {currState === "Sign up" ? (
              <p className='text-sm text-gray-400'>Already have an account? <span
                onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }}
                className='font-bold text-orange-500 cursor-pointer hover:underline'>Login here</span>
              </p>

            ) : (
              <p className='text-sm text-gray-400'>Create an account <span
                onClick={() => setCurrState("Sign up")}
                className='font-bold text-orange-500 cursor-pointer hover:underline'>Click here</span>
              </p>
            )}
          </div>


        </form>

      </div>
    </div>
  )
}

export default LoginPage
