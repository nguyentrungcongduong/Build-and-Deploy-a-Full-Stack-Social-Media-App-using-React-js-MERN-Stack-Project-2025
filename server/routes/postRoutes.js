// import express from 'express';
// import { upload, handleMulterError } from '../configs/multer.js';
// import { protect } from '../middlewares/auth.js';
// import { addPost, getFeedPosts, likePost, addComment, getPublicPost, getLikedPosts, updatePost, deletePost } from '../controllers/postController.js';

// const postRouter = express.Router()

// // Sử dụng multer với field names khác nhau cho ảnh và video
// postRouter.post('/add', upload.fields([
//     { name: 'images', maxCount: 4 },
//     { name: 'videos', maxCount: 2 }
// ]), handleMulterError, protect, addPost)

// postRouter.get('/feed', protect, getFeedPosts)
// postRouter.post('/like', protect, likePost)
// postRouter.post('/comment', protect, addComment)
// postRouter.get('/public/:postId', getPublicPost)
// postRouter.get('/liked/:userId', getLikedPosts)

// // Cập nhật route edit post để hỗ trợ video
// postRouter.put('/:postId', upload.fields([
//     { name: 'images', maxCount: 4 },
//     { name: 'videos', maxCount: 2 }
// ]), handleMulterError, protect, updatePost)

// postRouter.delete('/:postId', protect, deletePost)

// export default postRouter


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