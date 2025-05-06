// src/components/SessionProviderWrapper.tsx
'use client';
import React from 'react'; // Add this line
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';



interface Props {
  children: ReactNode;
}

const SessionProviderWrapper = ({ children }: Props) => {
    return <SessionProvider>{children}</SessionProvider>;
  };

export default SessionProviderWrapper;
