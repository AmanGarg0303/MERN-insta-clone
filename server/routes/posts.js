import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostsOtherThanUserPosts,
  getAllTimelinePostsWithUserData,
  getPost,
  getRandomPosts,
  getTimelinePost,
  likedislikePost,
  particularUserPosts,
  postsOtherThanTimeline,
  updatePost,
} from "../controllers/post.js";
import { verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createPost);

router.get("/:id", verifyToken, getPost);

router.put("/:id", verifyUser, updatePost);

router.delete("/:id", verifyUser, deletePost);

router.get("/", verifyToken, getAllPosts);

router.get("/otheruserposts/:id", verifyToken, getAllPostsOtherThanUserPosts);

router.get("/postsotherthantimeline/:id", postsOtherThanTimeline);

router.get("/random/posts", verifyToken, getRandomPosts);

router.get("/timelineposts/:id", getAllTimelinePostsWithUserData); //userid

router.put("/:id/likedislike", verifyToken, likedislikePost);

router.get("/:id/timeline", verifyToken, getTimelinePost); //we are sending userId here

router.get("/particularuserposts/:id", verifyToken, particularUserPosts); //user id

export default router;
