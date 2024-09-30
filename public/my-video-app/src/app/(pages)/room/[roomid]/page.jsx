
"use client";
import Room from '../../../../components/Room';

const RoomPage = ({ params }) => {
  const { roomid } = params; 

  return <Room roomid={roomid} />;
};

export default RoomPage;
