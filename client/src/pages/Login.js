import React, { useState } from "react";
import { MdLockOutline } from "react-icons/md";
import { FaRegEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(`/auth/login`, { email, password });
      navigate("/");
      dispatch(loginSuccess(res.data));
      // toast.success("Log in successfull!");
    } catch (error) {
      toast.error("Something went wrong!");
      dispatch(loginFailure());
      setError("Wrong credentials");
    }
  };

  return (
    <div className=" p-2 rounded-lg flex flex-col items-center justify-center gap-2 min-h-[85vh]">
      <div className="bg-[#081420] p-5 rounded-lg ">
        <h2 className="text-center text-xl mb-5">Snapshot Login</h2>
        <form className="flex flex-col max-w-2xl mx-auto mb-5" onSubmit={login}>
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

          <div className="flex flex-col">
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
            {error && (
              <p className="text-left text-sm text-red-500">*{error}</p>
            )}
          </div>

          <div className="relative p-0.5 inline-flex items-center justify-center font-semibold overflow-hidden group rounded-md mt-5">
            <span
              className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] 
            group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] 
            absolute"
            ></span>
            <button
              type="submit"
              className="relative px-24 py-1 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400"
            >
              <span className="relative text-white ">Login</span>
            </button>
          </div>
        </form>
        <Toaster />

        <div className="text-sm text-gray-200 text-center">
          <Link to="/signup">
            Don't have an account!
            <span className="text-white font-semibold"> Signup</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
