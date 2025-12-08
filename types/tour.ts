// --------------------------------------------
// STEP
// --------------------------------------------
export interface TourStep {
  id: string;
  title: string;
  description: string;

  /** Order of the step inside the tour (0-based index) */
  order?: number;

  /** CSS selector of the DOM element to highlight */
  target?: string;

  /** Tooltip position around the target element */
  placement?: "top" | "bottom" | "left" | "right" | "center";

  /** Optional image shown inside the step */
  image?: string;

  /** Custom action button shown inside the step */
  action?: {
    label: string;
    onClick?: () => void;
  };
}

// --------------------------------------------
// TOUR CONFIG
// --------------------------------------------
export interface TourConfig {
  /** The ID of the tour being executed */
  tourId: string;
  name: string;

  /** Ordered list of steps */
  steps: TourStep[];

  /** Display assistant avatar in UI */
  showAvatar?: boolean;

  /** Avatar alignment */
  avatarPosition?: "left" | "right";

  /** UI theme */
  theme?: "dark" | "light";

  /** Called when the tour is fully completed */
  onComplete?: () => void;

  /** Called when user skips the tour */
  onSkip?: () => void;

  /** Called whenever the step changes */
  onStepChange?: (stepId: string, stepIndex: number) => void;
}

// --------------------------------------------
// ANALYTICS EVENT
// --------------------------------------------
export interface AnalyticsEvent {
  type:
    | "tour_started"
    | "step_viewed"
    | "step_completed"
    | "step_skipped"
    | "tour_completed"
    | "tour_skipped";

  /** Optional: the step ID associated with the event */
  stepId?: string;

  /** Optional: index of the step */
  stepIndex?: number;

  /** Timestamp in ms */
  timestamp: number;

  /** Any extra metadata you want */
  metadata?: Record<string, unknown>;
}

// --------------------------------------------
// ANALYTICS SESSION
// --------------------------------------------
export interface TourAnalytics {
  /** Tour being tracked */
  tourId: string;

  /** UUID per session/run of the tour */
  sessionId: string;

  /** Event timeline */
  events: AnalyticsEvent[];
}

// --------------------------------------------
// RUNTIME STATE
// --------------------------------------------
export interface TourState {
  /** Current active step index */
  currentStepIndex: number;

  /** IDs of steps the user has completed */
  completedSteps: string[];

  isActive: boolean;

  isPaused: boolean;

  startedAt: number | null;
}
