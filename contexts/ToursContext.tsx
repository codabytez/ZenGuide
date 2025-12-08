import React, { createContext, useContext, useState, useCallback } from 'react';
import { TourStep } from '@/types/tour';

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
  addStep: (tourId: string, step: Omit<TourStep, 'id'>) => void;
  updateStep: (tourId: string, stepId: string, updates: Partial<TourStep>) => void;
  deleteStep: (tourId: string, stepId: string) => void;
  reorderSteps: (tourId: string, steps: TourStep[]) => void;
  getTour: (id: string) => Tour | undefined;
}

const ToursContext = createContext<ToursContextType | undefined>(undefined);

export const useTours = () => {
  const context = useContext(ToursContext);
  if (!context) {
    throw new Error('useTours must be used within a ToursProvider');
  }
  return context;
};

const generateId = () => Math.random().toString(36).substring(2, 11);

// Demo tours with mock data
const DEMO_TOURS: Tour[] = [
  {
    id: 'tour-001',
    name: 'Product Onboarding',
    description: 'Welcome new users to your product',
    steps: [
      { id: 'step-1', title: 'Welcome', description: 'Welcome to our platform!', order: 0 },
      { id: 'step-2', title: 'Dashboard', description: 'This is your main dashboard', order: 1 },
      { id: 'step-3', title: 'Features', description: 'Explore our key features', order: 2 },
      { id: 'step-4', title: 'Settings', description: 'Customize your experience', order: 3 },
      { id: 'step-5', title: 'Get Started', description: 'You are ready to begin!', order: 4 },
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    isActive: true,
    analytics: { views: 1250, completions: 890, skips: 120, avgCompletionRate: 71.2 },
  },
  {
    id: 'tour-002',
    name: 'Feature Showcase',
    description: 'Highlight new features to existing users',
    steps: [
      { id: 'step-1', title: 'New Features', description: 'Check out what is new', order: 0 },
      { id: 'step-2', title: 'AI Assistant', description: 'Meet your new AI helper', order: 1 },
      { id: 'step-3', title: 'Analytics', description: 'Track your progress', order: 2 },
      { id: 'step-4', title: 'Integrations', description: 'Connect your tools', order: 3 },
      { id: 'step-5', title: 'Feedback', description: 'Share your thoughts', order: 4 },
    ],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    isActive: true,
    analytics: { views: 850, completions: 620, skips: 95, avgCompletionRate: 72.9 },
  },
  {
    id: 'tour-003',
    name: 'Admin Training',
    description: 'Training tour for administrators',
    steps: [
      { id: 'step-1', title: 'Admin Panel', description: 'Access admin controls', order: 0 },
      { id: 'step-2', title: 'User Management', description: 'Manage team members', order: 1 },
      { id: 'step-3', title: 'Permissions', description: 'Set access levels', order: 2 },
      { id: 'step-4', title: 'Reports', description: 'Generate reports', order: 3 },
      { id: 'step-5', title: 'Support', description: 'Get help when needed', order: 4 },
    ],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-18'),
    isActive: false,
    analytics: { views: 320, completions: 280, skips: 15, avgCompletionRate: 87.5 },
  },
];

export const ToursProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>(() => {
    const saved = localStorage.getItem('demo-tours');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: Tour) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
    }
    return DEMO_TOURS;
  });

  const saveTours = (newTours: Tour[]) => {
    setTours(newTours);
    localStorage.setItem('demo-tours', JSON.stringify(newTours));
  };

  const createTour = useCallback((name: string, description: string): Tour => {
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
  }, [tours]);

  const updateTour = useCallback((id: string, updates: Partial<Tour>) => {
    saveTours(tours.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    ));
  }, [tours]);

  const deleteTour = useCallback((id: string) => {
    saveTours(tours.filter(t => t.id !== id));
  }, [tours]);

  const addStep = useCallback((tourId: string, step: Omit<TourStep, 'id'>) => {
    saveTours(tours.map(t => {
      if (t.id !== tourId) return t;
      const newStep: TourStep = { ...step, id: `step-${generateId()}` };
      return { ...t, steps: [...t.steps, newStep], updatedAt: new Date() };
    }));
  }, [tours]);

  const updateStep = useCallback((tourId: string, stepId: string, updates: Partial<TourStep>) => {
    saveTours(tours.map(t => {
      if (t.id !== tourId) return t;
      return {
        ...t,
        steps: t.steps.map(s => s.id === stepId ? { ...s, ...updates } : s),
        updatedAt: new Date(),
      };
    }));
  }, [tours]);

  const deleteStep = useCallback((tourId: string, stepId: string) => {
    saveTours(tours.map(t => {
      if (t.id !== tourId) return t;
      return {
        ...t,
        steps: t.steps.filter(s => s.id !== stepId),
        updatedAt: new Date(),
      };
    }));
  }, [tours]);

  const reorderSteps = useCallback((tourId: string, steps: TourStep[]) => {
    saveTours(tours.map(t => 
      t.id === tourId ? { ...t, steps, updatedAt: new Date() } : t
    ));
  }, [tours]);

  const getTour = useCallback((id: string) => tours.find(t => t.id === id), [tours]);

  return (
    <ToursContext.Provider value={{
      tours,
      createTour,
      updateTour,
      deleteTour,
      addStep,
      updateStep,
      deleteStep,
      reorderSteps,
      getTour,
    }}>
      {children}
    </ToursContext.Provider>
  );
};
