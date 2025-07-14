'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Moderation Interface</h1>
      <Link
        href="/moderation"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Moderation Page
      </Link>
    </main>
  );
}
