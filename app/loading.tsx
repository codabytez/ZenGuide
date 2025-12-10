'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Loading() {
  return (
    // 1. Full screen overlay with z-index to ensure it sits on top
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      
      {/* 2. The Animation Container */}
      <motion.div
        className="relative w-34 h-34" 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          filter: [
            'drop-shadow(0 0 0px rgba(10, 132, 255, 0))', 
            'drop-shadow(0 0 20px rgba(10, 132, 255, 0.3))', 
            'drop-shadow(0 0 0px rgba(10, 132, 255, 0))'
          ]
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          scale: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5
          },
          filter: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5
          }
        }}
      >
        <Image
          src="/images/image.png"
          alt="ZenGuide Loading"
          fill
          className="object-contain"
          priority 
        />
      </motion.div>
      
      {/* Optional: Screen reader only text for accessibility */}
      <span className="sr-only">Loading...</span>
    </div>
  );
}