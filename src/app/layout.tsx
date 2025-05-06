
import React from 'react'; // Add this line
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import SessionProviderWrapper from './components/SessionProviderWrapper'; // ✅ Import using relative path
//import { SessionProviderWrapper } from './components/SessionProviderWrapper'; // Assuming you import the session provider wrapper correctly


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuickCV',
  description: 'Create a resume from GitHub & LinkedIn in seconds',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
