import express from "express";
import {
    acceptConnectionRequest,
  discoverUsers,
  followUser,
  getUserConnections,
  getUserData,
  sendConnectionRequest,
  unfollowUser,
  updateUserData,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";

const useRouter = express.Router();

useRouter.get("/data", protect, getUserData);

useRouter.post(
  "/update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateUserData
);
useRouter.post("/discover", protect, discoverUsers);
useRouter.post("/follow", protect, followUser);
useRouter.post("/unfollow", protect, unfollowUser);
useRouter.post('/connect',protect,sendConnectionRequest)
useRouter.post('/accept',protect,acceptConnectionRequest)
useRouter.get('/connections',protect,getUserConnections)

export default useRouter;
