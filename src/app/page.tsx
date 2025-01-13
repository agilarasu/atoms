"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to the Learning Platform</h1>
      <p className="mb-4">This is a platform where you can create learning plans and chat with others about them.</p>
      <Link href="/plans" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View Plans
        
      </Link>
      <Link href="/chat" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
          Chat
      </Link>
    </div>
  );
}