import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, User, Settings, List, LogOut } from "lucide-react";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div ref={menuRef} className="relative">
      <button 
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar || ''} alt={user.username} />
          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
        </Avatar>
        <ChevronDown className="h-4 w-4 text-foreground/70 hidden md:block" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-xl p-2 transform origin-top-right transition-all z-50">
          <Link href="/profile">
            <a className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded transition-colors">
              <User className="mr-3 h-4 w-4" /> Profile
            </a>
          </Link>
          <Link href="/profile/settings">
            <a className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded transition-colors">
              <Settings className="mr-3 h-4 w-4" /> Settings
            </a>
          </Link>
          <Link href="/watchlist">
            <a className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded transition-colors">
              <List className="mr-3 h-4 w-4" /> Watchlist
            </a>
          </Link>
          <div className="my-1 border-t border-border"></div>
          <Button 
            variant="ghost" 
            className="flex items-center w-full px-4 py-2 text-sm justify-start text-primary hover:bg-muted rounded transition-colors"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-3 h-4 w-4" /> Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}
