import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { IoMdSend } from "react-icons/io";
import { BsArrowUpSquareFill } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const socket = io.connect("http://localhost:8800");
const Chats = () => {
  const { currentUser } = useSelector((state) => state.user);

  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      toast.success("Room joined");
    } else {
      toast.error("Enter something");
    }
  };

  const [username, setUsername] = useState("");
  const sendMessage = () => {
    socket.emit("send_message", {
      message,
      room,
      name: currentUser?.details?.username,
    });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
      setUsername(data.name);
    });
  }, [socket]);

  return (
    <div className="flex flex-col min-h-[86vh] overflow-hidden text-gray-800 p-10">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-[#123456]  shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gray-300 p-4 flex justify-center items-center">
          <input
            className="flex items-center h-10 w-full rounded px-3 text-sm outline-none"
            type="text"
            placeholder="Room Id…"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
            onKeyPress={(e) => {
              e.key === "Enter" && joinRoom();
            }}
          />
          <div
            onClick={joinRoom}
            className="flex items-center justify-center bg-green-400 border px-3 py-2 rounded hover:bg-green-500 cursor-pointer"
          >
            <span>Join</span>
            <BsArrowUpSquareFill size={20} className="text-gray-900 ml-2  " />
          </div>
        </div>
        <div className="flex flex-col justify-evenly flex-grow h-0 p-4 overflow-auto">
          {messageReceived && (
            <div className="flex w-full space-x-3 max-w-xs">
              <div className="flex-shrink-0 h-10 w-10 max-w-[4rem] text-gray-400 font-semibold ">
                {username}
              </div>
              <div>
                <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                  <p className="text-sm text-black">{messageReceived}</p>
                </div>
                <span className="text-xs text-gray-500 leading-none">
                  2 min ago
                </span>
              </div>
            </div>
          )}
          {message && (
            <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
              <div>
                <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                  <p className="text-sm">{message}</p>
                </div>
                <span className="text-xs text-gray-500 leading-none">
                  2 min ago
                </span>
              </div>
              <div className="flex-shrink-0 h-10 w-fit text-gray-400 font-semibold ">
                You
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-300 p-4 flex justify-center items-center">
          <input
            className="flex items-center h-10 w-full rounded px-3 text-sm outline-none"
            type="text"
            placeholder="Type your message…"
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              e.key === "Enter" && sendMessage();
            }}
          />
          <div
            onClick={sendMessage}
            className="flex items-center justify-center bg-green-400 border px-3 py-2 rounded hover:bg-green-500 cursor-pointer"
          >
            <span>Send</span>
            <IoMdSend size={20} className="text-gray-900 ml-2  " />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Chats;
