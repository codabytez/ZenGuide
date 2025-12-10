"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileQuestion, Home, Terminal } from "lucide-react";
import Link from "next/link";

// Standard stagger for the main container content
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
      delayChildren: 0.5, // Wait a bit for the fall animation to start
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// The animation for the falling "4"
const fallenDigitVariants = {
  initial: { y: 0, rotate: 0 },
  fallen: {
    y: 140, // How far down it falls (adjust based on font size)
    rotate: 24, // The angle it lands at
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10,
      mass: 2, // Makes it feel heavier
      delay: 0.8, // Delay before it falls
    },
  },
};

// The chromatic glitch effect (reused for both parts)
const glitchLayerVariants = (offset: number, color: string) => ({
  hidden: { x: 0, opacity: 0 },
  visible: {
    x: [0, offset, -offset, 0],
    opacity: [0.5, 0.8, 0.5],
    color: color,
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
      delay: Math.random() * 0.5,
    },
  },
});

// Helper component to avoid repeating the glitch layers
const GlitchText = ({ text }: { text: string }) => (
  <>
    {/* Red Layer */}
    <motion.span
      variants={glitchLayerVariants(4, "rgba(239, 68, 68, 0.5)")}
      className="absolute inset-0 mix-blend-screen blur-[1px]"
      aria-hidden="true"
    >
      {text}
    </motion.span>
    {/* Blue Layer */}
    <motion.span
      variants={glitchLayerVariants(-4, "rgba(59, 130, 246, 0.5)")}
      className="absolute inset-0 mix-blend-screen blur-[1px]"
      aria-hidden="true"
    >
      {text}
    </motion.span>
    {/* Main Layer */}
    <span className="relative z-10 bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
      {text}
    </span>
  </>
);

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-background relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      <div className="absolute inset-0 bg-radial-at-t from-primary/5 via-transparent to-background"></div>

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* THE SPLIT 404 HEADLINE
          We use a flex container to hold the stable part and the falling part side-by-side.
        */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex justify-center relative font-mono font-black text-9xl md:text-[12rem] leading-none mb-24 md:mb-16 select-none pointer-events-none"
        >
          {/* Part 1: The stable "40" */}
          <div className="relative">
            <GlitchText text="40" />
          </div>

          {/* Part 2: The fallen "4" */}
          <motion.div
            variants={fallenDigitVariants}
            initial="initial"
            animate="fallen"
            className="relative ml-2 md:ml-4 origin-bottom-left" // Margin for spacing, origin for rotation point
          >
            <GlitchText text="4" />
          </motion.div>
        </motion.div>

        {/* The rest of the content (staggered in after the fall starts) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="space-y-4 mb-10">
            <div className="inline-flex items-center justify-center p-2 bg-muted rounded-full mb-2">
              <FileQuestion className="w-5 h-5 text-muted-foreground" />
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-bold">
              Page not found.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The path you intended to travel does not exist. It might have
              crumbled away.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm font-mono text-muted-foreground/70 mt-4">
              <Terminal className="w-4 h-4" />
              <span>Error: E_ROUTE_FRAGMENTED</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/">
              <Button
                size="lg"
                className="gap-2 rounded-full px-6 font-semibold"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}