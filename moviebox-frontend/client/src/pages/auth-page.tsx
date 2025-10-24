import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { getQueryFn } from '@/lib/queryClient';

const AuthPage = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [, navigate] = useLocation();
  
  // Directly fetch user data without relying on the context
  const { data: user, isLoading } = useQuery<Omit<User, "password"> | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Redirect to home if user is already logged in
  useEffect(() => {
    if (!isLoading && user && !isRedirecting) {
      setIsRedirecting(true);
      navigate("/");
    }
  }, [user, isLoading, navigate, isRedirecting]);
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="flex w-full max-w-6xl rounded-lg overflow-hidden shadow-xl">
        {/* Left side - Auth forms */}
        <div className="w-full md:w-1/2 p-8 bg-card">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Welcome to MovieBox</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your ultimate streaming destination for movies and TV shows
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-border absolute w-full"></div>
              <span className="bg-card px-4 text-muted-foreground text-sm relative">or continue with</span>
            </div>
            
            <div className="space-y-3">
              <button className="w-full py-3 bg-accent hover:bg-accent/80 text-accent-foreground rounded-lg font-medium transition-colors flex items-center justify-center">
                <span className="mr-2">G</span> Google
              </button>
              <button className="w-full py-3 bg-accent hover:bg-accent/80 text-accent-foreground rounded-lg font-medium transition-colors flex items-center justify-center">
                <span className="mr-2">f</span> Facebook
              </button>
            </div>
          </div>
        </div>
        
        {/* Right side - Hero section */}
        <div className="hidden md:block md:w-1/2 bg-primary relative">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative p-12 flex flex-col h-full justify-center">
            <h2 className="text-4xl font-bold text-white mb-4">Endless Entertainment</h2>
            <p className="text-white/90 mb-6">
              Stream thousands of movies and TV shows, all in one place. 
              Discover new favorites and revisit classics on any device, anytime.
            </p>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-center">
                <span className="mr-2">✓</span> Watch on any device
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Cancel anytime
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> New content added weekly
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Create personalized watchlists
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
