import React, { useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useAuth, useUser } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const PostCard = ({ post, onLiked, requireAuth = false }) => {

    const postWithHashtags = (post?.content || '').replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>')
    const [likes, setLikes] = useState(Array.isArray(post?.likes_count) ? post.likes_count : [])
    const currentUser = useSelector((state) => state.user.value)
    const [commenting, setCommenting] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState(Array.isArray(post?.comments) ? post.comments : [])

    const { getToken } = useAuth()
    const { isSignedIn } = useUser()

    const handleLike = async () => {
        if (!post?._id) return
        if (requireAuth && !isSignedIn) {
            toast.error('Please log in to like this post')
            try { localStorage.setItem('redirectPostId', post._id) } catch { /* ignore */ }
            navigate('/')
            return
        }
        try {
            const { data } = await api.post(`/api/post/like`, { postId: post._id }, { headers: { Authorization: `Bearer ${await getToken()}` } })

            if (data.success) {
                toast.success(data.message)
                setLikes(prev => {
                    const userId = currentUser?._id
                    if (!userId) {
                        return prev
                    }
                    if (prev.includes(userId)) {
                        return prev.filter(id => id !== userId)
                    } else {
                        return [...prev, userId]
                    }
                })
                onLiked && onLiked()
            } else {
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleAddComment = async () => {
        if (requireAuth && !isSignedIn) {
            toast.error('Please log in to comment')
            try { localStorage.setItem('redirectPostId', post._id) } catch { /* ignore */ }
            navigate('/')
            return
        }
        if (!post?._id) return
        const text = commentText.trim()
        if (!text) return
        try {
            const { data } = await api.post(`/api/post/comment`, { postId: post._id, text }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setComments(data.comments)
                setCommentText('')
                toast.success('Comment added')
                onLiked && onLiked()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const navigate = useNavigate()

    return (
        <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
            {/* User Info */}
            <div onClick={() => post?.user?._id && navigate('/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
                {post?.user?.profile_picture ? (
                    <img src={post.user.profile_picture} alt="" className='w-10 h-10 rounded-full shadow' />
                ) : (
                    <div className='w-10 h-10 rounded-full shadow bg-gray-200 text-gray-600 grid place-items-center text-sm font-medium'>
                        {(post?.user?.full_name?.[0] || 'U').toUpperCase()}
                    </div>
                )}
                <div>
                    <div className='flex items-center space-x-1'>
                        <span>{post?.user?.full_name || 'Unknown User'}</span>
                        <BadgeCheck className='w-4 h-4 text-blue-500' />
                    </div>
                    <div className='text-gray-500 text-sm'>@{post?.user?.username || 'unknown'} • {moment(post.createdAt).fromNow()}</div>
                </div>
            </div>
            {/* Content */}
            {post?.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{ __html: postWithHashtags }} />}

            {/* Images */}
            <div className='grid grid-cols-2 gap-2'>
                {(post?.image_urls || []).map((img, index) => (
                    <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${((post?.image_urls || []).length === 1) && 'col-span-2 h-auto'}`} alt="" />
                ))}
            </div>

            {/* Actions */}
            <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
                <div className='flex items-center gap-1'>
                    <Heart className={`w-4 h-4 cursor-pointer ${currentUser?._id && likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike} />
                    <span>{likes.length}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <MessageCircle className="w-4 h-4 cursor-pointer" onClick={() => {
                        if (requireAuth && !isSignedIn) {
                            toast.error('Please log in to comment')
                            try { localStorage.setItem('redirectPostId', post._id) } catch { /* ignore */ }
                            navigate('/')
                            return
                        }
                        setCommenting(prev => !prev)
                    }} />
                    <span>{comments.length}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <Share2 className="w-4 h-4 cursor-pointer" onClick={() => {
                        if (requireAuth && !isSignedIn) {
                            toast.error('Please log in to share')
                            try { localStorage.setItem('redirectPostId', post._id) } catch { /* ignore */ }
                            navigate('/')
                            return
                        }
                        const publicUrl = `${window.location.origin}/post/${post._id}`
                        navigator.clipboard.writeText(publicUrl)
                        toast.success('Post link copied to clipboard')
                    }} />
                </div>

                {commenting && (
                    <div className='pt-2 space-y-3'>
                        <div className='flex gap-2'>
                            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} type="text" placeholder='Write a comment...' className='flex-1 p-2 text-sm border border-gray-200 rounded-md' />
                            <button onClick={handleAddComment} className='px-3 py-2 text-xs rounded bg-indigo-500 hover:bg-indigo-600 text-white active:scale-95'>Send</button>
                        </div>
                        <div className='space-y-2'>
                            {comments.map((c, idx) => (
                                <div key={idx} className='flex items-start gap-2 text-sm'>
                                    <span className='font-medium'>{c.user?.username || c.user}</span>
                                    <span className='text-gray-600'>{c.text}</span>
                                    <span className='text-gray-400 text-xs ml-auto'>{moment(c.createdAt).fromNow()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


        </div>
    )
}

export default PostCard
