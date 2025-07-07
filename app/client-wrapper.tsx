'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AuthGuard from '../components/AuthGuard';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted on client
  if (!isMounted) {
    return null;
  }

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/onboarding', '/forgot-password', '/reset-password'];
  const isPublicRoute = pathname ? (publicRoutes.includes(pathname) || 
                       pathname.startsWith('/api/') || 
                       pathname.startsWith('/_')) : false;

  // For public routes, render children directly without AuthGuard
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, wrap with AuthGuard
  return <AuthGuard>{children}</AuthGuard>;
} 