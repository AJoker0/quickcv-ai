"use client";
import React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-900">🚀 QuickCV</h1>
        <p className="text-lg text-gray-600">
          {session ? `Welcome, ${session.user?.name}!` : "Not signed in"}
        </p>

        {session ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => signOut()}
              className="bg-black text-white text-lg px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
            >
              Sign Out
            </button>
            <Link href="/dashboard">
              <button className="bg-gray-700 text-white text-lg px-6 py-3 rounded-lg shadow hover:bg-gray-600 transition">
                Go to Dashboard
              </button>
            </Link>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-black text-white text-lg px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
          >
            Sign In with GitHub / Google
          </button>
        )}
      </div>
    </main>
  );
}
