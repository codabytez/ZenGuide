'use client'
import { Button } from '@/components/ui/button';
import { FAQ, SECTIONS } from '@/lib/constants/docs-contants';
import { AnimatePresence, motion } from 'framer-motion';
import { Book, Check, ChevronDown, Code2, Copy, HelpCircle, Settings, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Documentation() {
  const [copied, setCopied] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState('getting-started');
  const [openFaq, setOpenFaq] = useState<number>(0); // Start with first FAQ open

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const embedCode = `<!-- Onboarding Tour Widget -->
<Script
    src="https://timely-swan-1a2b58.netlify.app/widget-bundle.js"
    data-tour-id="kh7dw5smxjrbw7epxskr37xzd97wy72e"
    data-auto-start="false"
/>`;

  const configCode = `
  data-tour-id="your-tour-id"           // (string) Your unique tour identifier
  data-position="bottom-right"          // (string) Widget position: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  data-show-avatar="true"               // (boolean) Show 3D avatar animation
  data-auto-start="true"                // (boolean) Start tour on page load
  data-avatar-position="center"         // (string) Avatar position: 'center', 'left', 'right'
`;

  const apiCode = `// Start the tour
window.TourGuide.start();

// Stop the tour
window.TourGuide.stop();`;

  return (
    <>
      <div className="mx-auto px-4 py-12 ">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 ">
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
                ZenGuide is an onboarding widget that helps you create interactive tours for your websites. Follow these
                steps to get started in minutes.
              </p>
              <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                  {GETTING_STARTED_STEPS?.map(step => <li key={step.id}>{step.title}</li>)}
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
              <div className="relative  ">
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
                      <td className="py-3 px-4"><code className="text-primary">
                        data-tour-id
                      </code></td>
                      <td className="py-3 px-4">string</td>
                      <td className="py-3 px-4">required</td>
                      <td className="py-3 px-4">Your unique tour identifier</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4"><code className="text-primary">
                        data-position
                      </code></td>
                      <td className="py-3 px-4">string</td>
                      <td className="py-3 px-4">&lsquo;bottom-right&rsquo;</td>
                      <td className="py-3 px-4">Widget position on screen</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4"><code className="text-primary">
                        data-show-avatar
                      </code></td>
                      <td className="py-3 px-4">boolean</td>
                      <td className="py-3 px-4">true</td>
                      <td className="py-3 px-4">Show 3D avatar animation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4"><code className="text-primary">
                        data-avatar-position
                      </code></td>
                      <td className="py-3 px-4">string</td>
                      <td className="py-3 px-4">&lsquo;center&rsquo;</td>
                      <td className="py-3 px-4">Avatar position on widget</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4"><code className="text-primary">
                        data-auto-start
                      </code></td>
                      <td className="py-3 px-4">boolean</td>
                      <td className="py-3 px-4">true</td>
                      <td className="py-3 px-4">Start tour on page load</td>
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

            <section id='examples' className='mb-16'>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-primary" />
                Examples
              </h2>
              <p className="text-muted-foreground mb-4">
                Here are some example configurations for different use cases:
              </p>
              <div className="bg-muted/50 rounded-xl p-6 border border-border/50 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">E-commerce Onboarding</h3>
                  <pre className="bg-zinc-900 text-zinc-100 rounded-xl p-4 overflow-x-auto text-sm">
                    <code>{`<Script
    src="https://timely-swan-1a2b58.netlify.app/widget-bundle.js"
    data-tour-id="ecom-onboarding-123"
    data-auto-start="true"
    data-show-avatar="true"
    data-position="bottom-left"
/>`}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">SaaS Product Tour</h3>
                  <pre className="bg-zinc-900 text-zinc-100 rounded-xl p-4 overflow-x-auto text-sm">
                    <code>{`<Script
    src="https://timely-swan-1a2b58.netlify.app/widget-bundle.js"
    data-tour-id="saas-product-tour-456"
    data-auto-start="false"
    data-show-avatar="false"
    data-position="top-right"
/>`}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                FAQ
              </h2>
              <div className="space-y-3">
                {FAQ.map((faq, i) => (
                  <div key={i} className="bg-muted/50 rounded-xl border border-border/50 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/80 transition-colors"
                    >
                      <h4 className="font-semibold text-foreground pr-4">{faq.question}</h4>
                      <motion.div
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-4 pb-4">
                            <p className="text-muted-foreground text-sm">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

