import { Compass, Github } from 'lucide-react';
import { NextPage } from 'next';
import Link from 'next/link';


const Footer: NextPage = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <Compass className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">TourGuide</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Create beautiful, interactive onboarding tours for your web applications. 
              Engage users from day one.
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="https://github.com/codabytez/ZenGuide.git" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </Link>
             
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
              <li><Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground">Live Demo</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ZenGuide. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
