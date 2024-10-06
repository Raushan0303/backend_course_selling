'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
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
  title: string;
  description: string;
  price: string;
  sections: Section[];
}

export default function CreateCourse() {
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course>({
    title: '',
    description: '',
    price: '',
    sections: []
  });
  const [error, setError] = useState<string | null>(null);
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
      if (response.data.role !== 'Admin' && response.data.role !== 'Instructor') {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      router.push('/signin');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prevCourse => ({ ...prevCourse, [name]: value }));
  };

  const addSection = () => {
    setCourse(prevCourse => ({
      ...prevCourse,
      sections: [...prevCourse.sections, { sectionTitle: '', content: [] }]
    }));
  };

  const updateSection = (index: number, sectionTitle: string) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      sections: prevCourse.sections.map((section, i) => 
        i === index ? { ...section, sectionTitle } : section
      )
    }));
  };

  const addContent = (sectionIndex: number) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      sections: prevCourse.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, content: [...section.content, { contentType: 'video', title: '', url: '' }] }
          : section
      )
    }));
  };

  const updateContent = (sectionIndex: number, contentIndex: number, contentData: Partial<Content>) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      sections: prevCourse.sections.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              content: section.content.map((content, j) => 
                j === contentIndex ? { ...content, ...contentData } : content
              )
            }
          : section
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/v1/course-create', course, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      router.push('/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0px 0px 8px rgb(59, 130, 246)" },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar userName={user?.name || ''} userRole={user?.role || ''} onLogout={handleLogout} />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Create Course
        </motion.h1>
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          {error && <p className="text-red-500">{error}</p>}
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
            <motion.input
              type="text"
              id="title"
              name="title"
              value={course.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <motion.textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
            <motion.input
              type="text"
              id="price"
              name="price"
              value={course.price}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Sections</h2>
            {course.sections.map((section, sectionIndex) => (
              <motion.div 
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                className="mb-4 p-4 border border-gray-300 rounded dark:border-gray-600"
              >
                <motion.input
                  type="text"
                  value={section.sectionTitle}
                  onChange={(e) => updateSection(sectionIndex, e.target.value)}
                  placeholder="Section Title"
                  className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  whileFocus="focus"
                  variants={inputVariants}
                />
                {section.content.map((content, contentIndex) => (
                  <motion.div 
                    key={contentIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: contentIndex * 0.1 }}
                    className="ml-4 mb-2"
                  >
                    <select
                      value={content.contentType}
                      onChange={(e) => updateContent(sectionIndex, contentIndex, { contentType: e.target.value as 'video' | 'document' })}
                      className="mb-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                    <motion.input
                      type="text"
                      value={content.title}
                      onChange={(e) => updateContent(sectionIndex, contentIndex, { title: e.target.value })}
                      placeholder="Content Title"
                      className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      whileFocus="focus"
                      variants={inputVariants}
                    />
                    <motion.input
                      type="text"
                      value={content.url}
                      onChange={(e) => updateContent(sectionIndex, contentIndex, { url: e.target.value })}
                      placeholder="Content URL"
                      className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      whileFocus="focus"
                      variants={inputVariants}
                    />
                    {content.contentType === 'video' && (
                      <motion.input
                        type="number"
                        value={content.duration || ''}
                        onChange={(e) => updateContent(sectionIndex, contentIndex, { duration: parseInt(e.target.value) })}
                        placeholder="Duration (in seconds)"
                        className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        whileFocus="focus"
                        variants={inputVariants}
                      />
                    )}
                    {content.contentType === 'document' && (
                      <motion.input
                        type="text"
                        value={content.fileType || ''}
                        onChange={(e) => updateContent(sectionIndex, contentIndex, { fileType: e.target.value })}
                        placeholder="File Type (e.g., pdf, docx)"
                        className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        whileFocus="focus"
                        variants={inputVariants}
                      />
                    )}
                  </motion.div>
                ))}
                <motion.button
                  type="button"
                  onClick={() => addContent(sectionIndex)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  Add Content
                </motion.button>
              </motion.div>
            ))}
            <motion.button
              type="button"
              onClick={addSection}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              Add Section
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              Create Course
            </motion.button>
          </motion.div>
        </motion.form>
      </main>
    </div>
  );
}