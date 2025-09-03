import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import Loading from '../components/Loading.jsx'
import PostCard from '../components/PostCard.jsx'
import toast from 'react-hot-toast'
import { useUser } from '@clerk/clerk-react'
import PostCardOptimized from '../components/PostCardOptimized.jsx'
const PublicPost = () => {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const { isSignedIn } = useUser()

    const fetchPost = async () => {
        try {
            setLoading(true)
            const { data } = await api.get(`/api/post/public/${postId}`)
            if (data.success) {
                setPost(data.post)

                // Lưu postId vào localStorage nếu user chưa đăng nhập
                // để có thể hiển thị bài post này ở trang chủ sau khi đăng nhập
                if (!isSignedIn && postId) {
                    try {
                        localStorage.setItem('redirectPostId', postId)
                    } catch (error) {
                        console.error('Error saving redirectPostId:', error)
                    }
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (postId) {
            fetchPost()
        }
    }, [postId])

    return !loading ? (
        <div className='min-h-screen w-full flex items-start justify-center p-6 bg-slate-50'>
            {post ? <PostCardOptimized post={post} requireAuth /> : <div className='text-slate-600'>Post not found</div>}
        </div>
    ) : (<Loading />)
}

export default PublicPost


