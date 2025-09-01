//cuấ hình chức năng lưu trữ từ bộ công cụ redux

import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice.js'
import connectionsReducer from '../features/connections/connectionsSlice.js'
import messagesReducer from '../features/messages/messagesSlice.js'


export const store = configureStore({
    reducer:{
      user:userReducer,
      connections: connectionsReducer,
      message: messagesReducer
    }
});
