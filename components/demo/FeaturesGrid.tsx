"use client";

import { motion } from "framer-motion";
import { Code2, Sparkles, BarChart3, Zap, Shield, Puzzle } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Easy Embed",
    description: "Add to any website with a simple script tag",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track completion rates and user engagement",
  },
  {
    icon: Zap,
    title: "Smooth Animations",
    description: "Framer Motion powered transitions",
  },
  {
    icon: Shield,
    title: "Resume Support",
    description: "Users can continue where they left off",
  },
  {
    icon: Puzzle,
    title: "Configurable",
    description: "Customize steps, themes, and behavior",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Everything you need to create engaging onboarding experiences
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-5 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                  }}
                >
                  <feature.icon className="w-5 h-5 text-primary-foreground" />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
