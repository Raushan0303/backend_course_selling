'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';

interface User {
  name: string;
  role: string;
}

interface Content {
  contentType: 'video' | 'document';
  title: string;
  url: string;
  duration?: number;
  fileType?: string;
}

interface Section {
  sectionTitle: string;
  content: Content[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: string;
  sections: Section[];
}

interface CourseProgress {
  [contentId: string]: boolean;
}

export default function CourseDetails({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState<CourseProgress>({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    } else {
      fetchUserData(token);
      fetchCourseDetails(token, params.id);
      fetchProgress(token, params.id);
    }
  }, [router, params.id]);

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

  const fetchCourseDetails = async (token: string, courseId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/course/${courseId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCourse(response.data.data);
      // Set the first video as the selected video
      const firstVideo = response.data.data.sections.flatMap((section: Section) => 
        section.content.filter((content: Content) => content.contentType === 'video')
      )[0];
      if (firstVideo) {
        setSelectedVideo(firstVideo.url);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to fetch course details. Please try again later.');
    }
  };

  const fetchProgress = async (token: string, courseId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/progress/${courseId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProgress(response.data.progress || {});
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const saveProgress = async (courseId: string, contentId: string, completed: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/v1/progress', 
        { courseId, contentId, completed },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const markAsCompleted = async (contentId: string) => {
    const updatedProgress = { ...progress, [contentId]: true };
    setProgress(updatedProgress);
    await saveProgress(params.id, contentId, true);
  };

  const calculateProgress = () => {
    if (!course) return 0;
    const totalContent = course.sections.flatMap(section => section.content).length;
    const completedContent = Object.values(progress).filter(Boolean).length;
    return (completedContent / totalContent) * 100;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  if (!user || !course) return <div className="text-gray-800 dark:text-white flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar userName={user.name} userRole={user.role} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-6 sm:px-0"
        >
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{course.title}</h1>
          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">{course.description}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Price: {course.price}</p>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Course Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {calculateProgress().toFixed(0)}% Complete
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Video Player */}
              <div className="md:w-2/3">
                {selectedVideo && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <ReactPlayer 
                      url={selectedVideo} 
                      controls 
                      width="100%" 
                      height="400px" 
                      onEnded={() => {
                        const currentContent = course.sections
                          .flatMap(section => section.content)
                          .find(content => content.url === selectedVideo);
                        if (currentContent) {
                          markAsCompleted(currentContent.title);
                        }
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Course Content */}
              <div className="md:w-1/3 overflow-y-auto max-h-[600px]">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Course Content</h2>
                {course.sections && course.sections.length > 0 ? (
                  course.sections.map((section, index) => (
                    <motion.div 
                      key={index} 
                      className="mb-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{section.sectionTitle}</h3>
                      {section.content && section.content.length > 0 ? (
                        <ul className="space-y-2">
                          {section.content.map((content, contentIndex) => (
                            <motion.li 
                              key={contentIndex} 
                              className={`p-2 rounded-md ${
                                content.contentType === 'video'
                                  ? 'cursor-pointer bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800'
                                  : 'bg-gray-50 dark:bg-gray-700'
                              } ${progress[content.title] ? 'border-l-4 border-green-500' : ''}`}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => content.contentType === 'video' && setSelectedVideo(content.url)}
                            >
                              <div className="flex items-center">
                                <span className="mr-2 text-lg">
                                  {content.contentType === 'video' ? '🎥' : '📄'}
                                </span>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {content.title}
                                    {progress[content.title] && (
                                      <span className="ml-2 text-green-500">✓</span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {content.contentType === 'video' && content.duration && 
                                      `Duration: ${Math.floor(content.duration / 60)}:${(content.duration % 60).toString().padStart(2, '0')}`
                                    }
                                    {content.contentType === 'document' && content.fileType && 
                                      `File type: ${content.fileType}`
                                    }
                                  </p>
                                </div>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No content available for this section.</p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No sections available for this course.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}