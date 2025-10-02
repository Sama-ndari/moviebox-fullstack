import { Link, useLocation } from 'wouter';
import { Home, Compass, Search, List, User } from 'lucide-react';

const MobileNavigation = () => {
  const [location] = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-background/90 backdrop-blur-md border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        
        <Link href="/browse">
          <div className={`flex flex-col items-center justify-center ${location === '/browse' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Compass className="h-5 w-5" />
            <span className="text-xs mt-1">Explore</span>
          </div>
        </Link>
        
        <Link href="/search">
          <div className={`flex flex-col items-center justify-center ${location.includes('/search') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </div>
        </Link>
        
        <Link href="/watchlist">
          <div className={`flex flex-col items-center justify-center ${location === '/watchlist' ? 'text-primary' : 'text-muted-foreground'}`}>
            <List className="h-5 w-5" />
            <span className="text-xs mt-1">My List</span>
          </div>
        </Link>
        
        <Link href="/profile">
          <div className={`flex flex-col items-center justify-center ${location === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Account</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
