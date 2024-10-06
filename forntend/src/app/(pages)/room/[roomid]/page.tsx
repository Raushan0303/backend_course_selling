"use client";
import { useState, useEffect } from 'react';
import Room from '@/components/Room';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  name: string;
  role: string;
}

const RoomPage = ({ params }: { params: { roomid: string } }) => {
  const { roomid } = params;
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    } else {
      fetchUserData(token);
    }
  }, [router]);

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/user', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      router.push('/signin');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return <Room roomId={roomid} username={user.name} />;
};

export default RoomPage;
