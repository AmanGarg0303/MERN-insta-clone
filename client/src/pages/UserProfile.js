import React, { useState, useEffect } from "react";
import SinglePost from "../components/SinglePost";
import axios from "axios";
import { useLocation } from "react-router-dom";

const UserProfile = () => {
  const path = useLocation().pathname.split("/")[2];

  useEffect(() => {
    const toTop = () => {
      window.scrollTo(0, 0);
    };
    toTop();
  }, []);

  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/posts/particularuserposts/${path}`);
        setUserPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [path]);

  const [getUserData, setGetUserData] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/users/${path}`);
        setGetUserData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [path]);
  //   console.log(getUserData);

  return (
    <div className=" p-2 rounded-lg flex flex-col gap-2 min-h-screen">
      <div className="flex justify-between items-center p-2 rounded-lg ">
        <div className="flex flex-col items-center  w-1/4 ">
          <img
            src={
              getUserData?.profileImg
                ? process.env.REACT_APP_PUBLIC_FOLDER + getUserData.profileImg
                : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
            }
            alt=""
            className="w-14 h-14 rounded-full object-cover bg-gray-400 overflow-hidden mb-1"
          />
          <h1 className="text-sm">{getUserData.username}</h1>
        </div>

        <div className="flex justify-evenly w-3/4 gap-1">
          <div className="flex flex-col items-center">
            <h2>Posts</h2>
            <h3 className="text-gray-200">{userPosts?.length}</h3>
          </div>
          <div className="flex items-center">
            <span className="block w-[1px] h-8 bg-gray-500"></span>
          </div>
          <div className="flex flex-col items-center">
            <h2>Followers</h2>
            <h3 className="text-gray-200">{getUserData?.followers?.length}</h3>
          </div>
          <div className="flex items-center">
            <span className="block w-[1px] h-8 bg-gray-500"></span>
          </div>
          <div className="flex flex-col items-center">
            <h2>Following</h2>
            <h3 className="text-gray-200">{getUserData?.following?.length}</h3>
          </div>
        </div>
      </div>

      <div className="px-2">
        <p className="text-gray-200 leading-tight text-sm">
          {getUserData?.about}
        </p>
      </div>

      {userPosts.map((post) => (
        <SinglePost post={post} key={post._id} />
      ))}

      {userPosts?.length === 0 && (
        <div className="text-center mt-16 text-gray-200 text-sm ">
          No posts yet!
        </div>
      )}
    </div>
  );
};

export default UserProfile;
