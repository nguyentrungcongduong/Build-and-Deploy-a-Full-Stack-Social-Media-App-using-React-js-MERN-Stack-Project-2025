import express from 'express';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';
import { addPost, getFeedPosts, likePost, addComment, getPublicPost, getLikedPosts, updatePost, deletePost } from '../controllers/postController.js';

const postRouter = express.Router()

postRouter.post('/add', upload.array('images', 4), protect, addPost)
postRouter.get('/feed', protect, getFeedPosts)
postRouter.post('/like', protect, likePost)
postRouter.post('/comment', protect, addComment)
postRouter.get('/public/:postId', getPublicPost)
postRouter.get('/liked/:userId', getLikedPosts)
postRouter.put('/:postId', upload.array('images', 4), protect, updatePost)
postRouter.delete('/:postId', protect, deletePost)

export default postRouter