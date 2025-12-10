import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';


const Footer: NextPage = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="relative w-15 h-15 shrink-0">
                  <Image
                    src="/images/image.png"
                    alt="ZenGuide Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <span className="font-display font-bold text-foreground">ZenGuide</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Make dynamic, captivating onboarding experiences that turn visitors into power users. Coding is not necessary.
            </p>
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
