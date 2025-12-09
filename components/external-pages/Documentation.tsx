'use client'
import { Button } from '@/components/ui/button';
import { FAQ, SECTIONS } from '@/lib/constants/docs-contants';
import { motion } from 'framer-motion';
import { Book, Check, Code2, Copy, HelpCircle, Settings, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Documentation(){
  const [copied, setCopied] = useState<string | null>(null);
 const [currentSection, setCurrentSection] = useState('getting-started')

 



  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  

  const embedCode = `<script src="https://cdn.tourguide.app/widget.js"></script>
<script>
  TourGuide.init({
    tourId: 'your-tour-id',
    position: 'bottom-right',
    showAvatar: true,
  });
</script>`;

  const configCode = `TourGuide.init({
  tourId: 'your-tour-id',
  position: 'bottom-right',      // 'bottom-left' | 'center'
  showAvatar: true,              // Show 3D avatar
  autoStart: true,               // Start tour automatically
  allowSkip: true,               // Allow users to skip
  onComplete: () => {
    console.log('Tour completed!');
  },
  onSkip: (stepId) => {
    console.log('Skipped at step:', stepId);
  }
});`;

  const apiCode = `// Start the tour
TourGuide.start();

// Go to specific step
TourGuide.goToStep('step-3');

// Pause/Resume
TourGuide.pause();
TourGuide.resume();

// End the tour
TourGuide.end();

// Get current state
const state = TourGuide.getState();
console.log(state.currentStep, state.progress);`;

  return (
   <>
      <div className="mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Documentation</h3>
              <nav className="space-y-1">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setCurrentSection(section.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${currentSection === section.id ? 'text-foreground bg-muted' : ''}`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                Documentation
              </h1>
              <p className="text-lg text-muted-foreground mb-12">
                Everything you need to integrate TourGuide into your application.
              </p>
            </motion.div>

            {/* Getting Started */}
            <section id="getting-started" className="mb-16">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Book className="w-6 h-6 text-primary" />
                Getting Started
              </h2>
              <p className="text-muted-foreground mb-4">
                TourGuide is an embeddable onboarding widget that helps you create 
                beautiful, interactive tours for your web application. Follow these 
                steps to get started in minutes.
              </p>
              <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                  <li>Create an account and access your dashboard</li>
                  <li>Create a new tour and add your steps (minimum 5)</li>
                  <li>Copy the embed code for your tour</li>
                  <li>Paste the code into your website&apos;s HTML</li>
                  <li>Your tour is live! Monitor analytics in the dashboard</li>
                </ol>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="mb-16">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-primary" />
                Installation
              </h2>
              <p className="text-muted-foreground mb-4">
                Add the TourGuide script to your website. Place it before the closing 
                <code className="px-1.5 py-0.5 bg-muted rounded text-sm mx-1">&lt;/body&gt;</code> 
                tag for best performance.
              </p>
              <div className="relative">
                <pre className="bg-zinc-900 text-zinc-100 rounded-xl p-4 overflow-x-auto text-sm">
                  <code>{embedCode}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
                  onClick={() => copyCode(embedCode, 'embed')}
                >
                  {copied === 'embed' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </section>

            {/* Configuration */}
            <section id="configuration" className="mb-16">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary" />
                Configuration
              </h2>
              <p className="text-muted-foreground mb-4">
                Customize the widget behavior with these configuration options:
              </p>
              <div className="relative">
                <pre className="bg-zinc-900 text-zinc-100 rounded-xl p-4 overflow-x-auto text-sm">
                  <code>{configCode}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
                  onClick={() => copyCode(configCode, 'config')}
                >
                  {copied === 'config' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Option</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Default</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4"><code className="text-primary">tourId</code></td>
                      <td className="py-3 px-4">string</td>
                      <td className="py-3 px-4">required</td>
                      <td className="py-3 px-4">Your unique tour identifier</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4"><code className="text-primary">position</code></td>
                      <td className="py-3 px-4">string</td>
                      <td className="py-3 px-4">&lsquo;bottom-right&rsquo;</td>
                      <td className="py-3 px-4">Widget position on screen</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4"><code className="text-primary">showAvatar</code></td>
                      <td className="py-3 px-4">boolean</td>
                      <td className="py-3 px-4">true</td>
                      <td className="py-3 px-4">Show 3D avatar animation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4"><code className="text-primary">autoStart</code></td>
                      <td className="py-3 px-4">boolean</td>
                      <td className="py-3 px-4">true</td>
                      <td className="py-3 px-4">Start tour on page load</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4"><code className="text-primary">allowSkip</code></td>
                      <td className="py-3 px-4">boolean</td>
                      <td className="py-3 px-4">true</td>
                      <td className="py-3 px-4">Allow users to skip the tour</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* API Reference */}
            <section id="api" className="mb-16">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                API Reference
              </h2>
              <p className="text-muted-foreground mb-4">
                Control the tour programmatically using these methods:
              </p>
              <div className="relative">
                <pre className="bg-zinc-900 text-zinc-100 rounded-xl p-4 overflow-x-auto text-sm">
                  <code>{apiCode}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
                  onClick={() => copyCode(apiCode, 'api')}
                >
                  {copied === 'api' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                FAQ
              </h2>
              <div className="space-y-4">
                {FAQ.map((faq, i) => (
                  <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border/50">
                    <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
   </>
  );
};

