import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const toTop = () => {
      window.scrollTo(0, 0);
    };
    toTop();
  }, []);

  const [followersData, setFollowersData] = useState([]);
  useEffect(() => {
    const getUserFollowersData = async () => {
      try {
        const res = await axios.get(
          `users/followers/${currentUser?.details?._id}`
        );
        setFollowersData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserFollowersData();
  }, [currentUser?.details?._id]);

  const [followingData, setFollowingData] = useState([]);
  useEffect(() => {
    const getUserFollowingData = async () => {
      try {
        const res = await axios.get(
          `users/followings/${currentUser?.details?._id}`
        );
        setFollowingData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserFollowingData();
  }, [currentUser?.details?._id]);

  const [filterWork, setFilterWork] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Followers");
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });

  useEffect(() => {
    setFilterWork(followersData);
  }, [followersData]);

  const handleWorkFilter = (item) => {
    setActiveFilter(item);
    setAnimateCard([{ y: 100, opacity: 0 }]);

    setTimeout(() => {
      setAnimateCard([{ y: 0, opacity: 1 }]);

      if (item === "Followers") {
        setFilterWork(followersData);
      } else if (item === "Following") {
        setFilterWork(followingData);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col p-2 overflow-y-auto overflow-x-hidden min-h-[86vh]">
      <>
        <div className="">
          <div>
            <div className="flex justify-around items-center mx-2 flex-wrap">
              {["Followers", "Following"].map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleWorkFilter(item)}
                  className={`flex justify-center items-center py-2 px-4 m-2 rounded-lg bg-white text-black font-bold 
                  cursor-pointer hover:bg-purple-300 text-sm ${
                    activeFilter === item ? "bg-purple-400 text-white" : ""
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="max-w-3xl mx-auto px-5">
              <div className="max-w-lg h-[0.15rem] mx-auto bg-white"></div>
            </div>
            <div className="overflow-y-auto">
              {filterWork.map((f) => (
                <div className="p-1 flex flex-col my-1" key={f._id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={
                          f?.profileImg
                            ? process.env.REACT_APP_PUBLIC_FOLDER + f.profileImg
                            : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
                        }
                        alt=""
                        className="w-11 h-11 rounded-full object-cover bg-gray-400 overflow-hidden m-1 mr-4"
                      />
                      <Link to={`/pro/${f?._id}`}>
                        <h2>{f.username}</h2>
                      </Link>
                    </div>
                    {activeFilter === "Following" && (
                      <div className="relative p-0.5 inline-flex items-center justify-center font-semibold overflow-hidden group rounded-md">
                        <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
                        <span className="relative px-2 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400">
                          <span className="relative text-white text-xs">
                            Unfollow
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-gray-200 text-sm my-10">
              {filterWork.length === 0
                ? activeFilter === "Followers"
                  ? "No followers yet"
                  : "No following!"
                : ""}
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Notification;
