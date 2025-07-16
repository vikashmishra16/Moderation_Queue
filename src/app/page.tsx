'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Moderation Interface</h1>
        <p className="mb-6 text-gray-700">
          Built with ❤️ by <strong>Vikash Mishra</strong>
        </p>
        <Link
          href="/moderation"
          className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md"
        >
          Go to Moderation Page
        </Link>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </main>
  );
}
