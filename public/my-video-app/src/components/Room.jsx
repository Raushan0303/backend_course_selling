"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "peerjs";

let socket;

export default function Room({ roomid }) {
  const videoGridRef = useRef();
  const [myName, setMyName] = useState("");
  const [peer, setPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  
  };

  const toggleVideo = () => {
    setIsVideoStopped((prev) => !prev);
    
  };

  useEffect(() => {
    if (!roomid) return;

    const username = prompt("Enter your name");
    setMyName(username || "Guest");

    socket = io("http://localhost:3000");

    const myPeer = new Peer(undefined, {
      host: "localhost",
      port: "3002",
      path: "/peerjs",
    });

    setPeer(myPeer);

    myPeer.on("open", (id) => {
      socket.emit("join-room", roomid, id, username);
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const videoElement = document.createElement("video");
        videoElement.muted = true;
        addVideoStream(videoElement, stream);

        myPeer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId, name) => {
          connectToNewUser(userId, stream);
        });
      });

    socket.on("user-disconnected", (userId) => {
      removeVideoStream(userId);
    });

    return () => {
      socket.disconnect();
      myPeer.destroy();
    };
  }, [roomid]);

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGridRef.current.append(video);
  };

  const removeVideoStream = (userId) => {
    const videoElement = document.getElementById(userId);
    if (videoElement) {
      videoElement.remove();
    }
  };

  const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    video.id = userId; 
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };

  const sendMessage = (message) => {
    socket.emit("messagesend", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    socket.on("createMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  return (
    <div className="flex justify-center items-stretch h-screen bg-gray-100">
      <div className="flex w-11/12 border rounded-lg overflow-hidden shadow-lg">
        {/* Video Section */}
        <div className="flex flex-col w-3/4 p-4 bg-white">
          <div className="flex-1 flex justify-center items-center border border-gray-300 rounded-lg mb-2 bg-gray-200" ref={videoGridRef}>
            <h2 className="text-gray-500">Video Area</h2>
          </div>
          <div className="flex justify-around mb-2">
            <button
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200 ${isMuted ? 'bg-red-500' : ''}`}
              onClick={toggleMute}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200 ${isVideoStopped ? 'bg-red-500' : ''}`}
              onClick={toggleVideo}
            >
              {isVideoStopped ? 'Start Video' : 'Stop Video'}
            </button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">Chat</button>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex flex-col w-1/4 border-l border-gray-300 bg-white">
          <div className="p-2 border-b bg-gray-200">
            <h6 className="font-semibold">Chat Area</h6>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {messages.map((message, index) => (
                <li key={index} className="bg-indigo-200 p-2 rounded">
                  {message}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-2">
            <input
              type="text"
              placeholder="Type message here..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  sendMessage(e.target.value.trim());
                  e.target.value = "";
                }
              }}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
