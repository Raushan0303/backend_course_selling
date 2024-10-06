'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import TeamMemberCard from '../../components/TeamMemberCard';

interface User {
  name: string;
  role: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  html_url: string;
}

const githubUsernames = ["Raushan0303", "teamharsh" , "ThePlator", "TechMelon"];

export default function About() {
  const [user, setUser] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<GitHubUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    } else {
      fetchUserData(token);
      fetchTeamMembers();
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
      router.push('/signin');
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const members = await Promise.all(
        githubUsernames.map(async (username) => {
          const response = await axios.get(`https://api.github.com/users/${username}`);
          return response.data;
        })
      );
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
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
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">About Us</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Welcome to EduMerge! We are dedicated to providing high-quality educational content to help you achieve your learning goals. Our mission is to make learning accessible, engaging, and effective for everyone.
          </p>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.login} member={member} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}