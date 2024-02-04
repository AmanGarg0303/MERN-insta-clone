import express from "express";
import {
  deleteUser,
  followUser,
  getUser,
  getUserFollowers,
  getUserFollowings,
  getUsers,
  searchUser,
  updateUser,
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

// router.get("/checkauthentication", verifyToken, (req, res, next) => {
//   res.send("Hello user, you are authenticated! ");
// });

// router.get("/checkuser/:id", verifyUser, (req, res, next) => {
//   res.send("Hello user, you are logged in and u can delete your account! ");
// });

// router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
//   res.send(
//     "Hello admin, you are logged in and u can delete anyone's account! "
//   );
// });

//UPDATE
router.put("/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:id", verifyToken, getUser);

//Search a user
router.get("/searchUsers/s", searchUser);

//GET ALL
router.get("/", verifyAdmin, getUsers);

//follow user and unfollow user
router.put("/follow/:id", verifyToken, followUser);

//get user followers
router.get("/followers/:id", getUserFollowers); //current user id

//get user following
router.get("/followings/:id", getUserFollowings); //current user id

export default router;
