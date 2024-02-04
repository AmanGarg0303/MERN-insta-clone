import User from "../models/User.js";

//UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    const { password, isAdmin, ...otherDetails } = updatedUser._doc;

    res.status(200).json(otherDetails);
  } catch (err) {
    next(err);
  }
};

//DELETE USER
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

//GET USER
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//GET USERS
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

//follow a user and unfollow a user
export const followUser = async (req, res) => {
  const id = req.params.id; //another person id

  const { _id } = req.body; //our own id

  if (_id === id) {
    res.status(403).json("Action forbidden!");
  } else {
    try {
      const followUser = await User.findById(id); //the one who we want to follow
      const followingUser = await User.findById(_id); // it's us, who wants to follow someone

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User unfollowed!");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

//get a user all followers
export const getUserFollowers = async (req, res, next) => {
  const id = req.params.id; //current user id

  try {
    const user = await User.findById(id);

    try {
      const { followers } = user;
      const a = [];
      for (let i = 0; i < followers.length; i++) {
        const element = await followers[i];
        const fetchdata = await User.findById({ _id: element });

        const { password, isAdmin, ...otherDetails } = fetchdata._doc;
        a.push(otherDetails);
      }
      res.status(200).json(a);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (err) {
    next(err);
  }
};

export const getUserFollowings = async (req, res, next) => {
  const id = req.params.id; //current user id

  try {
    const user = await User.findById(id);

    try {
      const { following } = user;
      const a = [];
      for (let i = 0; i < following.length; i++) {
        const element = await following[i];
        const fetchdata = await User.findById({ _id: element });

        const { password, isAdmin, ...otherDetails } = fetchdata._doc;
        a.push(otherDetails);
      }
      res.status(200).json(a);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (err) {
    next(err);
  }
};

export const searchUser = async (req, res, next) => {
  const { username } = req.query;
  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
