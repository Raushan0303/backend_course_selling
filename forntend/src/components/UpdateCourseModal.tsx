import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: string;
  sections: Section[];
}

interface Section {
  sectionTitle: string;
  content: Content[];
}

interface Content {
  contentType: 'video' | 'document';
  title: string;
  url: string;
  duration?: number;
  fileType?: string;
}

interface UpdateCourseModalProps {
  course: Course;
  onClose: () => void;
  onSubmit: (updatedCourse: Partial<Course>) => void;
}

const UpdateCourseModal: React.FC<UpdateCourseModalProps> = ({ course, onClose, onSubmit }) => {
  const [updatedCourse, setUpdatedCourse] = useState<Partial<Course>>({
    title: course.title,
    description: course.description,
    price: course.price,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(updatedCourse);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Update Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
              id="title"
              type="text"
              name="title"
              value={updatedCourse.title}
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
              name="description"
              value={updatedCourse.description}
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
              name="price"
              value={updatedCourse.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update Course
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateCourseModal;