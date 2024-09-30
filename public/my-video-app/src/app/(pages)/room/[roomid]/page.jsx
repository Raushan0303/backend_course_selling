// app/room/[roomid]/page.js
"use client";
import Room from '../../../../components/Room';

const RoomPage = ({ params }) => {
  const { roomid } = params; // Access the roomid from params

  return <Room roomid={roomid} />;
};

export default RoomPage;
