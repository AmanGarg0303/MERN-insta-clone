import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const createPost = async (req, res, next) => {
  const newPost = new Post(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    next(error);
  }
};

//Get a post
export const getPost = async (req, res, next) => {
  const id = req.params.id;

  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

//Update a post
export const updatePost = async (req, res, next) => {
  const postId = req.params.id;

  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("Action forbidden!");
    }
  } catch (error) {
    next(error);
  }
};

//Delete a post
export const deletePost = async (req, res, next) => {
  const id = req.params.id;

  const { userId } = req.body;

  try {
    const post = await Post.findById(id);

    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted successfully!");
    } else {
      res.status(403).json("Action forbidden!");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

//all posts which are posted by the current user
export const getAllPostsOtherThanUserPosts = async (req, res, next) => {
  const id = req.params.id; //current userId

  const user = await User.findOne({ id });
  !user && res.status(404).json("User not found!");

  try {
    const a = await Post.find({ userId: { $nin: [id] } }).sort({
      createdAt: -1,
    });
    res.status(200).json(a);
  } catch (error) {
    next(error);
  }
};

//all posts other than mine and timeline posts
export const postsOtherThanTimeline = async (req, res, next) => {
  try {
    const a = [];
    const currentUser = await User.findById(req.params.id); //our id
    a.push(req.params.id);
    await Post.find({ userId: currentUser._id });
    await Promise.all(
      currentUser.following.map((friendId) => {
        return a.push(friendId);
      })
    );

    const b = await Post.find({ userId: { $nin: a } });
    res.status(200).json(b);
  } catch (error) {
    next(error);
  }
};

export const getRandomPosts = async (req, res, next) => {
  try {
    const randomposts = await Post.aggregate([{ $sample: { size: 10000 } }]);
    res.status(200).json(randomposts);
  } catch (error) {
    next(error);
  }
};

export const getAllTimelinePostsWithUserData = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id); //our id
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    next(error);
  }
};

//Like and dislike a post
export const likedislikePost = async (req, res, next) => {
  const id = req.params.id; //postid

  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post has been liked!");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post has been disliked!");
    }
  } catch (error) {
    next(error);
  }
};

//Get timeline posts
export const getTimelinePost = async (req, res, next) => {
  const userId = req.params.id; //our id

  try {
    const currentUserPosts = await Post.find({ userId: userId });
    const followingPosts = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res
      .status(200)
      .json(
        currentUserPosts
          .concat(...followingPosts[0].followingPosts)
          .sort((a, b) => b.createdAt - a.createdAt)
      );
  } catch (error) {
    next(error);
  }
};

export const particularUserPosts = async (req, res, next) => {
  const id = req.params.id;
  try {
    const posts = await Post.find({ userId: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
