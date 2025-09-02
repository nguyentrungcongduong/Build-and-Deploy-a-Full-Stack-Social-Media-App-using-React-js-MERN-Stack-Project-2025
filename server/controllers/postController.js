// import fs from "fs";
// import imagekit from "../configs/imageKit.js";
// import Post from "../models/Post.js";
// import User from "../models/User.js";

// // Add Post
// export const addPost = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { content, post_type } = req.body;
//         const images = req.files

//         let image_urls = []

//         if (images.length) {
//             image_urls = await Promise.all(
//                 images.map(async (image) => {
//                     const fileBuffer = fs.readFileSync(image.path)
//                     const response = await imagekit.upload({
//                         file: fileBuffer,
//                         fileName: image.originalname,
//                         folder: "posts",
//                     })

//                     const url = imagekit.url({
//                         path: response.filePath,
//                         transformation: [
//                             { quality: 'auto' },
//                             { format: 'webp' },
//                             { width: '1280' }
//                         ]
//                     })
//                     return url
//                 })
//             )
//         }

//         await Post.create({
//             user: userId,
//             content,
//             image_urls,
//             post_type
//         })
//         res.json({ success: true, message: "Post created successfully" });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// // Get Posts
// export const getFeedPosts = async (req, res) => {
//     try {
//         const { userId } = req.auth()
//         const user = await User.findById(userId)

//         // User connections and followings 
//         const userIds = [userId, ...user.connections, ...user.following]
//         const posts = await Post.find({ user: { $in: userIds } }).populate('user').sort({ createdAt: -1 });

//         res.json({ success: true, posts })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// // Like Post
// export const likePost = async (req, res) => {
//     try {
//         const { userId } = req.auth()
//         const { postId } = req.body;

//         const post = await Post.findById(postId)

//         if (post.likes_count.includes(userId)) {
//             post.likes_count = post.likes_count.filter(user => user !== userId)
//             await post.save()
//             res.json({ success: true, message: 'Post unliked' });
//         } else {
//             post.likes_count.push(userId)
//             await post.save()
//             res.json({ success: true, message: 'Post liked' });
//         }

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// // Add Comment
// export const addComment = async (req, res) => {
//     try {
//         const { userId } = req.auth()
//         const { postId, text } = req.body

//         if (!text || !text.trim()) {
//             return res.json({ success: false, message: 'Comment text is required' })
//         }

//         const post = await Post.findById(postId)
//         if (!post) {
//             return res.json({ success: false, message: 'Post not found' })
//         }

//         post.comments.push({ user: userId, text: text.trim() })
//         await post.save()

//         res.json({ success: true, message: 'Comment added', comments: post.comments })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// // Get Public Post (no auth)
// export const getPublicPost = async (req, res) => {
//     try {
//         const { postId } = req.params
//         const post = await Post.findById(postId).populate('user').lean()
//         if (!post) {
//             return res.json({ success: false, message: 'Post not found' })
//         }
//         return res.json({ success: true, post })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// // Get posts liked by a user
// export const getLikedPosts = async (req, res) => {
//     try {
//         const { userId } = req.params
//         const posts = await Post.find({ likes_count: userId }).populate('user').sort({ createdAt: -1 })
//         res.json({ success: true, posts })
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }




import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Add Post
export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, post_type } = req.body;
        const images = req.files

        let image_urls = []

        if (images.length) {
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path)
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts",
                    })

                    const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: 'auto' },
                            { format: 'webp' },
                            { width: '1280' }
                        ]
                    })
                    return url
                })
            )
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })
        res.json({ success: true, message: "Post created successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Posts
export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)

        // User connections and followings 
        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({ user: { $in: userIds } }).populate('user').populate('comments.user').sort({ createdAt: -1 });

        res.json({ success: true, posts })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Like Post
export const likePost = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId } = req.body;

        const post = await Post.findById(postId)

        if (post.likes_count.includes(userId)) {
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            res.json({ success: true, message: 'Post unliked' });
        } else {
            post.likes_count.push(userId)
            await post.save()
            res.json({ success: true, message: 'Post liked' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add Comment
export const addComment = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId, text } = req.body

        if (!text || !text.trim()) {
            return res.json({ success: false, message: 'Comment text is required' })
        }

        const post = await Post.findById(postId)
        if (!post) {
            return res.json({ success: false, message: 'Post not found' })
        }

        post.comments.push({ user: userId, text: text.trim() })
        await post.save()

        // Populate the comments with user data before sending response
        const populatedPost = await Post.findById(postId).populate('comments.user')
        res.json({ success: true, message: 'Comment added', comments: populatedPost.comments })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Public Post (no auth)
export const getPublicPost = async (req, res) => {
    try {
        const { postId } = req.params
        const post = await Post.findById(postId).populate('user').populate('comments.user').lean()
        if (!post) {
            return res.json({ success: false, message: 'Post not found' })
        }
        return res.json({ success: true, post })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get posts liked by a user
export const getLikedPosts = async (req, res) => {
    try {
        const { userId } = req.params
        const posts = await Post.find({ likes_count: userId }).populate('user').populate('comments.user').sort({ createdAt: -1 })
        res.json({ success: true, posts })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update Post
export const updatePost = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId } = req.params
        const { content } = req.body
        const images = req.files

        const post = await Post.findById(postId)
        if (!post) {
            return res.json({ success: false, message: 'Post not found' })
        }

        // Kiểm tra user có phải là chủ bài post không
        if (post.user.toString() !== userId) {
            return res.json({ success: false, message: 'You can only edit your own posts' })
        }

        let image_urls = post.image_urls || []

        // Nếu có ảnh mới được upload
        if (images && images.length > 0) {
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path)
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts",
                    })

                    const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: 'auto' },
                            { format: 'webp' },
                            { width: '1280' }
                        ]
                    })
                    return url
                })
            )
        }

        // Cập nhật post
        post.content = content || post.content
        post.image_urls = image_urls
        await post.save()

        const updatedPost = await Post.findById(postId).populate('user').populate('comments.user')
        res.json({ success: true, message: 'Post updated successfully', post: updatedPost })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Delete Post
export const deletePost = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId } = req.params

        const post = await Post.findById(postId)
        if (!post) {
            return res.json({ success: false, message: 'Post not found' })
        }

        // Kiểm tra user có phải là chủ bài post không
        if (post.user.toString() !== userId) {
            return res.json({ success: false, message: 'You can only delete your own posts' })
        }

        // Xóa post
        await Post.findByIdAndDelete(postId)
        res.json({ success: true, message: 'Post deleted successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}