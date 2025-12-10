"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

const embedCode = `<!-- Onboarding Tour Widget -->
<Script
        src="https://timely-swan-1a2b58.netlify.app/widget-bundle.js"
        strategy="afterInteractive"
        data-tour-id="kh7dw5smxjrbw7epxskr37xzd97wy72e"
        data-auto-start="false"
        data-position="bottom-right"
        data-theme="light"
        data-show-avatar="true"
        data-avatar-position="center"
      />`;

export default function EmbedCodePreview() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto my-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="relative rounded-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>

          <span className="text-xs text-muted-foreground font-mono">
            embed-code.html
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code block */}
        <pre className="p-4 bg-card overflow-x-auto text-sm">
          <code className="text-foreground font-mono whitespace-pre">
            {embedCode.split("\n").map((line, i) => (
              <div key={i} className="flex">
                {/* Line number */}
                <span className="select-none text-muted-foreground w-8 text-right pr-4 opacity-50">
                  {i + 1}
                </span>

                {/* Line content with syntax highlighting */}
                <span
                  className="flex-1"
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(
                        /(&lt;|<)(\/?\w+)/g,
                        '<span class="text-primary">$1$2</span>'
                      )
                      .replace(
                        /(["'])(.*?)\1/g,
                        '<span class="text-accent">$1$2$1</span>'
                      )
                      .replace(
                        /\/\/.*/g,
                        '<span class="text-muted-foreground">$&</span>'
                      ),
                  }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}
