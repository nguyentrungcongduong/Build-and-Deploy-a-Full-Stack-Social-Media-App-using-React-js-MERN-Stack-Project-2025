import React from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Messages = () => {
   const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">Talk to your friends and family</p>
        </div>

        {/* Connected users */}
        <div className="flex flex-col gap-3">
          {dummyConnectionsData.map((user) => (
            <div
              key={user._id}
              className="max-w-xl flex items-center justify-between gap-4 p-6 bg-white shadow rounded-md"
            >
              {/* User info */}
              <div className="flex items-center gap-4">
                <img
                  src={user.profile_picture}
                  className="rounded-full size-12"
                  alt={user.full_name}
                />
                <div>
                  <p className="font-medium text-slate-700">{user.full_name}</p>
                  <p className="text-slate-500">@{user.username}</p>
                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button onClick={()=>navigate(`/messages/${user._id})`)} className="size-10 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition">
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button  onClick={()=>navigate(`/profile/${user._id}`)} className="size-10 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
