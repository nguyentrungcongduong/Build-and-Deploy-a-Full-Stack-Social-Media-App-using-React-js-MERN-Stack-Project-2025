import React, { useState, useEffect, useRef } from 'react'
import './adCarousel.css'
import { adData, carouselConfig } from '../data/adData.js'

const AdCarousel = () => {
    const [currentAd, setCurrentAd] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [imageErrors, setImageErrors] = useState({})
    const [imageLoading, setImageLoading] = useState({})
    const intervalRef = useRef(null)

    const ads = adData

    // Tự động chuyển quảng cáo theo cấu hình
    useEffect(() => {
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                setCurrentAd((prev) => (prev + 1) % ads.length)
            }, carouselConfig.autoPlayInterval)
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [ads.length, isPaused])

    // Chuyển đến quảng cáo cụ thể khi click vào dot
    const goToAd = (index) => {
        setCurrentAd(index)
    }

    // Mở link quảng cáo
    const handleAdClick = (link) => {
        window.open(link, '_blank', 'noopener,noreferrer')
    }

    // Pause/Resume carousel
    const togglePause = () => {
        setIsPaused(!isPaused)
    }

    // Xử lý khi ảnh bị lỗi
    const handleImageError = (adId) => {
        setImageErrors(prev => ({ ...prev, [adId]: true }))
    }

    // Xử lý khi ảnh load thành công
    const handleImageLoad = (adId) => {
        setImageLoading(prev => ({ ...prev, [adId]: false }))
    }

    // Xử lý khi ảnh bắt đầu load
    const handleImageLoadStart = (adId) => {
        setImageLoading(prev => ({ ...prev, [adId]: true }))
    }

    // Icon cho từng category (fallback)
    const getCategoryIcon = (category) => {
        const icons = {
            ecommerce: '🛍️',
            transport: '🚗',
            automotive: '🚙',
            books: '📚',
            banking: '🏦',
            telecom: '📱',
            travel: '✈️',
            food: '☕',
            realestate: '🏠',
            education: '🎓'
        }
        return icons[category] || '📢'
    }

    return (
        <div className='max-xl:hidden sticky top-0 ad-carousel'>
            <div className='max-w-xs bg-white text-xs p-4 rounded-md shadow ad-carousel-enter'>
                <div className='flex justify-between items-center mb-3'>
                    <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
                    {carouselConfig.enablePause && (
                        <button
                            onClick={togglePause}
                            className='text-gray-500 hover:text-gray-700 transition-colors'
                            title={isPaused ? 'Resume' : 'Pause'}
                        >
                            {isPaused ? '▶️' : '⏸️'}
                        </button>
                    )}
                </div>

                {/* Carousel Container */}
                <div className='relative overflow-hidden rounded-md mb-3 group'>
                    <div
                        className='flex transition-transform ease-in-out'
                        style={{
                            transform: `translateX(-${currentAd * 100}%)`,
                            transitionDuration: `${carouselConfig.transitionDuration}ms`
                        }}
                    >
                        {ads.map((ad) => (
                            <div
                                key={ad.id}
                                className='w-full flex-shrink-0 cursor-pointer transform hover:scale-105 transition-transform duration-300'
                                onClick={() => handleAdClick(ad.link)}
                            >
                                <div className={`${ad.color} p-4 text-white rounded-md relative overflow-hidden ad-card`}>
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                                        <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Click to learn more
                                        </span>
                                    </div>

                                    {/* Ảnh quảng cáo với fallback */}
                                    <div className='w-full h-32 rounded-md mb-3 flex items-center justify-center relative'>
                                        {!imageErrors[ad.id] ? (
                                            <>
                                                {/* Loading state */}
                                                {imageLoading[ad.id] && (
                                                    <div className='absolute inset-0 bg-white bg-opacity-20 rounded-md flex items-center justify-center'>
                                                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                                                    </div>
                                                )}

                                                {/* Ảnh chính */}
                                                <img
                                                    src={ad.image}
                                                    className='w-full h-full object-cover rounded-md'
                                                    alt={ad.title}
                                                    loading="lazy"
                                                    onLoadStart={() => handleImageLoadStart(ad.id)}
                                                    onLoad={() => handleImageLoad(ad.id)}
                                                    onError={() => handleImageError(ad.id)}
                                                />
                                            </>
                                        ) : (
                                            /* Fallback với ảnh dự phòng */
                                            <img
                                                src={ad.fallbackImage}
                                                className='w-full h-full object-cover rounded-md'
                                                alt={ad.title}
                                                loading="lazy"
                                                onError={() => {
                                                    // Nếu cả ảnh dự phòng cũng lỗi, hiển thị icon
                                                    setImageErrors(prev => ({ ...prev, [ad.id]: 'final' }))
                                                }}
                                            />
                                        )}

                                        {/* Fallback cuối cùng với icon */}
                                        {imageErrors[ad.id] === 'final' && (
                                            <div className='absolute inset-0 bg-white bg-opacity-20 rounded-md flex items-center justify-center'>
                                                <div className='text-center'>
                                                    <div className='text-4xl mb-2'>{getCategoryIcon(ad.category)}</div>
                                                    <div className='text-xs opacity-75'>Sponsored Content</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <h4 className='font-semibold text-sm mb-1'>{ad.title}</h4>
                                    <p className='text-xs opacity-90'>{ad.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Navigation */}
                {carouselConfig.showDots && (
                    <div className='flex justify-center gap-1 mb-3'>
                        {ads.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToAd(index)}
                                className={`w-2 h-2 rounded-full dot ${index === currentAd
                                    ? 'bg-indigo-500 active'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Progress Bar */}
                {carouselConfig.showProgressBar && (
                    <div className='w-full bg-gray-200 rounded-full h-1 overflow-hidden'>
                        <div
                            className={`bg-indigo-500 h-1 rounded-full progress-bar ${isPaused ? 'ad-pulse' : ''
                                }`}
                            style={{
                                width: `${((currentAd + 1) / ads.length) * 100}%`
                            }}
                        />
                    </div>
                )}

                {/* Ad Counter */}
                {carouselConfig.showCounter && (
                    <div className='text-center text-xs text-gray-500 mt-2'>
                        {currentAd + 1} of {ads.length}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdCarousel
