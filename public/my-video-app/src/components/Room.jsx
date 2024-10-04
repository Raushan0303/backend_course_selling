"use client"

import React, { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import Peer from "peerjs";

const SERVER_URL = "http://localhost:3000";
const PEER_SERVER_HOST = "localhost";
const PEER_SERVER_PORT = 3002;

export default function Room({ roomId }) {
  const [myStream, setMyStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [username, setUsername] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const socketRef = useRef();
  const peerRef = useRef();
  const videoGridRef = useRef();

  const addVideoStream = useCallback((userId, stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.id = `video-${userId}`;
    video.addEventListener("loadedmetadata", () => video.play());
    videoGridRef.current?.appendChild(video);
  }, []);

  const removeVideoStream = useCallback((userId) => {
    const video = document.getElementById(`video-${userId}`);
    if (video) video.remove();
  }, []);

  const connectToNewUser = useCallback((userId, stream) => {
    const call = peerRef.current.call(userId, stream);
    call.on("stream", (userVideoStream) => {
      addVideoStream(userId, userVideoStream);
    });
    call.on("close", () => removeVideoStream(userId));
    setPeers((prevPeers) => ({ ...prevPeers, [userId]: call }));
  }, [addVideoStream, removeVideoStream]);

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        const username = prompt("Enter your name") || "Guest";
        setUsername(username);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(stream);
        addVideoStream("me", stream);

        socketRef.current = io(SERVER_URL);
        peerRef.current = new Peer(undefined, {
          host: PEER_SERVER_HOST,
          port: PEER_SERVER_PORT,
          path: "/peerjs",
        });

        peerRef.current.on("open", (id) => {
          socketRef.current.emit("join-room", roomId, id, username);
        });

        peerRef.current.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userVideoStream) => {
            addVideoStream(call.peer, userVideoStream);
          });
        });

        socketRef.current.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });

        socketRef.current.on("user-disconnected", (userId) => {
          if (peers[userId]) peers[userId].close();
          removeVideoStream(userId);
        });

        socketRef.current.on("create-message", (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });

        setMeetingLink(`${window.location.origin}/room/${roomId}`);
      } catch (error) {
        console.error("Error setting up the room:", error);
      }
    };

    initializeRoom();

    return () => {
      myStream?.getTracks().forEach((track) => track.stop());
      socketRef.current?.disconnect();
      peerRef.current?.destroy();
    };
  }, [roomId, addVideoStream, removeVideoStream, connectToNewUser, peers]);

  const toggleAudio = () => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const sendMessage = (message) => {
    socketRef.current?.emit("send-message", roomId, { user: username, content: message });
    setMessages((prevMessages) => [...prevMessages, { user: "You", content: message }]);
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert("Meeting link copied to clipboard!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4" ref={videoGridRef}>
          {/* Video streams will be added here */}
        </div>
        <div className="p-4 bg-white shadow-md">
          <button onClick={toggleAudio} className={`px-4 py-2 rounded ${isMuted ? 'bg-red-500' : 'bg-blue-500'} text-white mr-2`}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={toggleVideo} className={`px-4 py-2 rounded ${isVideoOff ? 'bg-red-500' : 'bg-blue-500'} text-white mr-2`}>
            {isVideoOff ? 'Start Video' : 'Stop Video'}
          </button>
          <button onClick={copyMeetingLink} className="px-4 py-2 rounded bg-green-500 text-white">
            Copy Meeting Link
          </button>
        </div>
      </div>
      <div className="w-1/4 bg-white p-4 shadow-md">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{msg.user}: </span>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-2 py-1 border rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                sendMessage(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}