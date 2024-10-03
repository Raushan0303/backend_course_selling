'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

interface Course {
  id: string;
  title: string;
  description: string;
  // Add other course properties as needed
}

interface User {
  name: string;
  role: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<User | null>(null);
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
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
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
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Courses</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{course.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}