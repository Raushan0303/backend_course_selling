'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Verify() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams) {
      const emailParam = searchParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
      } else {
        router.push('/signup');
      }
    } else {
      router.push('/signup');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/v1/verify', { email, otp });
      if (response.data.success) {
        router.push('/signin');
      } else {
        setError(response.data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred during verification.');
      } else {
        console.error('Verification error:', error);
        setError('An error occurred during verification. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Verify Your Account</h2>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
            Enter OTP
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            id="otp"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            type="submit"
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  );
}