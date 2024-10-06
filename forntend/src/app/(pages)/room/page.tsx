import Room from './[roomid]/page';

export default function ParentComponent() {
  const params = { roomid: "example-room-id" }; // Replace with your logic to get the room ID

  return <Room params={params} />;
}
