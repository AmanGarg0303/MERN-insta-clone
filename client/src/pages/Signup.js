import React, { useState } from "react";
import { MdLockOutline } from "react-icons/md";
import { FaRegEnvelope } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signupUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/auth/register`, {
        username,
        email,
        password,
      });
      console.log(res.data);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" p-2 rounded-lg flex flex-col items-center justify-center gap-2 min-h-[85vh]">
      <div className="bg-[#081420] p-5 rounded-lg ">
        <h2 className="text-center text-xl mb-5">Snapshot Register</h2>
        <form
          className="flex flex-col max-w-2xl mx-auto mb-5"
          onSubmit={signupUser}
        >
          <div className="bg-gray-100 flex flex-row justify-center items-center my-2 py-1.5 px-2 rounded">
            <BsFillPersonFill className="text-gray-400 text-xl" />
            <input
              className=" bg-gray-100 py-2 px-3 w-full outline-none text-black"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="bg-gray-100 flex flex-row justify-center items-center my-2 py-1.5 px-2 rounded">
            <FaRegEnvelope className="text-gray-400 text-xl" />
            <input
              className=" bg-gray-100 py-2 px-3 w-full outline-none text-black"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="bg-gray-100 flex flex-row justify-center items-center my-2 py-1.5 px-2 rounded">
            <MdLockOutline className="text-gray-400 text-xl" />
            <input
              className=" bg-gray-100 py-2 px-3 w-full outline-none text-black"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="relative p-0.5 inline-flex items-center justify-center font-semibold overflow-hidden group rounded-md mt-5"
          >
            <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
            <span className="relative px-24 py-1 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400">
              <span className="relative text-white ">Register</span>
            </span>
          </button>
        </form>

        <div className="text-sm text-gray-200 text-center">
          <Link to="/login">
            Already have an account!
            <span className="text-white font-semibold"> Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
