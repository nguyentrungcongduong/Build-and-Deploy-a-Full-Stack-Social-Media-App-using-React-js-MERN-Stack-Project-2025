// import React, { useRef } from "react";
// import { Route, Routes, useLocation } from "react-router-dom";
// import Login from "./pages/Login.jsx";
// import Feed from "./pages/Feed.jsx";
// import Message from "./pages/Message.jsx";
// import ChatBox from "./pages/ChatBox.jsx";
// import Discover from "./pages/Discover.jsx";
// import Profile from "./pages/Profile.jsx";
// import CreatePost from "./pages/CreatePost.jsx";
// import Connections from "./pages/Connections.jsx";
// import { useUser, useAuth } from "@clerk/clerk-react";
// import Layout from "./pages/Layout.jsx";
// import toast, { Toaster } from "react-hot-toast";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { fetchUser } from "./features/user/userSlice.js";
// import { fetchConnections } from "./features/connections/connectionsSlice.js";
// import { addMessage } from "./features/messages/messagesSlice.js";

// const App = () => {
//   const { user } = useUser();
//   const { getToken } = useAuth();
//   const { pathname } = useLocation();
//   const pathnameRef = useRef(pathname);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchData = async () => {
//       if (user) {
//         const token = await getToken();
//         dispatch(fetchUser(token));
//         dispatch(fetchConnections(token));
//       }
//     };

//     fetchData();
//   }, [user, getToken, dispatch]);

//   useEffect(() => {
//     pathnameRef.current = pathname;
//   }, [pathname]);

//   useEffect(() => {
//     if (user) {
//       const eventSource = new EventSource(
//         import.meta.env.VITE_BASEURL + "/api/message/" + user._id
//       );

//       eventSource.onmessage = (event) => {
//         const message = JSON.parse(event.data);

//         if (pathnameRef.current === ("/messages/" + message.from_user_id._id)) {
//           dispatch(addMessage(message));
//         } else {
//           toast.custom(
//             (t) => <Notification t={t} message={message}/>
//           ),{ position: "bottom-right" })
//         }
//       }

//       return () => {
//         eventSource.close();
//       }
//     }
//   }, [user, dispatch]);
  
  
//   return (
//     <>
//       <Toaster />
//       <Routes>
//         <Route path="/" element={!user ? <Login /> : <Layout />}>
//           {/* Nested routes inside Layout */}
//           <Route index element={<Feed />} />
//           <Route path="feed" element={<Feed />} />
//           <Route path="messages" element={<Message />} />
//           <Route path="messages/:userId" element={<ChatBox />} />
//           <Route path="connections" element={<Connections />} />
//           <Route path="discover" element={<Discover />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="profile/:profileId" element={<Profile />} />
//           <Route path="create-post" element={<CreatePost />} />
//         </Route>
//       </Routes>
//     </>
//   );
// };

// export default App;
import React, { useRef, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice.js";
import { fetchConnections } from "./features/connections/connectionsSlice.js";
import { addMessage } from "./features/messages/messagesSlice.js";
import Notification from "./components/Notification.jsx"; // ✅ thêm import

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  const dispatch = useDispatch();

  // Fetch user info & connections khi login
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    };
    fetchData();
  }, [user, getToken, dispatch]);

  // Update pathnameRef để biết đang ở route nào
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Listen message qua SSE (Server-Sent Events)
  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(
        import.meta.env.VITE_BASEURL + "/api/message/" + user.id
      );

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (pathnameRef.current === "/messages/" + message.from_user_id._id) {
          // Nếu đang chat đúng user đó thì push message vào redux
          dispatch(addMessage(message));
        } else {
          // Nếu đang ở route khác => show notification
          toast.custom(
            (t) => <Notification t={t} message={message} />,
            { position: "bottom-right" } // ✅ đúng cú pháp
          );
        }
      };

      return () => {
        eventSource.close();
      };
    }
  }, [user, dispatch]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
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
