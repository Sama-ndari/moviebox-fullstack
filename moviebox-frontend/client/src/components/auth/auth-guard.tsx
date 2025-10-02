import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { getQueryFn } from '@/lib/queryClient';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [, navigate] = useLocation();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Directly fetch user data without relying on the context
  const { data: user, isLoading } = useQuery<Omit<User, "password"> | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Check if user is logged in
  useEffect(() => {
    if (!isLoading) {
      setIsUserLoggedIn(!!user);
    }
  }, [user, isLoading]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user && !isRedirecting) {
      setIsRedirecting(true);
      navigate('/auth');
    }
  }, [user, isLoading, navigate, isRedirecting]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isUserLoggedIn) {
    return null; // Will redirect in the effect
  }

  return <>{children}</>;
};

export default AuthGuard;