"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function DemoHeader({
  onStartTour,
}: {
  onStartTour: () => void;
}) {
  return (
    <header className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, hsl(174 80% 50% / 0.15), transparent 60%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
        >
          <Rocket className="w-4 h-4" />
          <span>Embeddable Tour Widget</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Guide Users with{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(174 72% 50%), hsl(180 70% 60%))",
            }}
          >
            Beautiful Tours
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Create engaging onboarding experiences with our embeddable widget.
          Featuring 3D avatars, smooth animations, analytics tracking, and resume
          capability.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={onStartTour}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-primary-foreground"
          style={{
            background:
              "linear-gradient(135deg, hsl(174 72% 40%), hsl(180 70% 50%))",
            boxShadow: "0 4px 20px hsl(174 72% 40% / 0.4)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Rocket className="w-5 h-5" />
          Try the Demo Tour
        </motion.button>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "hsl(174 72% 50%)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 rounded-full opacity-20 blur-3xl"
          style={{ background: "hsl(220 70% 50%)" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>
    </header>
  );
}
