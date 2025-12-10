"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { TourConfig, TourState, TourStep } from "@/types/tour";

type TourContextType = {
  state: TourState;
  startTour: (config: TourConfig) => void;
  endTour: () => void;
  nextStep: () => void;
};

const TourContext = createContext<TourContextType | null>(null);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TourState>({
    active: false,
    stepIndex: 0,
    steps: [],
  });

  const startTour = useCallback((config: TourConfig) => {
    setState({
      active: true,
      stepIndex: 0,
      steps: config.steps,
    });
  }, []);

  const endTour = useCallback(() => {
    setState({
      active: false,
      stepIndex: 0,
      steps: [],
    });
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      if (prev.stepIndex + 1 >= prev.steps.length) return prev;
      return { ...prev, stepIndex: prev.stepIndex + 1 };
    });
  }, []);

  return (
    <TourContext.Provider value={{ state, startTour, endTour, nextStep }}>
      {children}
    </TourContext.Provider>
  );
}

export const useTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
};
