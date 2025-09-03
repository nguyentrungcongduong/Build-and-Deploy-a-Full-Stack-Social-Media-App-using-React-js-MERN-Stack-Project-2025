import React, { useState, useCallback } from 'react'
import { BadgeCheck, Heart, MessageCircle, MoveVertical, Share2, X, Trash2 } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useAuth, useUser } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { CircleEllipsis } from 'lucide-react';

const PostCard = ({ post, onLiked, requireAuth = false, onPostUpdated, onPostDeleted }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [editContent, setEditContent] = useState('')
    const [editImages, setEditImages] = useState([])
    const [editVideos, setEditVideos] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const postWithHashtags = (post?.content || '').replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>')
    const [likes, setLikes] = useState(Array.isArray(post?.likes_count) ? post.likes_count : [])
    const currentUser = useSelector((state) => state.user.value)
    const [commenting, setCommenting] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState(Array.isArray(post?.comments) ? post.comments : [])

    const { getToken } = useAuth()
    const { isSignedIn } = useUser()
    const navigate = useNavigate()

    // Kiểm tra user có phải là chủ bài post không
    const isPostOwner = currentUser?._id === post?.user?._id

    // Mở modal chỉnh sửa
    const openEditModal = useCallback(() => {
        setEditContent(post?.content || '')
        setEditImages([])
        setEditVideos([])
        setEditModalOpen(true)
        setMenuOpen(false)
    }, [post?.content])

    // Mở modal xác nhận xóa
    const openDeleteConfirm = useCallback(() => {
        setDeleteConfirmOpen(true)
        setMenuOpen(false)
    }, [])

    // Xử lý chỉnh sửa post
    const handleEditPost = useCallback(async () => {
        if (!post?._id) return

        const content = editContent.trim()
        if (!content) {
            toast.error('Post content cannot be empty')
            return
        }

        setIsEditing(true)
        try {
            const formData = new FormData()
            formData.append('content', content)

            // Thêm ảnh mới nếu có
            editImages.forEach((image) => {
                formData.append('images', image)
            })

            // Thêm video mới nếu có
            editVideos.forEach((video) => {
                formData.append('videos', video)
            })

            const { data } = await api.put(`/api/post/${post._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (data.success) {
                toast.success('Post updated successfully')
                setEditModalOpen(false)
                // Gọi callback để cập nhật UI
                onPostUpdated && onPostUpdated(data.post)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update post')
        } finally {
            setIsEditing(false)
        }
    }, [post?._id, editContent, editImages, editVideos, getToken, onPostUpdated])

    // Xử lý xóa post
    const handleDeletePost = useCallback(async () => {
        if (!post?._id) return

        setIsDeleting(true)
        try {
            const { data } = await api.delete(`/api/post/${post._id}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })

            if (data.success) {
                toast.success('Post deleted successfully')
                setDeleteConfirmOpen(false)
                // Gọi callback để cập nhật UI
                onPostDeleted && onPostDeleted(post._id)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete post')
        } finally {
            setIsDeleting(false)
        }
    }, [post?._id, getToken, onPostDeleted])

    const handleLike = async () => {
        if (!post?._id) return
        if (requireAuth && !isSignedIn) {
            toast.error('Vui lòng đăng nhập để thích bài viết này. Bài viết sẽ được hiển thị ở trang chủ của bạn sau khi đăng nhập.')
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
            toast.error('Vui lòng đăng nhập để bình luận. Bài viết sẽ được hiển thị ở trang chủ của bạn sau khi đăng nhập.')
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

    //     return (
    //         <className = 'bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
    //             {/* User Info */ }
    //             < div onClick = {() => post?.user?._id && navigate('/profile/' + post.user._id)} className = 'inline-flex items-center gap-3 cursor-pointer' >
    // {
    //     post?.user?.profile_picture?(
    //                     <img src = { post.user.profile_picture } alt = "" className = 'w-10 h-10 rounded-full shadow' />
    //                 ): (
    //             <div className = 'w-10 h-10 rounded-full shadow bg-gray-200 text-gray-600 grid place-items-center text-sm font-medium'>
    //                         { (post?.user?.full_name?.[0] || 'U').toUpperCase()}
    //                     </div >
    //                 )}
    // <div>
    //     <div className='flex items-center space-x-1'>
    //         <span>{post?.user?.full_name || 'Unknown User'}</span>
    //         <BadgeCheck className='w-4 h-4 text-blue-500' />
    //     </div>
    //     <div className='text-gray-500 text-sm'>@{post?.user?.username || 'unknown'} • {moment(post.createdAt).fromNow()}</div>
    // </div>
    //             </ >

    //     <div className='relative'>
    //         <MoveVertical className='w-5 h-5 text-gray-600 cursor-pointer'
    //             onClick={() => setMenuOpen(prev => !prev)} />
    //         {
    //             menuOpen && (
    //                 <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
    //                     <button
    //                         className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
    //                         onClick={() => {
    //                             setMenuOpen(false)
    //                             console.log("Edit post", post._id)
    //                             // 👉 mở modal chỉnh sửa ở đây
    //                         }}
    //                     >
    //                         ✏️ Chỉnh sửa
    //                     </button>
    //                     <button
    //                         className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
    //                         onClick={() => {
    //                             setMenuOpen(false)
    //                             console.log("Delete post", post._id)
    //                             // 👉 gọi API xóa post ở đây
    //                         }}
    //                     >
    //                         🗑 Xóa bài
    //                     </button>
    //                     <button
    //                         className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
    //                         onClick={() => {
    //                             setMenuOpen(false)
    //                             console.log("Filter by tags", post.content)
    //                             // 👉 lọc theo tags từ nội dung post
    //                         }}
    //                     >
    //                         #️⃣ Lọc theo tags
    //                     </button>
    //                 </div>
    //             )
    //         }
    //     </div>

    // {/* Content */ }
    // { post?.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{ __html: postWithHashtags }} /> }

    // {/* Images */ }
    // <div className='grid grid-cols-2 gap-2'>
    //     {(post?.image_urls || []).map((img, index) => (
    //         <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${((post?.image_urls || []).length === 1) && 'col-span-2 h-auto'}`} alt="" />
    //     ))}
    // </div>

    // {/* Actions */ }
    // <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
    //     <div className='flex items-center gap-1'>
    //         <Heart className={`w-4 h-4 cursor-pointer ${currentUser?._id && likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike} />
    //         <span>{likes.length}</span>
    //     </div>
    //     <div className='flex items-center gap-1'>
    //         <MessageCircle className="w-4 h-4 cursor-pointer" onClick={() => {
    //             if (requireAuth && !isSignedIn) {
    //                 toast.error('Please log in to comment')
    //                 try { localStorage.setItem('redirectPostId', post._id) } catch { /* ignore */ }
    //                 navigate('/')
    //                 return
    //             }
    //             setCommenting(prev => !prev)
    //         }} />
    //         <span>{comments.length}</span>
    //     </div>
    //     <div className='flex items-center gap-1'>
    //         <Share2 className="w-4 h-4 cursor-pointer" onClick={() => {
    //             if (requireAuth && !isSignedIn) {
    //                 toast.error('Please log in to share')
    //                 try { localStorage.setItem('redirectPostId', post._id) } catch { /* ignore */ }
    //                 navigate('/')
    //                 return
    //             }
    //             const publicUrl = `${window.location.origin}/post/${post._id}`
    //             navigator.clipboard.writeText(publicUrl)
    //             toast.success('Post link copied to clipboard')
    //         }} />
    //     </div>

    //     {commenting && (
    //         <div className='pt-2 space-y-3'>
    //             <div className='flex gap-2'>
    //                 <input value={commentText} onChange={(e) => setCommentText(e.target.value)} type="text" placeholder='Write a comment...' className='flex-1 p-2 text-sm border border-gray-200 rounded-md' />
    //                 <button onClick={handleAddComment} className='px-3 py-2 text-xs rounded bg-indigo-500 hover:bg-indigo-600 text-white active:scale-95'>Send</button>
    //             </div>
    //             <div className='space-y-2'>
    //                 {comments.map((c, idx) => (
    //                     <div key={idx} className='flex items-start gap-2 text-sm'>
    //                         <span className='font-medium'>{c.user?.full_name || c.user}</span>
    //                         <span className='text-gray-600'>{c.text}</span>
    //                         <span className='text-gray-400 text-xs ml-auto'>{moment(c.createdAt).fromNow()}</span>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     )}
    // </div>
    //             </div >
    //             )
    // }
    return (
        <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
            <div className='flex justify-between items-center'>
                {/* User Info */}
                <div
                    onClick={() => post?.user?._id && navigate('/profile/' + post.user._id)}
                    className='inline-flex items-center gap-3 cursor-pointer'
                >
                    {post?.user?.profile_picture ? (
                        <img
                            src={post.user.profile_picture}
                            alt=""
                            className='w-10 h-10 rounded-full shadow'
                        />
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
                        <div className='text-gray-500 text-sm'>
                            @{post?.user?.username || 'unknown'} • {moment(post.createdAt).fromNow()}
                        </div>
                    </div>
                </div>

                {/* Menu ba chấm - chỉ hiển thị khi user là chủ bài post */}
                {isPostOwner && (
                    <div className='relative'>
                        <CircleEllipsis
                            className='w-5 h-5 text-gray-600 cursor-pointer'
                            onClick={() => setMenuOpen(prev => !prev)}
                        />
                        {menuOpen && (
                            <div className='absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-50'>
                                <button
                                    className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                                    onClick={openEditModal}
                                >
                                    ✏️ Chỉnh sửa
                                </button>
                                <button
                                    className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600'
                                    onClick={openDeleteConfirm}
                                >
                                    🗑 Xóa bài
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Content */}
            {post?.content && (
                <div
                    className='text-gray-800 text-sm whitespace-pre-line'
                    dangerouslySetInnerHTML={{ __html: postWithHashtags }}
                />
            )}

            {/* Media (Images & Videos) */}
            {(post?.image_urls?.length > 0 || post?.video_urls?.length > 0) && (
                <div className='space-y-3'>
                    {/* Images */}
                    {post?.image_urls?.length > 0 && (
                        <div className='grid grid-cols-2 gap-2'>
                            {post.image_urls.map((img, index) => (
                                <img
                                    src={img}
                                    key={`img-${index}`}
                                    className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`}
                                    alt=""
                                />
                            ))}
                        </div>
                    )}

                    {/* Videos */}
                    {post?.video_urls?.length > 0 && (
                        <div className='space-y-2'>
                            {post.video_urls.map((video, index) => (
                                <div key={`video-${index}`} className='relative'>
                                    <video
                                        src={video}
                                        controls
                                        className='w-full h-64 object-cover rounded-lg'
                                        poster={video.replace('.mp4', '.jpg')} // Fallback poster
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className='absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded'>
                                        Video
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
                <div className='flex items-center gap-1'>
                    <Heart
                        className={`w-4 h-4 cursor-pointer ${currentUser?._id &&
                            likes.includes(currentUser._id) &&
                            'text-red-500 fill-red-500'
                            }`}
                        onClick={handleLike}
                    />
                    <span>{likes.length}</span>
                </div>

                <div className='flex items-center gap-1'>
                    <MessageCircle
                        className='w-4 h-4 cursor-pointer'
                        onClick={() => {
                            if (requireAuth && !isSignedIn) {
                                toast.error('Please log in to comment')
                                try {
                                    localStorage.setItem('redirectPostId', post._id)
                                } catch {
                                    /* ignore */
                                }
                                navigate('/')
                                return
                            }
                            setCommenting(prev => !prev)
                        }}
                    />
                    <span>{comments.length}</span>
                </div>

                <div className='flex items-center gap-1'>
                    <Share2
                        className='w-4 h-4 cursor-pointer'
                        onClick={() => {
                            if (requireAuth && !isSignedIn) {
                                toast.error('Please log in to share')
                                try {
                                    localStorage.setItem('redirectPostId', post._id)
                                } catch {
                                    /* ignore */
                                }
                                navigate('/')
                                return
                            }
                            const publicUrl = `${window.location.origin}/post/${post._id}`
                            navigator.clipboard.writeText(publicUrl)
                            toast.success('Post link copied to clipboard')
                        }}
                    />
                </div>

                {commenting && (
                    <div className='pt-2 space-y-3'>
                        <div className='flex gap-2'>
                            <input
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                type='text'
                                placeholder='Write a comment...'
                                className='flex-1 p-2 text-sm border border-gray-200 rounded-md'
                            />
                            <button
                                onClick={handleAddComment}
                                className='px-3 py-2 text-xs rounded bg-indigo-500 hover:bg-indigo-600 text-white active:scale-95'
                            >
                                Send
                            </button>
                        </div>
                        <div className='space-y-2'>
                            {comments.map((c, idx) => (
                                <div key={idx} className='flex items-start gap-2 text-sm'>
                                    <span className='font-medium'>
                                        {c.user?.full_name || c.user}
                                    </span>
                                    <span className='text-gray-600'>{c.text}</span>
                                    <span className='text-gray-400 text-xs ml-auto'>
                                        {moment(c.createdAt).fromNow()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Chỉnh Sửa */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Chỉnh sửa bài viết</h3>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
                            rows="4"
                            placeholder="Viết nội dung bài viết..."
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />

                        {/* Hiển thị ảnh hiện tại */}
                        {post?.image_urls && post.image_urls.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Ảnh hiện tại:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {post.image_urls.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt=""
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload ảnh mới */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Thêm ảnh mới (tùy chọn):</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setEditImages(Array.from(e.target.files))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {editImages.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">Ảnh mới sẽ thay thế ảnh cũ</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {editImages.map((img, index) => (
                                            <img
                                                key={index}
                                                src={URL.createObjectURL(img)}
                                                alt=""
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleEditPost}
                                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                                disabled={isEditing}
                            >
                                {isEditing ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xác Nhận Xóa */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
                        <Trash2 className="mx-auto h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Xác nhận xóa bài viết</h3>
                        <p className="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn xóa bài viết này không? Đây là hành động không thể hoàn tác.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteConfirmOpen(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 active:scale-95 disabled:opacity-50"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Đang xóa...' : 'Xóa bài'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default PostCard
