'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';

interface User {
  name: string;
  role: string;
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
      const response = await axios.get('http://localhost:8080/api/v1/user', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      router.push('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (!user) return <div className="text-gray-800 dark:text-white flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar userName={user.name} userRole={user.role} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-gray-800 dark:text-white">
              Welcome to <span className="text-blue-600">EduMerge</span>
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Your all-in-one platform for learning, teaching, and community building
            </motion.p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center space-x-4"
            >
              <button 
                onClick={() => router.push('/courses')}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              >
                Explore Courses
              </button>
              <button 
                onClick={() => router.push('/create-course')}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
              >
                Create a Course
              </button>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Sell Your Courses</h2>
              <p className="text-gray-600 dark:text-gray-300">Create and sell your own courses. Share your expertise with the world and earn from your knowledge.</p>
              <ul className="mt-4 text-gray-600 dark:text-gray-300">
                <li>• Set your own prices</li>
                <li>• Reach a global audience</li>
                <li>• Get paid for your expertise</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Create Rooms</h2>
              <p className="text-gray-600 dark:text-gray-300">Host live sessions, workshops, or study groups. Interact with learners in real-time and enhance the learning experience.</p>
              <ul className="mt-4 text-gray-600 dark:text-gray-300">
                <li>• Live video conferencing</li>
                <li>• Interactive whiteboards</li>
                <li>• Real-time Q&A sessions</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Join Communities</h2>
              <p className="text-gray-600 dark:text-gray-300">Connect with like-minded individuals. Share ideas, collaborate on projects, and grow together in our vibrant communities.</p>
              <ul className="mt-4 text-gray-600 dark:text-gray-300">
                <li>• Topic-based forums</li>
                <li>• Peer-to-peer learning</li>
                <li>• Networking opportunities</li>
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Ready to start your journey?</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Join thousands of learners and educators on EduMerge today!</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={() => router.push('/courses')}
                className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
              >
                Get Started Now
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}