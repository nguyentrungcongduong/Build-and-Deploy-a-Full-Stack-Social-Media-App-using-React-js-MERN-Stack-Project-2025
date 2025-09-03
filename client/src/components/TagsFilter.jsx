import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Search, Hash } from 'lucide-react'

const TagsFilter = ({ onTagsChange, filteredCount, totalCount }) => {
    const [selectedTags, setSelectedTags] = useState([])
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchMessage, setSearchMessage] = useState('')
    const dropdownRef = useRef(null)

    // Danh sách tags phổ biến
    const popularTags = [
        'Technology', 'Travel', 'Food', 'Sports', 'Music',
        'Movies', 'Books', 'Fashion', 'Beauty', 'Health',
        'Education', 'Business', 'Art', 'Nature', 'Animals',
        'Cars', 'Home', 'Gaming', 'Photography', 'Cooking',
        'Fitness', 'Yoga', 'Coffee', 'Wine', 'Pets', 'DIY',
        'Programming', 'AI', 'Startup', 'Marketing', 'Design',
        'Architecture', 'Science', 'History', 'Philosophy',
        'Poetry', 'Dance', 'Theater', 'Comedy', 'News',
        'Politics', 'Environment', 'Sustainability', 'Adventure',
        'Hiking', 'Camping', 'Beach', 'Mountain', 'City',
        'Country', 'Vintage', 'Modern', 'Minimalist', 'Luxury',
        'Budget', 'Organic', 'Vegan', 'GlutenFree', 'Keto',
        'Meditation', 'Mindfulness', 'Sleep', 'Nutrition',
        'MentalHealth', 'SelfCare'
    ]

    // Lọc tags dựa trên search term
    const filteredTags = popularTags.filter(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedTags.includes(tag)
    )

    // Xử lý click outside để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsExpanded(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Xử lý chọn tag
    const handleTagSelect = (tag) => {
        if (!selectedTags.includes(tag)) {
            const newTags = [...selectedTags, tag]
            setSelectedTags(newTags)
            onTagsChange(newTags)
        }
    }

    // Xử lý xóa tag
    const handleTagRemove = (tagToRemove) => {
        const newTags = selectedTags.filter(tag => tag !== tagToRemove)
        setSelectedTags(newTags)
        onTagsChange(newTags)
    }

    // Xử lý tìm kiếm tag
    const handleSearch = () => {
        if (searchTerm.trim()) {
            // Loại bỏ dấu # và khoảng trắng từ search term
            const cleanSearchTerm = searchTerm.replace(/[#\s]/g, '').toLowerCase()

            // Tìm tag chính xác trước
            let matchingTag = popularTags.find(tag =>
                tag.toLowerCase() === cleanSearchTerm
            )

            // Nếu không tìm thấy tag chính xác, tìm tag có chứa từ khóa
            if (!matchingTag) {
                matchingTag = popularTags.find(tag =>
                    tag.toLowerCase().includes(cleanSearchTerm) &&
                    !selectedTags.includes(tag)
                )
            }

            if (matchingTag && !selectedTags.includes(matchingTag)) {
                handleTagSelect(matchingTag)
                setSearchTerm('')
                setSearchMessage('')
            } else if (matchingTag && selectedTags.includes(matchingTag)) {
                setSearchMessage(`Tag "${matchingTag}" is already selected`)
                setTimeout(() => setSearchMessage(''), 3000)
                setSearchTerm('')
            } else {
                setSearchMessage(`No tag found for "${searchTerm}"`)
                setTimeout(() => setSearchMessage(''), 3000)
                setSearchTerm('')
            }
        }
    }

    // Xử lý Enter để tìm kiếm
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    // Xử lý xóa tất cả tags
    const handleClearAll = () => {
        setSelectedTags([])
        onTagsChange([])
    }

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                    Hôm nay bạn muốn xem gì?
                </h3>
                {selectedTags.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Tags đã chọn */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.map(tag => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                            <Hash size={14} />
                            {tag}
                            <button
                                onClick={() => handleTagRemove(tag)}
                                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Khung tìm kiếm và dropdown */}
            <div className="relative" ref={dropdownRef}>
                <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
                    <input
                        type="text"
                        placeholder="Search tags (e.g., #Book, Technology)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Search tags"
                    >
                        <Search size={18} />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-1 p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Show all tags"
                    >
                        <ChevronDown
                            size={20}
                            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* Dropdown tags */}
                {isExpanded && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                        {/* Popular tags */}
                        <div className="p-3 border-b border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.slice(0, 12).map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagSelect(tag)}
                                        disabled={selectedTags.includes(tag)}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.includes(tag)
                                            ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* All tags */}
                        <div className="p-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">All Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {filteredTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagSelect(tag)}
                                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                            {filteredTags.length === 0 && searchTerm && (
                                <p className="text-sm text-gray-500 mt-2">
                                    No tags found for "{searchTerm}"
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Thông báo tìm kiếm */}
            {searchMessage && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                    {searchMessage}
                </div>
            )}

            {/* Thống kê và hướng dẫn */}
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Type tag name and press Enter or click search</span>
                    <span>•</span>
                    <span>Click on tags to filter posts</span>
                </div>
                {selectedTags.length > 0 && (
                    <p className="text-xs text-blue-600 font-medium">
                        {filteredCount} / {totalCount} posts
                    </p>
                )}
            </div>
        </div>
    )
}

export default TagsFilter
