import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

const fetchRandomPostsData = () => {
  return axios.get(`/posts/random/posts`);
};

const RandomPosts = () => {
  const [openUserModal, setOpenUserModal] = useState(false);
  useEffect(() => {}, []);

  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`users/searchUsers/s?username=${username}`);
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [username]);

  const { data, isLoading, isError, error } = useQuery(
    "random-posts-data",
    fetchRandomPostsData
  );

  if (isLoading) {
    return (
      <h2 className="text-white text-xl flex justify-center items-center h-[85vh]">
        Loading...
      </h2>
    );
  }

  if (isError) {
    return <h2 className="text-white text-xl">{error.message}</h2>;
  }

  // const [randomPosts, setRandomPosts] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get(`/posts/random/posts`);
  //       setRandomPosts(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <div className=" p-2 rounded-lg flex flex-col gap-2 min-h-screen">
      <div className="flex flex-col justify-between items-center p-1 rounded-lg ">
        <div className="bg-gray-100 flex flex-row justify-center items-center px-2 rounded w-full">
          <input
            className=" bg-gray-100 py-2 px-3 w-full outline-none text-black"
            type="text"
            placeholder="Search user"
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && setOpenUserModal(true)}
          />
          <FaSearch
            className="text-gray-400 text-xl"
            onClick={() => setOpenUserModal(true)}
          />
        </div>

        <hr className="border-1 bg-white mt-3 w-full" />

        <div className="grid grid-cols-3 w-full">
          {data?.data.map((r) => (
            <div className="border border-black h-28 " key={r._id}>
              <Link to={`/random/${r._id}`}>
                <img
                  src={
                    r?.image
                      ? process.env.REACT_APP_PUBLIC_FOLDER + r.image
                      : ""
                  }
                  alt=""
                  className="object-cover h-full w-full"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Searched users modal  */}
        <div
          className={`relative z-10 ${openUserModal ? "inline" : "hidden"} `}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center sm:items-center ">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-10/12 sm:my-8 sm:w-full sm:max-w-lg my-10">
                <div className="bg-black px-4 pt-2 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg font-medium leading-5 text-gray-400 mb-5"
                        id="modal-title"
                      >
                        Users
                      </h3>
                      <div className="bg-gray-100 flex flex-row justify-center items-center px-2 rounded w-full">
                        <input
                          className=" bg-gray-100 py-1 px-2 w-full outline-none text-black"
                          type="text"
                          placeholder="Search user"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <FaSearch className="text-gray-400 text-xl" />
                      </div>
                      <div className="mt-2 w-full overflow-y-auto">
                        {users.map((user) => (
                          <div
                            className="p-1 flex flex-col my-1 overflow-y-auto"
                            key={user._id}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <img
                                  src={
                                    user?.profileImg
                                      ? process.env.REACT_APP_PUBLIC_FOLDER +
                                        user.profileImg
                                      : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
                                  }
                                  alt=""
                                  className="w-11 h-11 rounded-full object-cover bg-gray-400 overflow-hidden m-1 mr-4"
                                />
                                <Link to={`/pro/${user?._id}`}>
                                  <h2>{user.username}</h2>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={() => setOpenUserModal(false)}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomPosts;
