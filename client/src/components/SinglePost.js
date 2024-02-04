import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { TbBrandTelegram } from "react-icons/tb";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { followUser, unfollowUser } from "../redux/userSlice";

const SinglePost = ({ post }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [getUserData, setGetUserData] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/users/${post?.userId}`);
        setGetUserData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [post?.userId]);

  const followUnfollowUser = async () => {
    try {
      await axios.put(`/users/follow/${post?.userId}`, {
        _id: currentUser?.details?._id,
      });
      currentUser?.details?.following?.includes(post?.userId)
        ? dispatch(unfollowUser(post?.userId))
        : dispatch(followUser(post?.userId));
    } catch (error) {
      console.log(error);
    }
  };

  const [liked, setLiked] = useState(
    post?.likes?.includes(currentUser?.details?._id)
  );
  const [likes, setLikes] = useState(post?.likes?.length);

  const likeDislikePost = async () => {
    try {
      await axios.put(`/posts/${post._id}/likedislike`, {
        userId: currentUser?.details?._id,
      });
      setLiked((prev) => !prev);
      liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };

  let watingClick = null; // a reference to timeout function
  let lastClick = 0; // a watchdog for difference between 2 clicks

  return (
    <>
      <div className=" p-2 rounded-lg flex flex-col gap-2 my-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={
                getUserData?.profileImg
                  ? process.env.REACT_APP_PUBLIC_FOLDER + getUserData.profileImg
                  : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
              }
              alt=""
              className="w-9 h-9 object-cover rounded-full mr-4"
            />
            <Link
              to={
                currentUser?.details?._id === post.userId
                  ? "/profile"
                  : `/pro/${post?.userId}`
              }
            >
              <h2 className="font-bold">{getUserData.username}</h2>
            </Link>
          </div>

          {currentUser?.details?._id !== post?.userId && (
            <div>
              <div className="relative p-0.5 inline-flex items-center justify-center font-semibold overflow-hidden group rounded-md">
                <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
                <span
                  onClick={followUnfollowUser}
                  className="relative px-2 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400"
                >
                  <span className="relative text-white text-sm">
                    {currentUser?.details?.following?.includes(post?.userId)
                      ? "Unfollow"
                      : "Follow"}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="leading-tight text-sm text-gray-200">{post?.desc}</p>
        </div>

        <div>
          <img
            src={
              post?.image
                ? process.env.REACT_APP_PUBLIC_FOLDER + post.image
                : ""
            }
            alt=""
            className="rounded-md object-cover max-h-96 w-full bg-gray-100"
            onClick={(e) => {
              if (lastClick && e.timeStamp - lastClick < 250 && watingClick) {
                lastClick = 0;
                clearTimeout(watingClick);
                likeDislikePost();
                watingClick = null;
              } else {
                lastClick = e.timeStamp;
                watingClick = setTimeout(() => {
                  watingClick = null;
                  // console.log("Do the steps to respond single click");
                }, 251);
              }
            }}
          />
        </div>

        <div className="flex items-center gap-5">
          {liked ? (
            <AiFillHeart size={25} fill="red" onClick={likeDislikePost} />
          ) : (
            <AiFillHeart size={25} onClick={likeDislikePost} />
          )}
          <FaRegCommentDots size={25} />
          <TbBrandTelegram size={25} />
        </div>

        <span className="text-xs text-gray-200">{likes} likes</span>

        <div>
          <p className="text-sm leading-none text-gray-300">{post?.tags}</p>
        </div>
        <div>
          <p className="text-xs leading-none text-gray-300">
            Posted on {new Date(post?.createdAt).toDateString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default SinglePost;
