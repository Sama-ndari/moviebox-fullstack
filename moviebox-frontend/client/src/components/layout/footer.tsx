import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-foreground/80 font-medium text-sm mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-foreground/80 font-medium text-sm mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms of Use</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-foreground/80 font-medium text-sm mb-4">Get the App</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">iOS</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Android</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Smart TV</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-foreground/80 font-medium text-sm mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-6">
              <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Globe className="h-4 w-4" />
                <span>English</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-primary font-bold text-xl">Nexify</span>
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Nexify. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
