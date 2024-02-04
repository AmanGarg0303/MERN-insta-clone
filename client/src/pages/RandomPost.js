import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SinglePost from "../components/SinglePost";

const RandomPost = () => {
  const path = useLocation().pathname.split("/")[2];

  const [singlePost, setSinglePost] = useState([]);
  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${path}`);
      setSinglePost([res.data]);
    };
    fetchPost();
  }, [path]);

  //getting random posts, after getting the required post
  const [randomPosts, setRandomPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/random/posts`);
        setRandomPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col p-1 overflow-y-auto overflow-x-hidden min-h-screen">
      {singlePost.map((sp) => (
        <SinglePost post={sp} key={sp._id} />
      ))}
      {/* <SinglePost post={singlePost} key={singlePost._id} /> */}

      {randomPosts.map((rp) => (
        <SinglePost post={rp} key={rp._id} />
      ))}
    </div>
  );
};

export default RandomPost;
