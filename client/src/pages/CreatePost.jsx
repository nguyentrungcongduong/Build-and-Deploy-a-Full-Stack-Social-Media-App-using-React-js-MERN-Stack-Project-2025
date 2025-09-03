// import React, { useState } from 'react'
// import { Image, X, Video, Play } from 'lucide-react'
// import toast from 'react-hot-toast'
// import { useSelector } from "react-redux";
// import { useAuth } from '@clerk/clerk-react';
// import api from '../api/axios';
// import { useNavigate } from 'react-router-dom';

// const CreatePost = () => {

//   const navigate = useNavigate()
//   const [content, setContent] = useState('')
//   const [images, setImages] = useState([])
//   const [videos, setVideos] = useState([])
//   const [loading, setLoading] = useState(false)

//   const user = useSelector((state) => state.user.value)

//   const { getToken } = useAuth()

//   const handleSubmit = async () => {
//     if (!images.length && !videos.length && !content) {
//       return toast.error('Please add at least one image, video, or text')
//     }
//     setLoading(true)

//     let postType = 'text'
//     if (images.length && videos.length) {
//       postType = 'text_with_image_and_video'
//     } else if (images.length && content) {
//       postType = 'text_with_image'
//     } else if (videos.length && content) {
//       postType = 'text_with_video'
//     } else if (images.length) {
//       postType = 'image'
//     } else if (videos.length) {
//       postType = 'video'
//     }

//     try {
//       const formData = new FormData();
//       formData.append('content', content)
//       formData.append('post_type', postType)

//       // Thêm ảnh
//       images.forEach((image) => {
//         formData.append('images', image)
//       })

//       // Thêm video
//       videos.forEach((video) => {
//         formData.append('videos', video)
//       })

//       const { data } = await api.post('/api/post/add', formData, { headers: { Authorization: `Bearer ${await getToken()}` } })

//       if (data.success) {
//         navigate('/')
//       } else {
//         console.log(data.message)
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       console.log(error.message)
//       throw new Error(error.message)
//     }
//     setLoading(false)
//   }

//   // Xử lý xóa ảnh
//   const handleRemoveImage = (index) => {
//     setImages(images.filter((_, i) => i !== index))
//   }

//   // Xử lý xóa video
//   const handleRemoveVideo = (index) => {
//     setVideos(videos.filter((_, i) => i !== index))
//   }

//   // Xử lý upload ảnh
//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files)
//     setImages([...images, ...files])
//   }

//   // Xử lý upload video
//   const handleVideoUpload = (e) => {
//     const files = Array.from(e.target.files)
//     // Kiểm tra kích thước video (giới hạn 100MB)
//     const maxSize = 100 * 1024 * 1024 // 100MB
//     const validFiles = files.filter(file => {
//       if (file.size > maxSize) {
//         toast.error(`Video ${file.name} quá lớn. Kích thước tối đa: 100MB`)
//         return false
//       }
//       return true
//     })
//     setVideos([...videos, ...validFiles])
//   }

//   return (
//     <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
//       <div className='max-w-6xl mx-auto p-6'>
//         {/* Title */}
//         <div className='mb-8'>
//           <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
//           <p className='text-slate-600'>Share your thoughts with the world</p>
//         </div>

//         {/* Form */}
//         <div className='max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4'>
//           {/* Header */}
//           <div className='flex items-center gap-3'>
//             <img src={user.profile_picture} alt="" className='w-12 h-12 rounded-full shadow' />
//             <div>
//               <h2 className='font-semibold'>{user.full_name}</h2>
//               <p className='text-sm text-gray-500'>@{user.username}</p>
//             </div>
//           </div>

//           {/* Text Area */}
//           <textarea
//             className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400'
//             placeholder="What's happening?"
//             onChange={(e) => setContent(e.target.value)}
//             value={content}
//           />

//           {/* Images */}
//           {images.length > 0 && (
//             <div className='flex flex-wrap gap-2 mt-4'>
//               {images.map((image, i) => (
//                 <div key={i} className='relative group'>
//                   <img src={URL.createObjectURL(image)} className='h-20 rounded-md' alt="" />
//                   <div
//                     onClick={() => handleRemoveImage(i)}
//                     className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'
//                   >
//                     <X className="w-6 h-6 text-white" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Videos */}
//           {videos.length > 0 && (
//             <div className='flex flex-wrap gap-2 mt-4'>
//               {videos.map((video, i) => (
//                 <div key={i} className='relative group'>
//                   <div className='h-20 w-32 bg-gray-100 rounded-md flex items-center justify-center'>
//                     <Play className='w-8 h-8 text-gray-400' />
//                   </div>
//                   <div className='absolute top-1 left-1 text-xs text-white bg-black/60 px-2 py-1 rounded'>
//                     {video.name.length > 15 ? video.name.substring(0, 15) + '...' : video.name}
//                   </div>
//                   <div
//                     onClick={() => handleRemoveVideo(i)}
//                     className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'
//                   >
//                     <X className='w-6 h-6 text-white' />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Bottom Bar */}
//           <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
//             <div className='flex items-center gap-4'>
//               {/* Upload Images */}
//               <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
//                 <Image className='size-6' />
//                 <span className='hidden sm:inline'>Photos</span>
//               </label>
//               <input
//                 type="file"
//                 id="images"
//                 accept='image/*'
//                 hidden
//                 multiple
//                 onChange={handleImageUpload}
//               />

//               {/* Upload Videos */}
//               <label htmlFor="videos" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
//                 <Video className='size-6' />
//                 <span className='hidden sm:inline'>Videos</span>
//               </label>
//               <input
//                 type="file"
//                 id="videos"
//                 accept='video/*'
//                 hidden
//                 multiple
//                 onChange={handleVideoUpload}
//               />
//             </div>

//             <button
//               disabled={loading}
//               onClick={() => toast.promise(
//                 handleSubmit(),
//                 {
//                   loading: 'Uploading...',
//                   success: <p>Post Added Successfully!</p>,
//                   error: <p>Failed to add post</p>,
//                 }
//               )}
//               className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer disabled:opacity-50'
//             >
//               {loading ? 'Publishing...' : 'Publish Post'}
//             </button>
//           </div>

//           {/* File size info */}
//           <div className='text-xs text-gray-500 text-center'>
//             <p>Images: JPG, PNG, GIF • Videos: MP4, MOV, AVI (Max: 100MB)</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CreatePost


import React, { useState } from 'react'
import { Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from "react-redux";
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const user = useSelector((state)=>state.user.value)

  const  { getToken } = useAuth()
  
 const handleSubmit = async () => {
  if(!images.length && !content){
    return toast.error('Please add at least one image or text')
  }
  setLoading(true)

  const postType = images.length && content ? 'text_with_image' : images.length ? 'image' : 'text'

  try {
    const formData = new FormData();
    formData.append('content', content)
    formData.append('post_type', postType)
    images.map((image) =>{
      formData.append('images', image)
    })

    const { data } = await api.post('/api/post/add', formData, {headers: { Authorization: `Bearer ${await getToken()}`}})

    if (data.success) {
      navigate('/')
    }else{
      console.log(data.message)
      throw new Error(data.message)
    }
  } catch (error) {
    console.log(error.message)
    throw new Error(error.message)
  }
  setLoading(false)
 }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
         {/* Title */}
         <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
          <p className='text-slate-600'>Share your thoughts with the world</p>
         </div>

         {/* Form */}
         <div className='max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4'>
            {/* Header */}
            <div className='flex items-center gap-3'>
              <img src={user.profile_picture} alt="" className='w-12 h-12 rounded-full shadow'/>
              <div>
                <h2 className='font-semibold'>{user.full_name}</h2>
                <p className='text-sm text-gray-500'>@{user.username}</p>
              </div>
            </div>

            {/* Text Area */}
            <textarea className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400' placeholder="What's happening?" onChange={(e)=>setContent(e.target.value)} value={content}/>

             {/* Images */}
             {
              images.length > 0 && <div className='flex flex-wrap gap-2 mt-4'>
                {images.map((image, i)=>(
                  <div key={i} className='relative group'>
                    <img src={URL.createObjectURL(image)} className='h-20 rounded-md' alt="" />
                    <div onClick={()=> setImages(images.filter((_, index)=> index !== i))} className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'>
                      <X className="w-6 h-6 text-white"/>
                    </div>
                  </div>
                ))}
              </div>
             }

              {/* Bottom Bar */}
              <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
                <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
                  <Image className='size-6'/>
                </label>

                <input type="file" id="images" accept='image/*' hidden multiple onChange={(e)=>setImages([...images, ...e.target.files])}/>

                <button disabled={loading} onClick={()=> toast.promise(
                  handleSubmit(), 
                  {
                    loading: 'uploading ...',
                    success: <p>Post Added </p>,
                    error: <p>Post Not Added</p>,
                  }
                )} className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer'>
                  Publish Post
                </button>
              </div>
         </div>
      </div>
    </div>
  )
}

export default CreatePost
