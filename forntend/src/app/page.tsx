import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">Welcome to Our App</h1>
      <div className="space-x-4">
        <Link href="/signin" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Sign In
        </Link>
        <Link href="/signup" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
