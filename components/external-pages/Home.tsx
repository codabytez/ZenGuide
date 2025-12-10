'use client'

import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Terminal,
  Zap,
  LayoutTemplate,
  Code2,
  Check,
  Cpu,
  Command
} from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20" ref={targetRef}>

      {/* --- HERO SECTION --- */}
      {/* Changed: Added relative and overflow-hidden here to trap the background */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center  border-b border-border/40">

        {/* --- HERO BACKGROUND (Scoped to this section only) --- */}
        <div className="absolute inset-0 z-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
          {/* Radial Gradient */}
          <div className="absolute inset-0 bg-radial-at-t from-primary/10 via-background/0 to-background"></div>
          {/* Bottom Fade: Blends the grid into the next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none"></div>
        </div>

        {/* --- HERO CONTENT --- */}
        <motion.div
          className="container mx-auto px-4 text-center relative z-10"
          style={{ opacity, scale }}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Version Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-mono font-medium mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            v1.0 Stable Release
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-foreground mb-8 leading-[0.9]"
          >
            Onboarding <br />
            <span className="text-muted-foreground/40 relative">
              without
            </span> the <br />
            {/* Glitch Effect on "Bloat" */}
            <span className="relative inline-block text-primary/90">
              <span className="absolute -inset-0.5 translate-x-0.5 text-green-500/50 mix-blend-screen blur-[2px]">Bloat.</span>
              <span className="relative z-10">Bloat.</span>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Stop waiting for deployment cycles. Launch interactive product tours directly from your dashboard without touching your codebase.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-accent opacity-30 blur-lg group-hover:opacity-50 transition duration-200" />
              <Link href="/auth/signup">
                <Button size="lg" className="w-full relative px-8 text-lg bg-foreground text-background hover:bg-foreground/90 font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
            <Link href="/demo">
              <Button size="lg" variant="ghost" className="w-full px-8 text-lg gap-2 hover:bg-primary/80">
                <Command className="w-5 h-5 text-muted-foreground" />
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>


      {/* --- VALUE PROP: Bento Grid --- */}
      <section className="relative z-10 py-32 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Enterprise-grade control, zero friction.</h2>
            <p className="text-muted-foreground text-xl">
              Stop wrestling with hardcoded tours. Manage your onboarding flows entirely from our dashboard
              and deploy updates instantly without touching your codebase.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Dashboard / Visual Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-muted/20 border border-border/50 hover:border-primary/20 transition-colors col-span-1 md:col-span-2 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <LayoutTemplate size={200} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-background border flex items-center justify-center mb-6 shadow-sm">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Visual Tour Builder</h3>
                <p className="text-muted-foreground text-lg">
                  Create and edit steps directly in our visual dashboard. Target elements by CSS selector,
                  add rich content, and preview your changes in real-time. No deployments required.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-linear-to-b from-primary/10 to-transparent border border-primary/10 flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Deep Analytics</h3>
                <p className="text-muted-foreground">Track drop-off rates and completion metrics. See exactly where users get stuck.</p>
              </div>
            </motion.div>

            {/* Card 3: Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-card border border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Ultra-light Widget</h3>
              <p className="text-muted-foreground">Our script loads asynchronously and never blocks your main thread. Your Lighthouse score stays perfect.</p>
            </motion.div>

            {/* Card 4: Targeting & Customization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-3xl bg-card border border-border/50 col-span-1 md:col-span-2"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 text-green-500">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Smart Targeting</h3>
              <p className="text-muted-foreground text-lg">
                Configure tours to launch automatically based on user segments or specific page URLs.
                Control the experience via simple data attributes like <code className="text-primary bg-primary/10 px-1 rounded">data-auto-start</code>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- IMPLEMENTATION: The Terminal Section --- */}
      <section className="relative z-10 py-32 bg-[#050505] text-white border-y border-white/10 overflow-hidden">
        {/* Decorative Glow behind terminal */}
        <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left: Text Content */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-primary mb-4 font-mono text-sm">
                <Terminal className="w-4 h-4" />
                <span>Integration</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Drop-in simplicity.</h2>
              <p className="text-white/60 text-lg mb-8 max-w-md">
                We designed the widget to be framework-agnostic. Whether you use Next.js, PHP, or plain HTML, it just works.
              </p>

              <ul className="space-y-6">
                {[
                  { title: "Universal Embed", desc: "Add a single script tag to your document head. No complex build steps or npm packages required." },
                  { title: "Smart Configuration", desc: "Control behavior via data attributes like data-auto-start and data-position directly in HTML." },
                  { title: "Remote Management", desc: "Update tour steps and logic from your dashboard without deploying new code." }
                ].map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-mono mt-0.5 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-lg">{point.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{point.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right: The Terminal (Moved here) */}
            <motion.div
              className="flex-1 w-full max-w-xl relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-xs text-white/30 font-mono">bash — 80x24</div>
                </div>

                {/* Terminal Body */}
                <div className="p-6 font-mono text-sm leading-relaxed space-y-4">
                  <div>
                    <p className="flex gap-2 text-white/90">
                      <span className="text-green-500">➜</span>
                      <span className="text-blue-400">~/project</span>
                      <span>vim index.html</span>
                    </p>
                  </div>

                  <div>
                    <div className="mt-2 p-4 rounded bg-white/5 border-l-2 border-primary">
                      <span className="text-gray-500 italic">&lt;!-- Add to your &lt;head&gt; or &lt;body&gt; --&gt;</span>
                      <br />
                      <span className="text-purple-400">&lt;script</span>
                      <br />
                      &nbsp;&nbsp;<span className="text-blue-300">src</span>=<span className="text-green-400">{'"https://zenguide-widget.vercel.app/widget-bundle.js"'}</span>
                      <br />
                      &nbsp;&nbsp;<span className="text-blue-300">data-tour-id</span>=<span className="text-green-400">{'"your-tour-id"'}</span>
                      <br />
                      &nbsp;&nbsp;<span className="text-blue-300">data-auto-start</span>=<span className="text-green-400">{'"true"'}</span>
                      <br />
                      <span className="text-purple-400">/&gt;</span>
                    </div>

                    <div className="mt-4 space-y-1">
                      <p className="text-white/40">
                        <span className="text-green-500">✔</span> Widget initialized
                      </p>
                      <p className="text-white/40">
                        <span className="text-green-500">✔</span> Tour content loaded (4 steps)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-6">
              Your product is complex. <br />
              <span className="text-muted-foreground">Your onboarding {"shouldn't"} be.</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Link href="/auth/signup">
                <Button className="w-full" size="lg">Start Building Free</Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" className="w-full" size="lg">Read Documentation</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};