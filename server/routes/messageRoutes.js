import express from "express";
import { getChatMessages, sendMessage, sseControler } from "../controllers/messageController";
import { upload } from "../configs/multer";
import { protect } from "../middlewares/auth";



const messageRouter =express.Router();

messageRouter.get('/userId',sseControler)
messageRouter.post('/send',upload.single('image'),protect,sendMessage)
messageRouter.post('/get',protect,getChatMessages)


export default messageRouter
