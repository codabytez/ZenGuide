"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { TourStep } from "@/types/tour";

// ---------- Types ----------

export interface Tour {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  analytics: {
    views: number;
    completions: number;
    skips: number;
    avgCompletionRate: number;
  };
}

interface ToursContextType {
  tours: Tour[];
  createTour: (name: string, description: string) => Tour;
  updateTour: (id: string, updates: Partial<Tour>) => void;
  deleteTour: (id: string) => void;

  addStep: (tourId: string, step: Omit<TourStep, "id" | "order">) => void;
  updateStep: (
    tourId: string,
    stepId: string,
    updates: Partial<TourStep>
  ) => void;
  deleteStep: (tourId: string, stepId: string) => void;
  reorderSteps: (tourId: string, steps: TourStep[]) => void;

  getTour: (id: string) => Tour | undefined;
}

// ---------- Helpers ----------
const generateId = () =>
  `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

// ---------- Context ----------
const ToursContext = createContext<ToursContextType | undefined>(undefined);

export const useTours = () => {
  const ctx = useContext(ToursContext);
  if (!ctx) throw new Error("useTours must be used inside <ToursProvider />");
  return ctx;
};

// ---------- Demo Data ----------
const DEMO_TOURS: Tour[] = [
  {
    id: "tour-001",
    name: "Product Onboarding",
    description: "Welcome new users to your product",
    steps: [
      { id: "step-1", title: "Welcome", description: "Welcome to our platform!", order: 0 },
      { id: "step-2", title: "Dashboard", description: "This is your main dashboard", order: 1 },
      { id: "step-3", title: "Features", description: "Explore our key features", order: 2 },
      { id: "step-4", title: "Settings", description: "Customize your experience", order: 3 },
      { id: "step-5", title: "Get Started", description: "You are ready to begin!", order: 4 },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    isActive: true,
    analytics: { views: 1250, completions: 890, skips: 120, avgCompletionRate: 71.2 },
  },
  // ... other demo tours
];

// ---------- Provider ----------
export const ToursProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tours, setTours] = useState<Tour[]>(() => {
    try {
      const saved = localStorage.getItem("demo-tours");
      if (!saved) return DEMO_TOURS;

      const parsed = JSON.parse(saved);
      return parsed.map((t: Tour) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
    } catch (e) {
      console.warn("Invalid localStorage tours data. Resetting.");
      return DEMO_TOURS;
    }
  });

  const saveTours = useCallback((list: Tour[]) => {
    setTours(list);
    localStorage.setItem("demo-tours", JSON.stringify(list));
  }, []);

  // ---------- CRUD: Tours ----------

  const createTour = useCallback(
    (name: string, description: string): Tour => {
      const newTour: Tour = {
        id: `tour-${generateId()}`,
        name,
        description,
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
        analytics: { views: 0, completions: 0, skips: 0, avgCompletionRate: 0 },
      };

      saveTours([...tours, newTour]);
      return newTour;
    },
    [tours, saveTours]
  );

  const updateTour = useCallback(
    (id: string, updates: Partial<Tour>) => {
      saveTours(
        tours.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
        )
      );
    },
    [tours, saveTours]
  );

  const deleteTour = useCallback(
    (id: string) => {
      saveTours(tours.filter((t) => t.id !== id));
    },
    [tours, saveTours]
  );

  // ---------- CRUD: Steps ----------

  const addStep = useCallback(
    (tourId: string, step: Omit<TourStep, "id" | "order">) => {
      saveTours(
        tours.map((t) => {
          if (t.id !== tourId) return t;
          const newIndex = t.steps.length;

          return {
            ...t,
            steps: [
              ...t.steps,
              { ...step, id: `step-${generateId()}`, order: newIndex },
            ],
            updatedAt: new Date(),
          };
        })
      );
    },
    [tours, saveTours]
  );

  const updateStep = useCallback(
    (tourId: string, stepId: string, updates: Partial<TourStep>) => {
      saveTours(
        tours.map((t) => {
          if (t.id !== tourId) return t;
          return {
            ...t,
            steps: t.steps.map((s) =>
              s.id === stepId ? { ...s, ...updates } : s
            ),
            updatedAt: new Date(),
          };
        })
      );
    },
    [tours, saveTours]
  );

  const deleteStep = useCallback(
    (tourId: string, stepId: string) => {
      saveTours(
        tours.map((t) => {
          if (t.id !== tourId) return t;
          const updatedSteps = t.steps
            .filter((s) => s.id !== stepId)
            .map((s, i) => ({ ...s, order: i })); // re-index order

          return {
            ...t,
            steps: updatedSteps,
            updatedAt: new Date(),
          };
        })
      );
    },
    [tours, saveTours]
  );

  const reorderSteps = useCallback(
    (tourId: string, steps: TourStep[]) => {
      saveTours(
        tours.map((t) =>
          t.id === tourId
            ? {
                ...t,
                steps: steps.map((s, i) => ({ ...s, order: i })),
                updatedAt: new Date(),
              }
            : t
        )
      );
    },
    [tours, saveTours]
  );

  const getTour = useCallback(
    (id: string) => tours.find((t) => t.id === id),
    [tours]
  );

  // ---------- Memoized Context Value ----------
  const value = useMemo(
    () => ({
      tours,
      createTour,
      updateTour,
      deleteTour,
      addStep,
      updateStep,
      deleteStep,
      reorderSteps,
      getTour,
    }),
    [tours]
  );

  return (
    <ToursContext.Provider value={value}>{children}</ToursContext.Provider>
  );
};
