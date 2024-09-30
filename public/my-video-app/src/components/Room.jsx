"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "peerjs";

let socket;

export default function Room({ roomid }) { 
  const videoGridRef = useRef();
  const [myName, setMyName] = useState("");
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    if (!roomid) return; 

   
    socket = io();
    const myPeer = new Peer(undefined, {
      host: "/",
      port: "3030",
    });

    setPeer(myPeer);

    myPeer.on("open", (id) => {
      socket.emit("join-room", roomid, id, myName);
    });

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then((stream) => {
      const videoElement = document.createElement("video");
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

  const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };

  return (
    <div className="room-container">
      <div className="mainclone">
        <div className="main_left">
          <div className="main_videos">
            <div id="video-grids" ref={videoGridRef}></div>
          </div>
          <div className="main_controls">
            <div className="main_controls_block">
              <div className="main_controls_button" id="mic">
                <i className="fas fa-microphone-slash"></i>
                <span>Mute</span>
              </div>

              <div className="main_controls_button" id="video">
                <i className="fas fa-video-slash"></i>
                <span>Stop Video</span>
              </div>
            </div>
            <div className="main_controls_block">
              <div className="main_controls_button">
                <i className="fas fa-user-plus"></i>
                <span>Invite</span>
              </div>
              <div className="main_controls_button">
                <i className="fas fa-user-friends"></i>
                <span>Participants</span>
              </div>
              <div className="main_controls_button">
                <i className="fas fa-comment-alt"></i>
                <span>Chat</span>
              </div>
            </div>
            <div className="main_controls_block">
              <div className="main_controls_button leave_red">
                <span className="leave_meeting">
                  <a href="/">Leave Meeting</a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="main_right" id="chat">
          <div className="main_right_header">
            <h6>Chat Area</h6>
          </div>
          <div className="main__chat_window">
            <ul className="messages"></ul>
          </div>
          <div className="main__message_container">
            <input type="text" placeholder="Type message here..." />
          </div>
        </div>
      </div>
    </div>
  );
}
