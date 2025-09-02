import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import Loading from '../components/Loading.jsx'
import PostCard from '../components/PostCard.jsx'
import toast from 'react-hot-toast'

const PublicPost = () => {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchPost = async () => {
        try {
            setLoading(true)
            const { data } = await api.get(`/api/post/public/${postId}`)
            if (data.success) {
                setPost(data.post)
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
            {post ? <PostCard post={post} requireAuth /> : <div className='text-slate-600'>Post not found</div>}
        </div>
    ) : (<Loading />)
}

export default PublicPost


