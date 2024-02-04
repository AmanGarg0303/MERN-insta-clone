import React, { useState, useRef, useEffect } from "react";
import SinglePost from "../components/SinglePost";
import { useSelector, useDispatch } from "react-redux";
import {
  logout,
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/userSlice";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useQuery } from "react-query";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const toTop = () => {
      window.scrollTo(0, 0);
    };
    toTop();
  }, []);

  const myPosts = useQuery(
    "currentUser-posts",
    () => {
      return axios.get(
        `/posts/particularuserposts/${currentUser?.details?._id}`
      );
    },
    {
      cacheTime: 60 * 60 * 1000,
      refetchInterval: 60 * 60 * 1000,
      refetchIntervalInBackground: true,
    }
  );

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [profileImg, setImage] = useState(null);
  const imageRef = useRef();
  const username = useRef();
  const about = useRef();

  const onImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setImage(img);
    }
  };

  const reset = () => {
    setImage(null);
    username.current.value = "";
    about.current.value = "";
  };

  const handleEditProfile = async () => {
    dispatch(updateStart());
    const editProfile = {
      username: username.current.value || currentUser?.details?.username,
      about: about.current.value || currentUser?.details?.about,
    };

    if (profileImg) {
      const data = new FormData();
      const filename = Date.now() + profileImg.name;
      data.append("name", filename);
      data.append("file", profileImg);
      editProfile.profileImg = filename;
      // console.log(editProfile);

      try {
        await axios.post("/upload/", data);
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const res = await axios.put(
        `/users/${currentUser?.details?._id}`,
        editProfile
      );
      dispatch(updateSuccess(res.data));
    } catch (error) {
      console.log(error);
      dispatch(updateFailure());
    }

    reset();
  };

  const logoutUser = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
  };

  // const [myPosts, setMyPosts] = useState([]);
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const res = await axios.get(
  //         `/posts/particularuserposts/${currentUser?.details?._id}`
  //       );
  //       setMyPosts(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchPosts();
  // }, [currentUser?.details?._id]);

  return (
    <div className=" p-2 rounded-lg flex flex-col gap-2 min-h-screen">
      <div className="flex justify-between items-center p-2 rounded-lg ">
        <div className="flex flex-col items-center  w-1/4 ">
          <img
            src={
              currentUser?.details?.profileImg
                ? process.env.REACT_APP_PUBLIC_FOLDER +
                  currentUser.details.profileImg
                : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
            }
            alt=""
            className="w-14 h-14 rounded-full object-cover bg-gray-400 overflow-hidden mb-1"
          />
          <h1 className="text-sm">{currentUser?.details?.username}</h1>
        </div>

        <div className="flex justify-evenly w-3/4 gap-1">
          <div className="flex flex-col items-center">
            <h2>Posts</h2>
            <h3 className="text-gray-200">{myPosts?.data?.data?.length}</h3>
          </div>
          <div className="flex items-center">
            <span className="block w-[1px] h-8 bg-gray-500"></span>
          </div>
          <div className="flex flex-col items-center">
            <h2>Followers</h2>
            <h3 className="text-gray-200">
              {currentUser?.details?.followers?.length}
            </h3>
          </div>
          <div className="flex items-center">
            <span className="block w-[1px] h-8 bg-gray-500"></span>
          </div>
          <div className="flex flex-col items-center">
            <h2>Following</h2>
            <h3 className="text-gray-200">
              {currentUser?.details?.following?.length}
            </h3>
          </div>
        </div>
      </div>

      <div className="px-2">
        <p className="text-gray-200 leading-tight text-sm">
          {/* <span className="text-white">About You - </span> */}
          {currentUser?.details?.about?.length > 0
            ? currentUser?.details?.about
            : "No bio"}
        </p>
      </div>

      <div className=" p-2 rounded-lg flex justify-between text-sm text-gray-200">
        <div className="relative p-[1px] inline-flex items-center justify-center font-semibold overflow-hidden group rounded-md">
          <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
          <span
            onClick={() => setOpenEditProfile(true)}
            className="relative px-2 py-1 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400"
          >
            <span className="relative text-white text-sm">Edit Profile</span>
          </span>
        </div>
        <div className="relative p-[1px] inline-flex items-center justify-center font-semibold overflow-hidden group rounded-md">
          <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
          <span
            className="relative px-2 py-1 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400"
            onClick={logoutUser}
          >
            <span className="relative text-white text-sm">Logout</span>
          </span>
        </div>
      </div>

      {/* Edit button Modal  */}
      <div
        className={`relative z-10 ${openEditProfile ? "inline" : "hidden"} `}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg my-10">
              <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-400"
                      id="modal-title"
                    >
                      Edit Profile
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to edit your profile?
                      </p>
                      <form className="flex flex-col">
                        <div className="bg-gray-100 flex flex-row justify-center items-center my-1 py-1.5 px-2 rounded text-sm">
                          <input
                            className=" bg-gray-100 py-1 px-2 w-full outline-none text-black"
                            type="text"
                            placeholder="New Username"
                            ref={username}
                          />
                        </div>
                        <div className="bg-gray-100 flex flex-row justify-center items-center my-1 py-1.5 px-2 rounded text-sm">
                          <textarea
                            className=" bg-gray-100 py-1 px-2 w-full outline-none text-black"
                            type="text"
                            placeholder="About you"
                            rows={3}
                            ref={about}
                          ></textarea>
                        </div>
                        <div className="bg-gray-100 flex flex-row justify-center items-center my-1 py-1.5 px-2 text-sm rounded">
                          <img
                            src={
                              profileImg
                                ? URL.createObjectURL(profileImg)
                                : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
                            }
                            alt=""
                            className="w-14 h-14 rounded-full overflow-hidden"
                            onClick={() => imageRef.current.click()}
                          />
                          <span
                            className="text-gray-500 text-xs mx-5"
                            onClick={() => imageRef.current.click()}
                          >
                            Change Profile Pic
                          </span>
                          <input
                            type="file"
                            name="myImage"
                            ref={imageRef}
                            onChange={onImgChange}
                            className="hidden"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    handleEditProfile();
                    setOpenEditProfile(false);
                  }}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Edit Confirm
                </button>
                <button
                  onClick={() => setOpenEditProfile(false)}
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
      <Toaster />

      {myPosts?.data?.data.map((post) => (
        <SinglePost post={post} key={post._id} />
      ))}
      {myPosts?.data?.data.length === 0 && (
        <div className="text-center mt-10 text-gray-200 text-sm">
          No posts yet!
        </div>
      )}
    </div>
  );
};

export default Profile;
