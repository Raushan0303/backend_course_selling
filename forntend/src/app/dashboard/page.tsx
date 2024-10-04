'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

interface User {
  name: string;
  role: string;
  subdomain?: string;
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
      router.push('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  // Add this function to check if the user can create courses
  const canCreateCourse = (role: string) => ['Admin', 'Instructor'].includes(role);

  const handleCreateCourse = () => {
    if (canCreateCourse(user?.role || '')) {
      router.push('/create-course');
    } else {
      alert("You don't have permission to create a course.");
    }
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
              Welcome to <span className="text-blue-600">EduMerge</span>, {user.name}!
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
              {canCreateCourse(user.role) && (
                <button 
                  onClick={handleCreateCourse}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
                >
                  Create a Course
                </button>
              )}
              <Link href="/meeting" passHref>
                <button 
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 transform hover:scale-105"
                >
                  Create Meeting Room
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {(user.role === 'Admin' || user.role === 'Instructor') ? (
              <>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Manage Courses</h2>
                  <p className="text-gray-600 dark:text-gray-300">Create, edit, and manage your courses. Monitor their performance and engage with students.</p>
                  <ul className="mt-4 text-gray-600 dark:text-gray-300">
                    <li>• Create new courses</li>
                    <li>• Edit existing content</li>
                    <li>• View course analytics</li>
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Student Engagement</h2>
                  <p className="text-gray-600 dark:text-gray-300">Interact with your students, answer questions, and provide feedback.</p>
                  <ul className="mt-4 text-gray-600 dark:text-gray-300">
                    <li>• Respond to student queries</li>
                    <li>• Grade assignments</li>
                    <li>• Provide personalized feedback</li>
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Meeting Rooms</h2>
                  <p className="text-gray-600 dark:text-gray-300">Create and manage virtual meeting rooms for interactive sessions and webinars.</p>
                  <ul className="mt-4 text-gray-600 dark:text-gray-300">
                    <li>• Schedule live sessions</li>
                    <li>• Manage participants</li>
                    <li>• Share screens and resources</li>
                  </ul>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">My Courses</h2>
                  <p className="text-gray-600 dark:text-gray-300">Access your enrolled courses, track your progress, and continue learning.</p>
                  <ul className="mt-4 text-gray-600 dark:text-gray-300">
                    <li>• View enrolled courses</li>
                    <li>• Resume where you left off</li>
                    <li>• Track completion status</li>
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Learning Path</h2>
                  <p className="text-gray-600 dark:text-gray-300">Discover personalized course recommendations based on your interests and goals.</p>
                  <ul className="mt-4 text-gray-600 dark:text-gray-300">
                    <li>• Tailored course suggestions</li>
                    <li>• Skill development tracking</li>
                    <li>• Set and achieve learning goals</li>
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Community</h2>
                  <p className="text-gray-600 dark:text-gray-300">Connect with fellow learners, join study groups, and participate in discussions.</p>
                  <ul className="mt-4 text-gray-600 dark:text-gray-300">
                    <li>• Join course-specific forums</li>
                    <li>• Collaborate on projects</li>
                    <li>• Share resources and tips</li>
                  </ul>
                </motion.div>
              </>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Ready to start your journey?</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              {(user.role === 'Admin' || user.role === 'Instructor')
                ? 'Manage your courses, create meeting rooms, and help others learn!'
                : 'Explore courses and enhance your skills!'}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={() => router.push((user.role === 'Admin' || user.role === 'Instructor') ? '/create-course' : '/courses')}
                className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
              >
                {(user.role === 'Admin' || user.role === 'Instructor') ? 'Manage Courses' : 'Explore Courses'}
              </button>
            </motion.div>
          </motion.div>

          {user.role === 'Instructor' && user.subdomain && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 text-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Instructor Subdomain</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                Your custom subdomain: <strong>{user.subdomain}.edumerge.com</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Use this subdomain to showcase and sell your courses!
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}