"use client";

import { motion } from "framer-motion";
import { 
  Terminal, 
  GitCommit, 
  ArrowUpRight, 
  Zap, 
  Users, 
  Coffee 
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      
      {/* SECTION 1: The Manifesto (Replaces standard Hero) */}
      <section className="pt-32 pb-16 border-b border-border/40">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            
            {/* Left: Main Headline */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  v1.0 Public Build
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[0.95] mb-8">
                  Software shouldn't <br />
                  <span className="text-primary/60">feel like a maze.</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  We got tired of watching users sign up and drop off within 60 seconds. 
                  ZenGuide wasn't born in a boardroom; it was built during a hackathon to fix 
                  our own broken onboarding flow. Now, it handles the "hello" for 2M+ users.
                </p>
              </motion.div>
            </div>

            {/* Right: Quick Stats (Integrated subtly) */}
            <div className="lg:col-span-4 lg:text-right flex flex-col gap-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-1"
              >
                <h3 className="text-4xl font-bold font-mono">234,100+</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Active sessions handled</p>
              </motion.div>
              <div className="h-px w-full bg-border/50" />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-1"
              >
                <h3 className="text-4xl font-bold font-mono">99.99%</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Uptime since day 0</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: The Logic (Replaces Values) - Bento Grid Style */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight">How we think</h2>
            <p className="hidden md:block text-muted-foreground font-mono text-sm">/src/components/values</p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Card 1: Large */}
            <motion.div variants={item} className="md:col-span-2 p-8 rounded-3xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Terminal size={120} />
              </div>
              <div className="relative z-10">
                <div className="h-10 w-10 bg-background rounded-xl border border-border flex items-center justify-center mb-6 shadow-xs">
                  <GitCommit className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Dev-First Architecture</h3>
                <p className="text-muted-foreground max-w-md">
                  Most onboarding tools are bloated overlays. We built a headless engine 
                  that respects your DOM. No fighting with z-indexes, no iframe nightmares. 
                  Just a clean Script tag.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Tall */}
            <motion.div variants={item} className="md:col-span-1 p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-background rounded-xl border border-border flex items-center justify-center mb-6 shadow-xs">
                  <Zap className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Speed matters</h3>
                <p className="text-muted-foreground text-sm">
                  We add less than 5kb to your bundle size. User experience shouldn't cost performance.
                </p>
              </div>
              <div className="mt-8">
                 <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[95%]" />
                 </div>
                 <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
                    <span>Performance Score</span>
                    <span>98/100</span>
                 </div>
              </div>
            </motion.div>

            {/* Card 3: Standard */}
            <motion.div variants={item} className="p-8 rounded-3xl bg-card border border-border/50">
               <div className="h-10 w-10 bg-background rounded-xl border border-border flex items-center justify-center mb-6 shadow-xs">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              <h3 className="text-xl font-bold mb-2">User Empathy</h3>
              <p className="text-muted-foreground text-sm">
                We don't force users to click "Next" 10 times. We build non-intrusive nudges.
              </p>
            </motion.div>

            {/* Card 4: Standard */}
            <motion.div variants={item} className="md:col-span-2 p-8 rounded-3xl bg-card border border-border/50 flex items-center justify-between group cursor-pointer">
              <div className="max-w-lg">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    Open Source at heart 
                    <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-normal">Coming Soon</span>
                </h3>
                <p className="text-muted-foreground text-sm">
                  We are preparing to open-source our core engine. We believe transparency builds better security.
                </p>
              </div>
              <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: The Builders (Replaces Team) - Directory Style */}
      <section className="py-24 border-t border-border/40 bg-muted/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Who's pushing to prod?</h2>
            <p className="text-muted-foreground">Small team, high output.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { name: "Alex Chen", role: "CEO & Architecture", desc: "Ex-Stripe. obsessed with API design.", icon: "AC" },
              { name: "Sarah Johnson", role: "Product", desc: "Turned a messy backlog into a roadmap.", icon: "SJ" },
              { name: "Mike Davis", role: "Lead Engineer", desc: "Vim user. Breaks things so you don't have to.", icon: "MD" },
              { name: "Emily Park", role: "Design Systems", desc: "Believes pixel perfection is a bare minimum.", icon: "EP" },
            ].map((member, i) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-background hover:shadow-sm border border-transparent hover:border-border/50 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-black text-white flex items-center justify-center font-mono font-bold shrink-0">
                  {member.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-primary mb-1">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-snug">{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}