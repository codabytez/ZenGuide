"use client";

import React from "react";
import Script from "next/script";
import { TourProvider } from "@/contexts/TourContext";
import DemoHeader from "@/components/demo/DemoHeader";
import FeaturesGrid from "@/components/demo/FeaturesGrid";
import EmbedCodePreview from "@/components/demo/EmbedCodePreview";

// Extend the Window interface to include TourGuide
declare global {
  interface Window {
    TourGuide?: {
      start?: () => void;
      [key: string]: unknown;
    };
  }
}

function DemoContent() {
  const handleStartTour = () => {
    if (typeof window !== "undefined" && window.TourGuide?.start) {
      window.TourGuide.start();
    } else {
      console.error("TourGuide not loaded yet");
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <DemoHeader onStartTourAction={handleStartTour} />
      <FeaturesGrid />
      <EmbedCodePreview />
    </div>
  );
}

export default function DemoPage() {
  return (
    <>
      {/* Load the tour widget */}
      <Script
        src="https://timely-swan-1a2b58.netlify.app/widget-bundle.js"
        strategy="afterInteractive"
        data-tour-id="kh7dw5smxjrbw7epxskr37xzd97wy72e"
        data-auto-start="false"
        data-position="bottom-right"
        data-theme="light"
        data-show-avatar="true"
        data-avatar-position="center"
      />

      <TourProvider>
        <DemoContent />
      </TourProvider>
    </>
  );
}
