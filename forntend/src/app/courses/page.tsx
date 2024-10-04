'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: string;
}

interface User {
  name: string;
  role: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    } else {
      fetchUserData(token);
      fetchCourses(token);
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
      router.push('/signin');
    }
  };

  const fetchCourses = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/courses', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected data format received from server');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  if (!user) return <div className="text-gray-800 dark:text-white flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar userName={user.name} userRole={user.role} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Courses</h1>
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}
          {courses.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No courses available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Link href={`/courses/${course._id}`} key={course._id}>
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{course.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Price: {course.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}