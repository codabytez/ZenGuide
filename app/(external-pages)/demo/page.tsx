"use client";


import React from "react";
import { TourProvider } from "@/contexts/TourContext";
import DemoHeader from "@/components/demo/DemoHeader";
import FeaturesGrid from "@/components/demo/FeaturesGrid";
import EmbedCodePreview from "@/components/demo/EmbedCodePreview";
import { useTour } from "@/contexts/TourContext";

function DemoContent() {
  const { restartTour } = useTour();

  return (
      <div className="min-h-screen pb-24">
        <DemoHeader onStartTour={restartTour} />\
        <FeaturesGrid />
        <EmbedCodePreview />
      </div>
  );
}

export default function DemoPage() {
  return (
    <TourProvider>
      <DemoContent />
    </TourProvider>
  );
}
