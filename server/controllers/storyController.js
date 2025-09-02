// import fs from "fs";
// import imagekit from "../configs/imageKit.js";
// import Story from "../models/Story.js";
// import User from "../models/User.js";
// import { inngest } from "../inngest/index.js";

// // Add User Story
// export const addUserStory = async (req, res) =>{
//     try {
//         const { userId } = req.auth();
//         const {content, media_type, background_color} = req.body;
//         const media = req.file
//         let media_url = ''

//         // upload media to imagekit
//         if(media_type === 'image' || media_type === 'video'){
//             const fileBuffer = fs.readFileSync(media.path)
//             const response = await imagekit.upload({
//                 file: fileBuffer,
//                 fileName: media.originalname,
//             })
//             media_url = response.url
//         }
//         // create story
//         const story = await Story.create({
//             user: userId,
//             content,
//             media_url,
//             media_type,
//             background_color
//         })

//         // schedule story deletion after 24 hours
//         await inngest.send({
//             name: 'app/story.delete',
//             data: { storyId: story._id }
//         })

//         res.json({success: true})

//     } catch (error) {
//        console.log(error);
//        res.json({ success: false, message: error.message }); 
//     }
// }

// // Get User Stories
// export const getStories = async (req, res) =>{
//     try {
//         const { userId } = req.auth();
//         const user = await User.findById(userId)

//         // User connections and followings 
//         const userIds = [userId, ...user.connections, ...user.following]

//         const stories = await Story.find({
//             user: {$in: userIds}
//         }).populate('user').sort({ createdAt: -1 });

//         res.json({ success: true, stories }); 
//     } catch (error) {
//        console.log(error);
//        res.json({ success: false, message: error.message }); 
//     }
// }



import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { inngest } from "../inngest/index.js";

// Add User Story
export const addUserStory = async (req, res) =>{
    try {
        const { userId } = req.auth();
        const {content, media_type, background_color} = req.body;
        const media = req.file
        let media_url = ''

        // upload media to imagekit
        if(media_type === 'image' || media_type === 'video'){
            const fileBuffer = fs.readFileSync(media.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
            })
            media_url = response.url
        }
        // create story
        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color
        })

        // schedule story deletion after 24 hours
        await inngest.send({
            name: 'app/story.delete',
            data: { storyId: story._id }
        })

        res.json({success: true})

    } catch (error) {
       console.log(error);
       res.json({ success: false, message: error.message }); 
    }
}

// Get User Stories
export const getStories = async (req, res) =>{
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId)

        // User connections and followings 
        const userIds = [userId, ...user.connections, ...user.following]

        const stories = await Story.find({
            user: {$in: userIds}
        }).populate('user').populate('views.user').sort({ createdAt: -1 });

        res.json({ success: true, stories }); 
    } catch (error) {
       console.log(error);
       res.json({ success: false, message: error.message }); 
    }
}

// View Story
export const viewStory = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { storyId } = req.body;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.json({ success: false, message: 'Story not found' });
        }

        // Check if user already viewed this story
        const alreadyViewed = story.views.find(view => view.user === userId);
        if (!alreadyViewed) {
            story.views.push({ user: userId, viewedAt: new Date() });
            await story.save();
        }

        // Get populated story with views
        const populatedStory = await Story.findById(storyId)
            .populate('user')
            .populate('views.user');

        res.json({ success: true, story: populatedStory });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}














