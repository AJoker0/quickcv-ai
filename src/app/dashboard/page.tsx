"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    redirect("/"); // If not logged in, redirect to home
  }

  return (
    <div className="main-content min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
      <Image
        src={session.user?.image || "/default-avatar.png"}
        alt="Profile Picture"
        width={120}
        height={120}
        className="rounded-full mb-4"
      />
      <h1 className="text-3xl font-semibold mb-2 text-gray-900 mb-2">👤 {session.user?.name}</h1>
      <p className="text-gray-600 mb-6">{session.user?.email}</p>
    <div className="button-group flex gap-4">
      <Link href="/resume/new">
        <button className="button button-secondary">
          Create Résumé
        </button>
      </Link>
      </div>
    </div>
  );
}
