import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading.jsx'
import StoriesBar from '../components/StoriesBar.jsx'
// import PostCard from '../components/PostCard.jsx'
import RecentMessages from '../components/RecentMessages.jsx'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import AdCarousel from '../components/AdCarousel.jsx'
import StoriesCarousel from '../components/StoriesCarousel.jsx'
import TagsFilter from '../components/TagsFilter.jsx'
import PostCardOptimized from '../components/PostCardOptimized.jsx'
const Feed = () => {

  const [feeds, setFeeds] = useState([])
  const [filteredFeeds, setFilteredFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTags, setSelectedTags] = useState([])
  const [redirectPostHandled, setRedirectPostHandled] = useState(false)
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
    setFilteredFeeds(prev => prev.filter(post => post._id !== deletedPostId))
  }

  // Xử lý khi tags thay đổi
  const handleTagsChange = (tags) => {
    setSelectedTags(tags)
  }

  // Lọc bài viết theo tags
  const filterPostsByTags = (posts, tags) => {
    if (tags.length === 0) return posts

    return posts.filter(post => {
      if (!post.content) return false

      const postContent = post.content.toLowerCase()

      return tags.some(tag => {
        const tagLower = tag.toLowerCase()

        // Kiểm tra tag có trong nội dung (có hoặc không có dấu #)
        if (postContent.includes(tagLower)) return true
        if (postContent.includes(`#${tagLower}`)) return true

        // Kiểm tra tag với dấu # và khoảng trắng
        if (postContent.includes(`# ${tagLower}`)) return true

        // Kiểm tra tag với dấu # và dấu gạch dưới
        if (postContent.includes(`#_${tagLower}`)) return true

        // Kiểm tra tag với dấu # và dấu gạch ngang
        if (postContent.includes(`#-${tagLower}`)) return true

        // Kiểm tra tag với dấu # và số
        if (postContent.includes(`#${tagLower}1`) || postContent.includes(`#${tagLower}2`)) return true

        return false
      })
    })
  }



  // Xử lý redirectPostId ngay khi component mount
  useEffect(() => {
    const handleRedirectPost = () => {
      // Chỉ xử lý một lần
      if (redirectPostHandled) return

      try {
        const redirectPostId = localStorage.getItem('redirectPostId')
        if (redirectPostId && feeds.length > 0) {
          // Tìm bài post trong danh sách hiện tại
          const postIndex = feeds.findIndex(p => p._id === redirectPostId)
          if (postIndex > -1) {
            // Đưa bài post lên đầu danh sách
            const highlightedPost = feeds.splice(postIndex, 1)[0]
            const newFeeds = [highlightedPost, ...feeds]
            setFeeds(newFeeds)
            setFilteredFeeds(newFeeds)

            // Hiển thị thông báo
            toast.success('Bài viết bạn vừa xem đã được hiển thị ở đầu trang chủ!')

            // Scroll đến đầu trang để user thấy bài post được highlight
            window.scrollTo({ top: 0, behavior: 'smooth' })

            // Xóa redirectPostId sau khi đã xử lý xong
            localStorage.removeItem('redirectPostId')

            // Đánh dấu đã xử lý
            setRedirectPostHandled(true)
          } else {
            // Nếu không tìm thấy bài post trong feed, có thể do quyền truy cập
            toast.error('Không thể hiển thị bài viết này trong trang chủ của bạn')
            localStorage.removeItem('redirectPostId')
            setRedirectPostHandled(true)
          }
        }
      } catch (error) {
        console.error('Error handling redirectPostId:', error)
        setRedirectPostHandled(true)
      }
    }

    // Chỉ xử lý khi feeds đã được load
    if (feeds.length > 0) {
      handleRedirectPost()
    }
  }, [feeds, redirectPostHandled])

  useEffect(() => {
    fetchFeeds()
    const id = setInterval(fetchFeeds, 30000)
    return () => clearInterval(id)
  }, [])

  // Cập nhật filtered feeds khi feeds hoặc tags thay đổi
  useEffect(() => {
    const filtered = filterPostsByTags(feeds, selectedTags)
    setFilteredFeeds(filtered)
  }, [feeds, selectedTags])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* Stories and post list */}
      <div>
        <StoriesCarousel />
        <TagsFilter
          onTagsChange={handleTagsChange}
          filteredCount={filteredFeeds.filter(Boolean).length}
          totalCount={feeds.filter(Boolean).length}
        />
        <div className='p-4 space-y-6'>
          {filteredFeeds.filter(Boolean).length > 0 ? (
            filteredFeeds.filter(Boolean).map((post, index) => (
              <PostCardOptimized
                key={post?._id || index}
                post={post}
                onLiked={() => { }} // Không làm gì để giữ optimistic updates
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))
          ) : selectedTags.length > 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No posts found matching tags: {selectedTags.join(', ')}
              </p>
              <button
                onClick={() => setSelectedTags([])}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                View all posts
              </button>
            </div>
          ) : null}
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
