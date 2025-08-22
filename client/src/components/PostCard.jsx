import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import React from "react";
import moment from "moment";
import { dummyUserData } from "../assets/assets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const PostCard = ({ post }) => {
  const postWidthHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class=" text-indigo-600 ">$1</span>'
  );

  const [likes, setLikes] = useState(post.likes_count);
  const handleLike = async() => {

  }

   const navigate = useNavigate();

  const currentUser=dummyUserData
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      {/* User info */}
      <div onClick={()=>navigate('/profile/'+post.user.profile_picture)} className="flex items-center gap-3 cursor-pointer">
        <img
          src={post.user.profile_picture}
          alt={`${post.user.full_name} avatar`}
          className="w-10 h-10 rounded-full shadow"
        />
        <div>
          <div className="flex items-center space-x-1">
            <span className="font-medium">{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-gray-500 text-sm">
            @{post.user.username} · {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>
      {/* Content */}
      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWidthHashtags }}
        />
      )}
      {/* Image(s) */}
      {post.image_urls?.length > 0 && (
        <div
          className={`grid gap-2 ${
            post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.image_urls.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Post image ${index + 1}`}
              className={`w-full object-cover rounded-lg ${
                post.image_urls.length === 1 ? "h-auto" : "h-48"
              }`}
            />
          ))}
        </div>
      )}
      {/* // Action */}
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
        <div className="flex items-center gap-1">
            <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike}/>
                <span>{likes.length}</span>
        </div>

         <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4"/>
                <span>{12}</span>
        </div>

        <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4"/>
                <span>{7}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
