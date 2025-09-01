// import React from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Login from './pages/Login'
// import Feed from './pages/Feed'
// import Message from './pages/Message'
// import ChatBox from './pages/ChatBox'
// import Discover from './pages/Discover'
// import Profile from './pages/Profile'
// import CreatePost from './pages/CreatePost'
// import Connections from './pages/Connections'
// import { useUser } from '@clerk/clerk-react'
// import Layout from './pages/Layout'
// const App = () => {
//   const { user } = useUser()
//   return (
//     <>
//       <Routes>
//         <Route path='/' element={!user ? <Login />: <Layout/>} />
//         <Route path='/feed' element={<Feed />} />
//         <Route path='/messages' element={<Message />} />
//         <Route path='/messages/:userId' element={<ChatBox />} />
//         <Route path='/connections' element={<Connections />} />
//         <Route path='/discover' element={<Discover />} />
//         <Route path='/profile' element={<Profile />} />
//         <Route path='/profile/:profileId' element={<Profile />} />
//         <Route path='/create-post' element={<CreatePost />} />
//       </Routes>
//     </>
//   )
// }

// export default App
import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Feed from "./pages/Feed.jsx";
import Message from "./pages/Message.jsx";
import ChatBox from "./pages/ChatBox.jsx";
import Discover from "./pages/Discover.jsx";
import Profile from "./pages/Profile.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Connections from "./pages/Connections.jsx";
import { useUser, useAuth } from "@clerk/clerk-react";
import Layout from "./pages/Layout.jsx";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice.js";
import { fetchConnections } from "./features/connections/connectionsSlice.js";

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token))
      }
    }

    fetchData()
  }, [user, getToken,dispatch]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          {/* Nested routes inside Layout */}
          <Route index element={<Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="messages" element={<Message />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
