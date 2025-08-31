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
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Message from "./pages/Message";
import ChatBox from "./pages/ChatBox";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Connections from "./pages/Connections";
import { useUser, useAuth } from "@clerk/clerk-react";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (user) {
      getToken().then((token) => console.log(token));
    }
  }, [user, getToken]);

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
