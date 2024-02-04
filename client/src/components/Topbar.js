import React from "react";
import { Link } from "react-router-dom";
import { FiChevronsDown } from "react-icons/fi";
import { BiChat } from "react-icons/bi";

const Topbar = () => {
  const toTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full bg-[#081420] px-2 py-2 z-50 sticky top-0 ">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center">
          <h1 className="font-serif text-2xl" onClick={toTop}>
            <Link to="/">Snapshot</Link>
          </h1>
          <FiChevronsDown className="ml-2" fill="white" />
        </div>
        <Link to="/chats">
          <div className="flex gap-4 items-start">
            <BiChat size={25} color="white" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
