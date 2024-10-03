'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

interface User {
  name: string;
  role: string;
  // Add other user properties as needed
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else {
      fetchUserData(token);
    }
  }, [router]);

  const fetchUserData = async (token: string) => {
    try {
      console.log('Fetching user data with token:', token);
      const response = await axios.get('http://localhost:8080/api/v1/user', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('User data received:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (axios.isAxiosError(error)) {
        console.log('Response status:', error.response?.status);
        console.log('Response data:', error.response?.data);
      }
      localStorage.removeItem('token');
      router.push('/signin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  if (!user) return <div className="text-gray-800 dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar userName={user.name} userRole={user.role} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Welcome to the Dashboard</h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">Hello, {user.name || 'User'}!</p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">Your role: {user.role}</p>
        </div>
      </main>
    </div>
  );
}