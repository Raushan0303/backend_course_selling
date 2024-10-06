'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const MotionComponent = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false,
});

const features = [
  {
    title: "Custom Subdomain",
    description: "Get your own branded space (e.g., yourname.ourplatform.com) to showcase and sell your courses.",
    icon: "🌐"
  },
  {
    title: "Seamless Course Creation",
    description: "Easily upload videos, PDFs, quizzes, and more to create rich, engaging courses.",
    icon: "📚"
  },
  {
    title: "AI-Powered Student Support",
    description: "Integrated chatbots help your students with real-time assistance, while you're free to focus on teaching.",
    icon: "🤖"
  },
  {
    title: "Smart Notes and Reviews",
    description: "Your students can save important notes and search them globally, enhancing their learning experience.",
    icon: "📝"
  },
  {
    title: "Community Engagement",
    description: "Build a thriving community with discussion boards and live sessions, directly from your platform.",
    icon: "💬"
  },
  {
    title: "Analytics Dashboard",
    description: "Track your course performance with detailed insights and optimize your content for better results.",
    icon: "📊"
  },
  {
    title: "Flexible Monetization",
    description: "Set your course prices, offer discounts, and manage payments effortlessly.",
    icon: "💰"
  },
  {
    title: "Scalable Solution",
    description: "Whether you're just starting or have a large audience, our platform grows with you!",
    icon: "🚀"
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Our SaaS Course Platform EduMerge!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Create, manage, and sell your courses with ease on our all-in-one platform built specifically for instructors like you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Sign up today and experience the easiest way to launch and grow your teaching business!
          </p>
          <div className="space-x-4">
            <Link href="/signin" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300">
              Sign In
            </Link>
            <Link href="/signup" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300">
              Sign Up
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        
      </div>
    </div>
  );
}
