// import React from 'react'
// import { assets, } from '../assets/assets'
// import { Link, useNavigate } from 'react-router-dom'
// import MenuItems from './MenuItems.jsx'
// import { CirclePlus, LogOut } from 'lucide-react'
// import {UserButton, useClerk} from '@clerk/clerk-react'
// import { useSelector } from 'react-redux';

// const Sidebar = ({sidebarOpen, setSidebarOpen}) => {

//     const navigate = useNavigate()
//     const user = useSelector((state) => state.user.value)
//     const {signOut} = useClerk()

//   return (
//     <div className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
//       <div className='w-full'>
//             <img onClick={()=> navigate('/')} src={assets.logo} className='w-26 ml-7 my-2 cursor-pointer' alt="" />
//             <hr className='border-gray-300 mb-8'/>

//             <MenuItems setSidebarOpen={setSidebarOpen}/>

//             <Link to='/create-post' className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg  bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'>
//                 <CirclePlus className='w-5 h-5'/>
//                 Create Post
//             </Link>

//       </div>

//         <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
//             <div className='flex gap-2 items-center cursor-pointer'>
//                 <UserButton />
//                 <div>
//                     <h1 className='text-sm font-medium'>{user.full_name}</h1>
//                     <p className='text-xs text-gray-500'>@{user.username}</p>
//                 </div>
//             </div>
//             <LogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'/>
//         </div>

//     </div>
//   )
// }

// export default Sidebar
import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems.jsx'
import { CirclePlus, LogOut } from 'lucide-react'
import { UserButton, useClerk } from '@clerk/clerk-react'
import { useSelector } from 'react-redux'
import QRImage from '../assets/QR.jpg'



const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const { signOut } = useClerk()

  return (
    <div
      className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'
        } transition-all duration-300 ease-in-out`}
    >
      <div className='w-full flex-1 flex flex-col'>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className='flex items-center gap-3 ml-7 my-2 cursor-pointer hover:opacity-80 transition-opacity'
        >
          <img
            src={assets.logo}
            className='w-12 h-12 rounded-full object-cover border-2 border-indigo-200'
            alt='Logo'
          />
          <span className='text-xl font-bold text-indigo-600'>Meow</span>
        </div>
        <hr className='border-gray-300 mb-8' />

        {/* Menu items */}
        <MenuItems setSidebarOpen={setSidebarOpen} />

        {/* Create post */}
        <Link
          to='/create-post'
          className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg  bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'
        >
          <CirclePlus className='w-5 h-5' />
          Create Post
        </Link>

        {/* Contact info */}
        <div className="mt-8 border-t pt-4 mx-6 text-sm text-gray-500 space-y-2">
          <p>
            📞 Liên hệ khi có sự cố:{' '}
            <a
              href="mailto:support@yourdomain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              congduongnguyentrung@gmail.com
            </a>
          </p>
          <div>
            📢 Liên hệ quảng cáo:
            <div className="mt-2">
              <img
                src={QRImage}
                alt="QR Zalo"
                className="w-28 h-28 rounded-lg border object-contain cursor-pointer hover:scale-105 transition-transform"
                title="Quét mã để kết bạn Zalo"
              />
              <p className="text-xs text-gray-400 mt-1">Quét mã để kết bạn Zalo</p>
            </div>
          </div>
        </div>
      </div>

      {/* User info + logout */}
      <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
        <div className='flex gap-2 items-center cursor-pointer'>
          <UserButton />
          <div>
            <h1 className='text-sm font-medium'>{user.full_name}</h1>
            <p className='text-xs text-gray-500'>@{user.username}</p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'
        />
      </div>
    </div>
  )
}

export default Sidebar
