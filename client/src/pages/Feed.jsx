import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading.jsx'
import StoriesBar from '../components/StoriesBar.jsx'
import PostCard from '../components/PostCard.jsx'
import RecentMessages from '../components/RecentMessages.jsx'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import AdCarousel from '../components/AdCarousel.jsx'
import StoriesCarousel from '../components/StoriesCarousel.jsx'

const Feed = () => {

  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()


  const fetchFeeds = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/post/feed', { headers: { Authorization: `Bearer ${await getToken()}` } })

      if (data.success) {
        let posts = data.posts
        try {
          const redirectPostId = localStorage.getItem('redirectPostId')
          if (redirectPostId) {
            const idx = posts.findIndex(p => p._id === redirectPostId)
            if (idx > -1) {
              const highlighted = posts.splice(idx, 1)[0]
              posts = [highlighted, ...posts]
              localStorage.removeItem('redirectPostId')
            }
          }
        } catch {
          // Ignore localStorage errors
        }
        setFeeds(posts)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  // Xử lý khi post được cập nhật
  const handlePostUpdated = (updatedPost) => {
    setFeeds(prev => prev.map(post =>
      post._id === updatedPost._id ? updatedPost : post
    ))
  }

  // Xử lý khi post được xóa
  const handlePostDeleted = (deletedPostId) => {
    setFeeds(prev => prev.filter(post => post._id !== deletedPostId))
  }

  useEffect(() => {
    fetchFeeds()
    const id = setInterval(fetchFeeds, 30000)
    return () => clearInterval(id)
  }, [])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* Stories and post list */}
      <div>
        <StoriesCarousel />
        <div className='p-4 space-y-6'>
          {feeds.filter(Boolean).map((post, index) => (
            <PostCard
              key={post?._id || index}
              post={post}
              onLiked={fetchFeeds}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className='max-xl:hidden sticky top-0'>
        <AdCarousel></AdCarousel>
        <RecentMessages />
      </div>
    </div>
  ) : <Loading />
}

export default Feed
