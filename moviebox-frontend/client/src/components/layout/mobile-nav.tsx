import { Link, useLocation } from "wouter";
import { Home, Compass, Search, List, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-background/90 backdrop-blur-md border-t border-border/10 z-50">
      <div className="flex items-center justify-around h-16">
        <Link href="/">
          <a className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-primary' : 'text-foreground/60'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/browse">
          <a className={`flex flex-col items-center justify-center ${isActive('/browse') ? 'text-primary' : 'text-foreground/60'}`}>
            <Compass className="h-5 w-5" />
            <span className="text-xs mt-1">Explore</span>
          </a>
        </Link>
        
        <Link href="/search">
          <a className={`flex flex-col items-center justify-center ${isActive('/search') ? 'text-primary' : 'text-foreground/60'}`}>
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </a>
        </Link>
        
        <Link href="/watchlist">
          <a className={`flex flex-col items-center justify-center ${isActive('/watchlist') ? 'text-primary' : 'text-foreground/60'}`}>
            <List className="h-5 w-5" />
            <span className="text-xs mt-1">My List</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`flex flex-col items-center justify-center ${isActive('/profile') ? 'text-primary' : 'text-foreground/60'}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Account</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
