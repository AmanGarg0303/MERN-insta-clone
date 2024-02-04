import React, { useRef, useState } from "react";
import { TbHome2, TbCirclePlus } from "react-icons/tb";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  RiSettings3Line,
  RiUploadCloudLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Navbar = () => {
  const toTop = () => {
    window.scrollTo(0, 0);
  };

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const desc = useRef();
  const tags = useRef();

  const onImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setImage(img);
    }
  };

  const reset = () => {
    setImage(null);
    desc.current.value = "";
    tags.current.value = "";
  };

  const handleAddPost = async (e) => {
    // e.preventDefault();

    const newPost = {
      userId: currentUser?.details?._id,
      desc: desc.current.value,
      tags: tags.current.value,
    };

    if (image) {
      const data = new FormData();
      const filename = Date.now() + image.name;
      data.append("name", filename);
      data.append("file", image);
      newPost.image = filename;
      // console.log(newPost);

      try {
        // dispatch(uploadImage(data));
        await axios.post("/upload/", data);
      } catch (error) {
        console.log(error);
      }
    }
    // dispatch(uploadPost(newPost));
    await axios.post("/posts/", newPost);

    reset();
  };

  return (
    <>
      <div className="sticky bottom-0 bg-[#081420] w-full flex justify-around items-end px-2 pt-1 pb-2 z-50">
        <Link to="/">
          <div onClick={toTop}>
            <TbHome2 size={30} />
          </div>
        </Link>
        <Link to="/random">
          <div onClick={toTop}>
            <BiSearchAlt2 size={30} />
          </div>
        </Link>
        <div>
          <TbCirclePlus
            size={40}
            color="white"
            className="rounded-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6]"
            onClick={() => setOpenUploadModal(true)}
          />
        </div>
        <Link to="/notifications">
          <div>
            <IoMdNotificationsOutline size={30} />
          </div>
        </Link>
        <Link to="/profile">
          <div onClick={toTop}>
            <RiSettings3Line size={31} />
          </div>
        </Link>
      </div>

      {/* Add a post modal  */}
      <div
        className={`relative z-10 ${openUploadModal ? "inline" : "hidden"} `}
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
                      className="text-lg font-medium leading-5 text-gray-400"
                      id="modal-title"
                    >
                      Add a post
                    </h3>
                    <div className="mt-2 w-full">
                      <form className="flex flex-col">
                        <div className="bg-gray-100 flex flex-row justify-center items-center my-1 py-1.5 px-2 rounded text-sm">
                          <textarea
                            className=" bg-gray-100 py-1 px-2 w-full outline-none text-black"
                            type="text"
                            placeholder="Post Description"
                            ref={desc}
                            required
                            rows={2}
                          ></textarea>
                        </div>

                        <div className="bg-gray-100 flex flex-row justify-center items-center my-1 py-1.5 px-2 rounded text-sm">
                          <input
                            className=" bg-gray-100 py-1 px-2 w-full outline-none text-black"
                            type="text"
                            placeholder="#hashtags"
                            ref={tags}
                          />
                        </div>
                        <div className="bg-gray-100 flex flex-col justify-center items-center my-1 py-1.5 px-2 text-sm rounded">
                          <div
                            className={`flex items-center justify-center ${
                              image && "justify-between"
                            } w-full`}
                          >
                            <div className="flex items-center gap-2 my-1">
                              <RiUploadCloudLine
                                size={25}
                                color="black"
                                onClick={() => imageRef.current.click()}
                              />
                              <span
                                className="text-gray-500 text-xs mx-5"
                                onClick={() => imageRef.current.click()}
                              >
                                Add a pic
                              </span>
                            </div>
                            {image && (
                              <div onClick={() => setImage(null)}>
                                <RiDeleteBin6Line size={15} color="red" />
                              </div>
                            )}
                          </div>

                          <input
                            type="file"
                            name="myImage"
                            ref={imageRef}
                            onChange={onImgChange}
                            className="hidden"
                          />
                          {image && (
                            <img
                              src={
                                image
                                  ? URL.createObjectURL(image)
                                  : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
                              }
                              alt=""
                              className="w-full h-40 rounded-lg overflow-hidden object-cover"
                              onClick={() => imageRef.current.click()}
                            />
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={() => {
                    handleAddPost();
                    setOpenUploadModal(false);
                  }}
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setOpenUploadModal(false)}
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
    </>
  );
};

export default Navbar;
