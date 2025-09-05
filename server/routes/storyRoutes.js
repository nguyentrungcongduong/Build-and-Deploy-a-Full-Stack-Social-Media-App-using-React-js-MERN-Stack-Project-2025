// import express from 'express';
// import { upload } from '../configs/multer.js';
// import { protect } from '../middlewares/auth.js';
// import { addUserStory, getStories } from '../controllers/storyController.js';


// const storyRouter = express.Router()

// storyRouter.post('/create', upload.single('media'), protect, addUserStory)
// storyRouter.get('/get', protect, getStories)

// export default storyRouter



import express from 'express';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';
import { addUserStory, getStories, viewStory } from '../controllers/storyController.js';


const storyRouter = express.Router()

// Auth first before parsing multipart data
storyRouter.post('/create', protect, upload.single('media'), addUserStory)
storyRouter.get('/get', protect, getStories)
storyRouter.post('/view', protect, viewStory)

export default storyRouter