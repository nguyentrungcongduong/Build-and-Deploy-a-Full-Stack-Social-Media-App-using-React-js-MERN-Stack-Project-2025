import express from 'express';
import { getChatMessages, sendMessage, sseController } from '../controllers/messageController.js';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';


const messageRouter = express.Router();

messageRouter.get('/:userId', sseController)
// Auth first, then parse multipart form (single image file)
messageRouter.post('/send', protect, upload.single('image'), sendMessage)
messageRouter.post('/get', protect, getChatMessages)

export default messageRouter