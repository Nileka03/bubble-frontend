import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {

  const { authUser, updateProfile, deleteAccount } = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser?.fullName || "")
  const [bio, setBio] = useState(authUser?.bio || "")

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate('/');
    }
  }

  return (
    <div className='min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background aesthetic blobs */}
      <div className='absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-800/20 rounded-full blur-[100px] pointer-events-none'></div>

      <div className='w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden'>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 relative z-10'>

          <h2 className='text-3xl font-bold text-white text-center tracking-tight mb-4'>Profile Settings</h2>

          <div className='flex flex-col items-center gap-4'>
            <label htmlFor="avatar" className='relative cursor-pointer group'>
              <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-orange-500/50 transition-all duration-300'>
                <img src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.avatar_icon)}
                  alt="" className='w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity' />
              </div>
              <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full'>
                <span className='text-white text-xs font-medium'>Change</span>
              </div>
              <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            </label>
            <p className='text-gray-400 text-sm'>Tap to change profile picture</p>
          </div>

          <div className='space-y-4 w-full'>
            <div className='space-y-2'>
              <label className='text-sm text-gray-400 ml-1'>Full Name</label>
              <input onChange={(e) => setName(e.target.value)} value={name}
                type="text" required placeholder='Your Name'
                className='w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300' />
            </div>

            <div className='space-y-2'>
              <label className='text-sm text-gray-400 ml-1'>Bio</label>
              <textarea onChange={(e) => setBio(e.target.value)} value={bio}
                placeholder='Write profile bio' required
                className='w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300 resize-none' rows={4}></textarea>
            </div>
          </div>

          <button type='submit' className='w-full py-4 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 transition-all duration-300'>
            Save Changes
          </button>

          <div className='mt-8 pt-8 border-t border-white/10 flex flex-col items-center'>
            <button
              type='button'
              onClick={() => {
                if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  deleteAccount();
                }
              }}
              className='text-red-500/80 hover:text-red-500 text-sm font-medium hover:underline transition-colors cursor-pointer'
            >
              Delete Account
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ProfilePage