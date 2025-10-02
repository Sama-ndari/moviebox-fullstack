import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { MoonStar, Sun, User, LogOut, List, Search, Bell, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { notificationsAPI } from '@/api/notifications';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useTheme } from '@/lib/theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchForm from '@/components/ui/search-form';
import NexifyTextLogo from '@/components/ui/nexify-text-logo';

interface HeaderProps {
  transparent?: boolean;
  isConnected: boolean;
}

const Header = ({ transparent = false, isConnected }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  // Fetch unread notification count
  const { data: unreadCountResponse } = useQuery({
    queryKey: ['notifications-unread-count', user?._id],
    queryFn: () => notificationsAPI.getUnreadCount(user!._id),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  const unreadCount = unreadCountResponse?.data?.count || 0;
  
  // Update header style based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/');
  };
  
  // Determine header class based on scroll state and transparent prop
  const headerClass = transparent && !isScrolled
    ? 'bg-transparent'
    : isScrolled
      ? 'bg-background/90 backdrop-blur-md shadow-md'
      : 'bg-background';
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${headerClass}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <NexifyTextLogo />
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium text-sm ${location === '/' ? 'text-primary' : 'text-foreground/70 hover:text-primary'} transition-colors`}>
              Home
            </Link>
            <Link href="/browse" className={`font-medium text-sm ${location === '/browse' ? 'text-primary' : 'text-foreground/70 hover:text-primary'} transition-colors`}>
              Browse
            </Link>
            <Link href="/browse?type=movie" className={`font-medium text-sm ${location.includes('/browse?type=movie') ? 'text-primary' : 'text-foreground/70 hover:text-primary'} transition-colors`}>
              Movies
            </Link>
            <Link href="/browse?type=tvshow" className={`font-medium text-sm ${location.includes('/browse?type=tvshow') ? 'text-primary' : 'text-foreground/70 hover:text-primary'} transition-colors`}>
              TV Shows
            </Link>
            {user && (
              <Link href="/watchlist" className={`font-medium text-sm ${location === '/watchlist' ? 'text-primary' : 'text-foreground/70 hover:text-primary'} transition-colors`}>
                My List
              </Link>
            )}
          </nav>

          {/* Right Menu */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {/* Search */}
            <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="pt-12">
                <SearchForm onSearch={handleSearch} />
              </SheetContent>
            </Sheet>

            {/* Notifications */}
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-foreground/70 hover:text-foreground"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                  {theme === 'dark' ? (
                    <MoonStar className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <MoonStar className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/watchlist')}>
                    <List className="mr-2 h-4 w-4" /> Watchlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/watch-history')}>
                    <Clock className="mr-2 h-4 w-4" /> Watch History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/reviews')}>
                    <MessageSquare className="mr-2 h-4 w-4" /> My Reviews
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <List className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 py-4">
                  <div className="px-2">
                    <NexifyTextLogo />
                  </div>
                  <nav className="flex flex-col gap-4">
                    <Link href="/" className="px-2 py-2 hover:bg-accent rounded-md">
                      Home
                    </Link>
                    <Link href="/browse" className="px-2 py-2 hover:bg-accent rounded-md">
                      Browse
                    </Link>
                    <Link href="/browse?type=movie" className="px-2 py-2 hover:bg-accent rounded-md">
                      Movies
                    </Link>
                    <Link href="/browse?type=tvshow" className="px-2 py-2 hover:bg-accent rounded-md">
                      TV Shows
                    </Link>
                    {user && (
                      <>
                        <Link href="/watchlist" className="px-2 py-2 hover:bg-accent rounded-md">
                          My List
                        </Link>
                        <Link href="/watch-history" className="px-2 py-2 hover:bg-accent rounded-md">
                          Watch History
                        </Link>
                        <Link href="/notifications" className="px-2 py-2 hover:bg-accent rounded-md">
                          Notifications
                        </Link>
                        <Link href="/reviews" className="px-2 py-2 hover:bg-accent rounded-md">
                          My Reviews
                        </Link>
                        <Link href="/profile" className="px-2 py-2 hover:bg-accent rounded-md">
                          Profile
                        </Link>
                      </>
                    )}
                  </nav>
                  {!user && (
                    <div className="px-2 mt-2">
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => navigate('/auth')}
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
