'use client'
import { Button } from '@/components/ui/button';
import { FAQ, GETTING_STARTED_STEPS, SECTIONS } from '@/lib/constants/docs-contants';
import { motion } from 'framer-motion';
import { Book, Check, Code2, Copy, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function Documentation(){
  const [copied, setCopied] = useState<string | null>(null);
 const [currentSection, setCurrentSection] = useState('getting-started')

 



  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  

  const embedCode = `<Script
    src="https://timely-swan-1a2b58.netlify.app/widget-bundle.js"
    strategy="afterInteractive"
    data-tour-id="kh7en2nttjcxwrfs5hhf5yyw7x7wywa8" // Tour id
    data-auto-start="false"  // 'true' | 'false'
    data-position="bottom-right" // 'bottom-left' | 'center'
    data-theme="light" // 'light' | 'dark'
    data-show-avatar="true" // 'true' | 'false'
    data-avatar-position="center" // 'true' | 'false'
  />`;



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
                ZenGuide is an onboarding widget that helps you create interactive tours for your websites. Follow the steps above to install and use the widget.
                
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

