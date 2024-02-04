import React, { useEffect, useState } from "react";
import SinglePost from "../components/SinglePost";
import axios from "axios";
import { useSelector } from "react-redux";

const AllPosts = () => {
  const { currentUser } = useSelector((state) => state.user);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get("/posts/");
  //       setPosts(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `/posts/postsotherthantimeline/${currentUser?.details?._id}`
        );
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [currentUser?.details?._id]);

  const [timelinePosts, setTimelinePosts] = useState([]);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `/posts/${currentUser?.details?._id}/timeline`
        );
        setTimelinePosts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [currentUser?.details?._id]);

  return (
    <div className="flex flex-col p-1 overflow-y-auto overflow-x-hidden min-h-screen">
      {timelinePosts.map((tpost) => (
        <SinglePost post={tpost} key={tpost._id} />
      ))}
      {currentUser?.details?.following?.length > 0 ? (
        <span className="bg-[#123456] p-2 m-2 rounded-lg text-sm text-center">
          You are all cached up your friends posts!
        </span>
      ) : (
        <span className="bg-[#123456] p-2 m-2 rounded-lg text-sm text-center">
          No friends, follow some!
        </span>
      )}

      {posts.map((post) => (
        <SinglePost post={post} key={post?._id} />
      ))}
    </div>
  );
};

export default AllPosts;
