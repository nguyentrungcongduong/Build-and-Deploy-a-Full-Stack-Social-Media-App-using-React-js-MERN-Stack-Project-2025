// // import React, { useEffect, useRef, useState } from 'react'
// // import { ImageIcon, SendHorizonal, ChevronUp } from 'lucide-react'
// // import { useDispatch, useSelector } from 'react-redux'
// // import { useParams } from 'react-router-dom'
// // import { useAuth } from '@clerk/clerk-react'
// // import api from '../api/axios'
// // import { addMessage, fetchMessages, resetMessages } from '../features/messages/messagesSlice.js'
// // import toast from 'react-hot-toast'

// // const ChatBox = () => {

// //   const { messages } = useSelector((state) => state.messages)
// //   const { userId } = useParams()
// //   const { getToken } = useAuth()
// //   const dispatch = useDispatch()

// //   const [text, setText] = useState('')
// //   const [image, setImage] = useState(null)
// //   const [user, setUser] = useState(null)
// //   const messagesEndRef = useRef(null)
// //   const scrollerRef = useRef(null)
// //   const [showScrollUp, setShowScrollUp] = useState(false)

// //   const connections = useSelector((state) => state.connections.connections)

// //   const fetchUserMessages = async () => {
// //     try {
// //       const token = await getToken()
// //       dispatch(fetchMessages({ token, userId }))
// //     } catch (error) {
// //       toast.error(error.message)
// //     }
// //   }

// //   const sendMessage = async () => {
// //     try {
// //       if (!text && !image) return

// //       const token = await getToken()
// //       const formData = new FormData();
// //       formData.append('to_user_id', userId)
// //       formData.append('text', text);
// //       image && formData.append('image', image);

// //       const { data } = await api.post('/api/message/send', formData, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       })
// //       if (data.success) {
// //         setText('')
// //         setImage(null)
// //         dispatch(addMessage(data.message))
// //       } else {
// //         throw new Error(data.message)
// //       }
// //     } catch (error) {
// //       toast.error(error.message)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchUserMessages()

// //     return () => {
// //       dispatch(resetMessages())
// //     }
// //   }, [userId])

// //   useEffect(() => {
// //     if (connections.length > 0) {
// //       const user = connections.find(connection => connection._id === userId)
// //       setUser(user)
// //     }
// //   }, [connections, userId])

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
// //   }, [messages])

// //   useEffect(() => {
// //     const el = scrollerRef.current
// //     if (!el) return

// //     const onScroll = () => {
// //       // chiều cao tổng - vị trí hiện tại - chiều cao khung
// //       const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
// //       setShowScrollUp(distanceFromBottom > 200) // hiện nút khi cách đáy > 200px
// //     }

// //     el.addEventListener('scroll', onScroll)
// //     return () => el.removeEventListener('scroll', onScroll)
// //   }, [])



// //   const scrollUpChunk = () => {
// //     const el = scrollerRef.current
// //     if (!el) return
// //     el.scrollBy({ top: -300, behavior: 'smooth' })
// //     // Optionally trigger pagination here
// //     // dispatch(fetchOlderMessages(...))
// //   }

// //   return user && (
// //     <div className='flex flex-col h-screen relative'>
// //       <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
// //         <img src={user.profile_picture} alt="" className="size-8 rounded-full" />
// //         <div>
// //           <p className="font-medium">{user.full_name}</p>
// //           <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
// //         </div>
// //       </div>

// //       <div ref={scrollerRef} className='p-5 md:px-10 h-full overflow-y-scroll'>
// //         <div className='space-y-4 max-w-4xl mx-auto'>
// //           {
// //             messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
// //               <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
// //                 <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
// //                   {
// //                     message.message_type === 'image' && <img src={message.media_url} className='w-full max-w-sm rounded-lg mb-1' alt="" />
// //                   }
// //                   <p>{message.text}</p>
// //                 </div>
// //               </div>
// //             ))
// //           }
// //           <div ref={messagesEndRef} />
// //         </div>
// //       </div>

// //       {/* nút scroll up được đặt ngoài scroller */}
// //       {showScrollUp && (
// //         <button
// //           onClick={scrollUpChunk}
// //           className='absolute right-4 bottom-24 w-9 h-9 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 active:scale-95 flex items-center justify-center'
// //         >
// //           <ChevronUp className='w-4 h-4' />
// //         </button>
// //       )}

// //       <div className='px-4'>
// //         <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
// //           <input type="text" className='flex-1 outline-none text-slate-700' placeholder='Type a message...'
// //             onKeyDown={e => e.key === 'Enter' && sendMessage()} onChange={(e) => setText(e.target.value)} value={text} />

// //           <label htmlFor="image">
// //             {
// //               image
// //                 ? <img src={URL.createObjectURL(image)} alt="" className='h-8 rounded' />
// //                 : <ImageIcon className='size-7 text-gray-400 cursor-pointer' />
// //             }
// //             <input type="file" id='image' accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
// //           </label>

// //           <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
// //             <SendHorizonal size={18} />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )

// // }

// // export default ChatBox


// import React, { useEffect, useRef, useState } from 'react'
// import { ImageIcon, SendHorizonal, ChevronUp, ChevronDown } from 'lucide-react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
// import { useAuth } from '@clerk/clerk-react'
// import api from '../api/axios'
// import { addMessage, fetchMessages, resetMessages } from '../features/messages/messagesSlice.js'
// import toast from 'react-hot-toast'

// const ChatBox = () => {

//   const { messages } = useSelector((state) => state.messages)
//   const { userId } = useParams()
//   const { getToken } = useAuth()
//   const dispatch = useDispatch()

//   const [text, setText] = useState('')
//   const [image, setImage] = useState(null)
//   const [user, setUser] = useState(null)
//   const messagesEndRef = useRef(null)
//   const scrollerRef = useRef(null)
//   const [showScrollUp, setShowScrollUp] = useState(false)
//   const [showScrollDown, setShowScrollDown] = useState(false)

//   const connections = useSelector((state) => state.connections.connections)

//   const fetchUserMessages = async () => {
//     try {
//       const token = await getToken()
//       dispatch(fetchMessages({ token, userId }))
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   const sendMessage = async () => {
//     try {
//       if (!text && !image) return

//       const token = await getToken()
//       const formData = new FormData();
//       formData.append('to_user_id', userId)
//       formData.append('text', text);
//       image && formData.append('image', image);

//       const { data } = await api.post('/api/message/send', formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       if (data.success) {
//         setText('')
//         setImage(null)
//         dispatch(addMessage(data.message))
//       } else {
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(() => {
//     fetchUserMessages()

//     return () => {
//       dispatch(resetMessages())
//     }
//   }, [userId])

//   useEffect(() => {
//     if (connections.length > 0) {
//       const user = connections.find(connection => connection._id === userId)
//       setUser(user)
//     }
//   }, [connections, userId])

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   useEffect(() => {
//     const el = scrollerRef.current
//     if (!el) return

//     const onScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = el
//       const distanceFromBottom = scrollHeight - scrollTop - clientHeight
//       const distanceFromTop = scrollTop

//       // Hiện nút scroll up khi user ở gần đáy (để load tin nhắn cũ hơn)
//       setShowScrollUp(scrollTop > 50)

//       // Hiện nút scroll down khi user ở trên cao (để nhảy về tin nhắn mới nhất)
//       setShowScrollDown(distanceFromBottom > 100)
//     }

//     el.addEventListener('scroll', onScroll)
//     return () => el.removeEventListener('scroll', onScroll)
//   }, [])

//   const scrollUpChunk = () => {
//     const el = scrollerRef.current
//     if (!el) return
//     el.scrollBy({ top: -300, behavior: 'smooth' })
//     // Có thể trigger pagination ở đây để load tin nhắn cũ hơn
//     // dispatch(fetchOlderMessages(...))
//   }

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   return user && (
//     <div className='flex flex-col h-screen relative'>
//       <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
//         <img src={user.profile_picture} alt="" className="size-8 rounded-full" />
//         <div>
//           <p className="font-medium">{user.full_name}</p>
//           <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
//         </div>
//       </div>

//       <div ref={scrollerRef} className='p-5 md:px-10 h-full overflow-y-scroll'>
//         <div className='space-y-4 max-w-4xl mx-auto'>
//           {
//             messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
//               <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
//                 <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
//                   {
//                     message.message_type === 'image' && <img src={message.media_url} className='w-full max-w-sm rounded-lg mb-1' alt="" />
//                   }
//                   <p>{message.text}</p>
//                 </div>
//               </div>
//             ))
//           }
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Nút scroll up - hiện khi user ở gần đáy để load tin nhắn cũ */}
//       {showScrollUp && (
//         <button
//           onClick={scrollUpChunk}
//           className='absolute right-4 bottom-24 w-9 h-9 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 active:scale-95 flex items-center justify-center'
//           title="Xem tin nhắn cũ hơn"
//         >
//           <ChevronUp className='w-4 h-4' />
//         </button>
//       )}

//       {/* Nút scroll down - hiện khi user ở trên cao để nhảy về tin nhắn mới nhất */}
//       {showScrollDown && (
//         <button
//           onClick={scrollToBottom}
//           className='absolute right-4 bottom-24 w-9 h-9 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 active:scale-95 flex items-center justify-center'
//           title="Đi tới tin nhắn mới nhất"
//         >
//           <ChevronDown className='w-4 h-4' />
//         </button>
//       )}

//       <div className='px-4'>
//         <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
//           <input type="text" className='flex-1 outline-none text-slate-700' placeholder='Type a message...'
//             onKeyDown={e => e.key === 'Enter' && sendMessage()} onChange={(e) => setText(e.target.value)} value={text} />

//           <label htmlFor="image">
//             {
//               image
//                 ? <img src={URL.createObjectURL(image)} alt="" className='h-8 rounded' />
//                 : <ImageIcon className='size-7 text-gray-400 cursor-pointer' />
//             }
//             <input type="file" id='image' accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
//           </label>

//           <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
//             <SendHorizonal size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   )

// }

// export default ChatBox


import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal, ChevronUp, ChevronDown } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import { addMessage, fetchMessages, resetMessages } from '../features/messages/messagesSlice.js'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const { messages } = useSelector((state) => state.messages)
  const { userId } = useParams()
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)
  const messagesEndRef = useRef(null)
  const scrollerRef = useRef(null)
  const [showScrollUp, setShowScrollUp] = useState(false)
  const [showScrollDown, setShowScrollDown] = useState(false)

  const connections = useSelector((state) => state.connections.connections)

  const fetchUserMessages = async () => {
    try {
      const token = await getToken()
      dispatch(fetchMessages({ token, userId }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendMessage = async () => {
    try {
      if (!text && !image) return

      const token = await getToken()
      const formData = new FormData();
      formData.append('to_user_id', userId)
      formData.append('text', text);
      image && formData.append('image', image);

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setText('')
        setImage(null)
        dispatch(addMessage(data.message))
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchUserMessages()

    return () => {
      dispatch(resetMessages())
    }
  }, [userId])

  useEffect(() => {
    if (connections.length > 0) {
      const user = connections.find(connection => connection._id === userId)
      setUser(user)
    }
  }, [connections, userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      const distanceFromTop = scrollTop

      // Hiện nút scroll up khi user ở gần đáy (để load tin nhắn cũ hơn)
      // distanceFromBottom < 100 && distanceFromTop > 300
      setShowScrollUp(scrollTop > 50)

      // Hiện nút scroll down khi user ở trên cao (để nhảy về tin nhắn mới nhất)
      setShowScrollDown(distanceFromBottom > 100)
    }

    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUpChunk = () => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ top: -600, behavior: 'smooth' }) // tăng từ 300 lên 600
    // Có thể trigger pagination ở đây để load tin nhắn cũ hơn
    // dispatch(fetchOlderMessages(...))
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return user && (
    <div className='flex flex-col h-screen relative'>
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img src={user.profile_picture} alt="" className="size-8 rounded-full" />
        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
        </div>
      </div>

      <div ref={scrollerRef} className='p-5 md:px-10 h-full overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {
            messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
              <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                  {
                    message.message_type === 'image' && <img src={message.media_url} className='w-full max-w-sm rounded-lg mb-1' alt="" />
                  }
                  <p>{message.text}</p>
                </div>
              </div>
            ))
          }
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Nút scroll up - hiện khi user đã cuộn xuống */}
      {showScrollUp && (
        <button
          onClick={scrollUpChunk}
          className='absolute left-1/2 transform -translate-x-1/2 top-20 w-9 h-9 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 active:scale-95 flex items-center justify-center'
          title="Xem tin nhắn cũ hơn"
        >
          <ChevronUp className='w-4 h-4' />
        </button>
      )}

      {/* Nút scroll down - hiện khi user ở trên cao để nhảy về tin nhắn mới nhất */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className='absolute right-4 bottom-24 w-9 h-9 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 active:scale-95 flex items-center justify-center'
          title="Đi tới tin nhắn mới nhất"
        >
          <ChevronDown className='w-4 h-4' />
        </button>
      )}

      <div className='px-4'>
        <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
          <input type="text" className='flex-1 outline-none text-slate-700' placeholder='Type a message...'
            onKeyDown={e => e.key === 'Enter' && sendMessage()} onChange={(e) => setText(e.target.value)} value={text} />

          <label htmlFor="image">
            {
              image
                ? <img src={URL.createObjectURL(image)} alt="" className='h-8 rounded' />
                : <ImageIcon className='size-7 text-gray-400 cursor-pointer' />
            }
            <input type="file" id='image' accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
          </label>

          <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  )

}

export default ChatBox