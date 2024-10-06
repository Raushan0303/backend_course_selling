"use client"

import React, { useEffect, useState, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import Peer from "peerjs";
import { motion } from "framer-motion";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const PEER_SERVER_HOST = process.env.NEXT_PUBLIC_PEER_HOST || "localhost";
const PEER_SERVER_PORT = parseInt(process.env.NEXT_PUBLIC_PEER_PORT || "3002");

interface RoomProps {
  roomId: string;
  username: string;
}

interface Message {
  user: string;
  content: string;
}

interface Peers {
  [key: string]: import("peerjs").MediaConnection;
}

export default function Room({ roomId, username }: RoomProps) {
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Peers>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const videoGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initializeRoom = async () => {
      try {
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
          console.log("My peer ID is: ", id);
          socketRef.current?.emit("join-room", roomId, id, username);
        });

        peerRef.current.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userVideoStream) => {
            addVideoStream(call.peer, userVideoStream);
          });
        });

        socketRef.current.on("user-connected", (userId: string) => {
          connectToNewUser(userId, stream);
        });

        socketRef.current.on("user-disconnected", (userId: string) => {
          if (peers[userId]) peers[userId].close();
          removeVideoStream(userId);
        });

        socketRef.current.on("create-message", (message: Message) => {
          console.log("Received message:", message);
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
  }, [roomId, username]);

  const addVideoStream = useCallback((userId: string, stream: MediaStream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.id = `video-${userId}`;
    video.addEventListener("loadedmetadata", () => video.play());
    videoGridRef.current?.appendChild(video);
  }, []);

  const removeVideoStream = useCallback((userId: string) => {
    const video = document.getElementById(`video-${userId}`);
    if (video) video.remove();
  }, []);

  const connectToNewUser = useCallback((userId: string, stream: MediaStream) => {
    if (!peerRef.current) return;
    const call = peerRef.current.call(userId, stream);
    call.on("stream", (userVideoStream) => {
      addVideoStream(userId, userVideoStream);
    });
    call.on("close", () => removeVideoStream(userId));
    setPeers((prevPeers) => ({ ...prevPeers, [userId]: call }));
  }, [addVideoStream, removeVideoStream]);

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

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const messageData = { user: username, content: inputMessage };
      socketRef.current?.emit("send-message", roomId, messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage('');
    }
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert("Meeting link copied to clipboard!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900"
    >
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Room: {roomId}</h1>
      </header>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 p-4 overflow-y-auto" 
          ref={videoGridRef}
        >
          {/* Video streams will be added here */}
        </motion.div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 shadow-md overflow-hidden flex flex-col"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Chat</h2>
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {messages.map((msg, index) => (
              <motion.div 
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-2 rounded bg-gray-100 dark:bg-gray-700"
              >
                <span className="font-bold text-gray-800 dark:text-white">{msg.user}: </span>
                <span className="text-gray-700 dark:text-gray-300">{msg.content}</span>
              </motion.div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-2 py-1 border rounded-l focus:outline-none dark:bg-gray-700 dark:text-white"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-300"
            >
              Send
            </button>
          </form>
        </motion.div>
      </div>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 bg-white dark:bg-gray-800 shadow-md"
      >
        <button onClick={toggleAudio} className={`px-4 py-2 rounded ${isMuted ? 'bg-red-500' : 'bg-blue-500'} text-white mr-2 transition duration-300`}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button onClick={toggleVideo} className={`px-4 py-2 rounded ${isVideoOff ? 'bg-red-500' : 'bg-blue-500'} text-white mr-2 transition duration-300`}>
          {isVideoOff ? 'Start Video' : 'Stop Video'}
        </button>
        <button onClick={copyMeetingLink} className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition duration-300">
          Copy Meeting Link
        </button>
      </motion.div>
    </motion.div>
  );
}