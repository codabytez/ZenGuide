'use client'

import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Compass, Menu, X } from 'lucide-react';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';


const Navbar: NextPage = () => {
//   const { isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const pathname =  usePathname();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/docs', label: 'Documentation' },
    { path: '/demo', label: 'Demo' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group"> 
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
            <span className="font-display font-bold text-lg text-foreground">
              ZenGuide
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
               href={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : ( */}
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </>
            {/* )} */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-border/40"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-4 px-4">
                {/* {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">Dashboard</Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
                  </>
                ) : ( */}
                  <>
                    <Link href="/auth/login" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">Login</Button>
                    </Link>
                    <Link href="/auth/signup" className="flex-1">
                      <Button className="w-full" size="sm">Get Started</Button>
                    </Link>
                  </>
                {/* )} */}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
