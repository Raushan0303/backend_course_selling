"use client";
import { useState, FormEvent, useEffect } from "react";
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

interface MeetingResponse {
    redirectUrl: string;
}

interface User {
    name: string;
    role: string;
}

export default function MeetingPage() {
    const [name, setName] = useState<string>("");
    const [roomId, setRoomId] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");
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
            setName(response.data.name); // Pre-fill the name field
        } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('token');
            router.push('/signin');
        }
    };

    const startMeeting = async (): Promise<void> => {
        if (name.trim() === "") {
            setError("Please enter your name");
            return;
        }
        setError("");
    
        try {
            const token = localStorage.getItem('token');
            const response: AxiosResponse<MeetingResponse> = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/create-meeting/${encodeURIComponent(name)}`,
                {},
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = response.data;
            window.location.href = data.redirectUrl;
        } catch (error) {
            console.error('Error creating meeting:', error);
            setError('Error creating meeting. Please try again.');
        }
    };

    const joinRoom = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (name.trim() === "" || roomId.trim() === "") {
            setError("Please enter your name and room ID");
            return;
        }
        setError("");

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/join-room/${roomId}`, 
                { name },
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.success) {
                window.location.href = `/room/${roomId}`;
            } else {
                setError('Room not found');
            }
        } catch (error) {
            console.error('Error joining room:', error);
            setError('Error joining room. Please try again.');
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
            <main className="container mx-auto px-4 py-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
                >
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Meeting Room</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startMeeting}
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-4"
                    >
                        Start New Meeting
                    </motion.button>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
                        </div>
                    </div>
                    <form onSubmit={joinRoom} className="space-y-4">
                        <div>
                            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Room ID</label>
                            <input
                                type="text"
                                id="roomId"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
                        >
                            Join Existing Room
                        </motion.button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
