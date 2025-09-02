import React, { useState, useEffect, useRef } from 'react'
import { Plus, ChevronLeft, ChevronRight, Eye, Clock } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal.jsx'
import StoryViewer from './StoryViewer.jsx'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import './StoriesCarousel.css'

const StoriesCarousel = () => {
    const { getToken, userId } = useAuth()
    const [stories, setStories] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [viewStory, setViewStory] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showViewers, setShowViewers] = useState(null)
    const carouselRef = useRef(null)

    const fetchStories = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get('/api/story/get', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setStories(data.stories)
            } else {
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleViewStory = async (story) => {
        try {
            const token = await getToken()
            await api.post('/api/story/view', { storyId: story._id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setViewStory(story)
        } catch (error) {
            console.error('Error viewing story:', error)
        }
    }

    const scrollToNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1)
            carouselRef.current?.scrollBy({ left: 120, behavior: 'smooth' })
        }
    }

    const scrollToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
            carouselRef.current?.scrollBy({ left: -120, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        fetchStories()
    }, [])

    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl px-4'>
            <div className='relative'>
                {/* Navigation Buttons */}
                {stories.length > 4 && (
                    <>
                        <button
                            onClick={scrollToPrev}
                            disabled={currentIndex === 0}
                            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed carousel-nav'
                        >
                            <ChevronLeft className='w-4 h-4' />
                        </button>
                        <button
                            onClick={scrollToNext}
                            disabled={currentIndex >= stories.length - 4}
                            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed carousel-nav'
                        >
                            <ChevronRight className='w-4 h-4' />
                        </button>
                    </>
                )}

                {/* Stories Carousel */}
                <div 
                    ref={carouselRef}
                    className='flex gap-4 pb-5 overflow-x-auto no-scrollbar scroll-smooth'
                >
                    {/* Add Story Card */}
                    <div 
                        onClick={() => setShowModal(true)} 
                        className='rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white flex-shrink-0'
                    >
                        <div className='h-full flex flex-col items-center justify-center p-4'>
                            <div className='size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3'>
                                <Plus className='w-5 h-5 text-white' />
                            </div>
                            <p className='text-sm font-medium text-slate-700 text-center'>Create Story</p>
                        </div>
                    </div>

                    {/* Story Cards */}
                    {stories.map((story, index) => (
                        <div 
                            key={index} 
                            className='relative rounded-lg shadow min-w-30 max-w-30 max-h-40 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 flex-shrink-0 story-card'
                        >
                            {/* Profile Picture */}
                            <img 
                                src={story.user?.profile_picture} 
                                alt="" 
                                className='absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow'
                            />
                            
                            {/* Content */}
                            <p className='absolute top-18 left-3 text-white/60 text-sm truncate max-w-24'>
                                {story.content}
                            </p>
                            
                            {/* Time */}
                            <p className='text-white absolute bottom-1 right-2 z-10 text-xs'>
                                {moment(story.createdAt).fromNow()}
                            </p>

                            {/* View Count */}
                            <div className='absolute top-3 right-3 z-10'>
                                <div className='flex items-center gap-1 bg-black/20 rounded-full px-2 py-1 view-count'>
                                    <Eye className='w-3 h-3 text-white' />
                                    <span className='text-white text-xs'>{story.views?.length || 0}</span>
                                </div>
                            </div>

                            {/* Viewers Button - Only for story owner */}
                            {story.views?.length > 0 && story.user?._id === userId && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowViewers(story)
                                    }}
                                    className='absolute bottom-8 left-3 z-10 bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors'
                                    title="Xem người đã xem story"
                                >
                                    <Eye className='w-3 h-3 text-white' />
                                </button>
                            )}

                            {/* Media Background */}
                            {story.media_type !== 'text' && (
                                <div className='absolute inset-0 z-1 rounded-lg bg-black overflow-hidden'>
                                    {story.media_type === "image" ? (
                                        <img 
                                            src={story.media_url} 
                                            alt="" 
                                            className='h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80'
                                            onClick={() => handleViewStory(story)}
                                        />
                                    ) : (
                                        <video 
                                            src={story.media_url} 
                                            className='h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80'
                                            onClick={() => handleViewStory(story)}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Text Story Background */}
                            {story.media_type === 'text' && (
                                <div 
                                    className='absolute inset-0 rounded-lg'
                                    style={{ backgroundColor: story.background_color || '#6366f1' }}
                                    onClick={() => handleViewStory(story)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Viewers Modal */}
            {showViewers && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 viewers-modal'>
                    <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-lg font-semibold'>Người đã xem story của bạn</h3>
                            <button 
                                onClick={() => setShowViewers(null)}
                                className='text-gray-500 hover:text-gray-700'
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className='space-y-3'>
                            {showViewers.views?.map((view, index) => (
                                <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                                    <div className='flex items-center gap-3'>
                                        <img 
                                            src={view.user?.profile_picture} 
                                            alt="" 
                                            className='w-8 h-8 rounded-full'
                                        />
                                        <div>
                                            <p className='font-medium text-sm'>{view.user?.full_name}</p>
                                            <p className='text-xs text-gray-500'>@{view.user?.username}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1 text-xs text-gray-500'>
                                        <Clock className='w-3 h-3' />
                                        {moment(view.viewedAt).fromNow()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Story Modal */}
            {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />}
            
            {/* View Story Modal */}
            {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
        </div>
    )
}

export default StoriesCarousel
