'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

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

interface CourseData {
  title: string;
  description: string;
  price: string;
  sections: Section[];
}

export default function CreateCourse() {
  const [user, setUser] = useState<User | null>(null);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    price: '',
    sections: [{ sectionTitle: '', content: [] }],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      const response = await axios.get('http://localhost:8080/api/v1/user', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUser(response.data);
      if (response.data.role !== 'Admin') {
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
    setCourseData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSectionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedSections = courseData.sections.map((section, i) => {
      if (i === index) {
        return { ...section, [name]: value };
      }
      return section;
    });
    setCourseData(prevData => ({ ...prevData, sections: updatedSections }));
  };

  const handleContentChange = (sectionIndex: number, contentIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedSections = courseData.sections.map((section, i) => {
      if (i === sectionIndex) {
        const updatedContent = section.content.map((content, j) => {
          if (j === contentIndex) {
            return { 
              ...content, 
              [name]: name === 'duration' ? parseInt(value) : value 
            };
          }
          return content;
        });
        return { ...section, content: updatedContent };
      }
      return section;
    });
    setCourseData(prevData => ({ ...prevData, sections: updatedSections }));
  };

  const addSection = () => {
    setCourseData(prevData => ({
      ...prevData,
      sections: [...prevData.sections, { sectionTitle: '', content: [] }]
    }));
  };

  const addContent = (sectionIndex: number) => {
    const updatedSections = courseData.sections.map((section, i) => {
      if (i === sectionIndex) {
        return {
          ...section,
          content: [...section.content, { contentType: 'video', title: '', url: '', duration: 0 }]
        };
      }
      return section;
    });
    setCourseData((prevData: CourseData) => ({
      ...prevData,
      sections: updatedSections as Section[]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare the course data, ensuring all content details are included
      const preparedCourseData = {
        ...courseData,
        sections: courseData.sections.map(section => ({
          ...section,
          content: section.content.map(content => ({
            contentType: content.contentType,
            title: content.title,
            url: content.url,
            ...(content.contentType === 'video' && { duration: content.duration }),
            ...(content.contentType === 'document' && { fileType: content.fileType }),
          })),
        })),
      };

      console.log('Course data being sent:', JSON.stringify(preparedCourseData, null, 2));

      const response = await axios.post('http://localhost:8080/api/v1/course-create', 
        preparedCourseData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response from server:', response.data);
      
      setSuccess('Course created successfully!');
      setCourseData({ title: '', description: '', price: '', sections: [{ sectionTitle: '', content: [] }] });
      setTimeout(() => router.push('/courses'), 2000);
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course. Please try again.');
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
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Create Course</h1>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
                id="title"
                type="text"
                placeholder="Course Title"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
                id="description"
                placeholder="Course Description"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="price">
                Price
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
                id="price"
                type="text"
                placeholder="Course Price"
                name="price"
                value={courseData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Sections</h2>
              {courseData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4 p-4 border border-gray-300 rounded">
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mb-2"
                    type="text"
                    placeholder="Section Title"
                    name="sectionTitle"
                    value={section.sectionTitle}
                    onChange={(e) => handleSectionChange(sectionIndex, e)}
                    required
                  />
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Content</h3>
                  {section.content.map((content, contentIndex) => (
                    <div key={contentIndex} className="mb-2 p-2 border border-gray-200 rounded">
                      <select
                        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mb-2"
                        name="contentType"
                        value={content.contentType}
                        onChange={(e) => handleContentChange(sectionIndex, contentIndex, e)}
                        required
                      >
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                      </select>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mb-2"
                        type="text"
                        placeholder="Content Title"
                        name="title"
                        value={content.title}
                        onChange={(e) => handleContentChange(sectionIndex, contentIndex, e)}
                        required
                      />
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mb-2"
                        type="text"
                        placeholder="Content URL"
                        name="url"
                        value={content.url}
                        onChange={(e) => handleContentChange(sectionIndex, contentIndex, e)}
                        required
                      />
                      {content.contentType === 'video' && (
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mb-2"
                          type="number"
                          placeholder="Duration (in seconds)"
                          name="duration"
                          value={content.duration || ''}
                          onChange={(e) => handleContentChange(sectionIndex, contentIndex, e)}
                          required
                        />
                      )}
                      {content.contentType === 'document' && (
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mb-2"
                          type="text"
                          placeholder="File Type (e.g., pdf, docx)"
                          name="fileType"
                          value={content.fileType || ''}
                          onChange={(e) => handleContentChange(sectionIndex, contentIndex, e)}
                          required
                        />
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addContent(sectionIndex)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Add Content
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSection}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Add Section
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Create Course
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}