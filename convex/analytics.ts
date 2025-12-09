// convex/analytics.ts
// Enhanced analytics queries for the dashboard

import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get detailed analytics for a tour
 */
export const getTourAnalytics = query({
  args: {
    tourId: v.id("tours"),
    timeRange: v.optional(v.union(
      v.literal("24h"),
      v.literal("7d"),
      v.literal("30d"),
    )),
  },
  handler: async (ctx, { tourId, timeRange = "7d" }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Verify tour belongs to user
    const tour = await ctx.db.get(tourId);
    if (!tour || tour.userId !== userId) return null;

    const now = Date.now();
    let startTime = 0;

    switch (timeRange) {
      case "24h":
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case "7d":
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
    }

    // Get basic analytics
    const analytics = await ctx.db
      .query("tourAnalytics")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .first();

    // Get events in time range
    const events = await ctx.db
      .query("tourEvents")
      .withIndex("by_tour_date", (q) =>
        q.eq("tourId", tourId).gte("timestamp", startTime)
      )
      .collect();

    // Calculate metrics
    const uniqueVisitors = new Set(
      events.map(e => e.visitorId).filter(Boolean)
    ).size;

    const uniqueSessions = new Set(
      events.map(e => e.sessionId)
    ).size;

    const viewEvents = events.filter(e => e.eventType === "view");
    const completionEvents = events.filter(e => e.eventType === "complete");
    const skipEvents = events.filter(e => e.eventType === "skip");

    const completionRate = viewEvents.length > 0
      ? (completionEvents.length / viewEvents.length) * 100
      : 0;

    const skipRate = viewEvents.length > 0
      ? (skipEvents.length / viewEvents.length) * 100
      : 0;

    // Calculate step-by-step metrics
    const stepMetrics = calculateStepMetrics(events);

    // Calculate daily breakdown
    const dailyBreakdown = calculateDailyBreakdown(events, startTime, now);

    // Calculate average session duration
    const sessionDurations = calculateSessionDurations(events);
    const avgSessionDuration = sessionDurations.length > 0
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
      : 0;

    return {
      overview: {
        totalViews: viewEvents.length,
        totalCompletions: completionEvents.length,
        totalSkips: skipEvents.length,
        completionRate,
        skipRate,
        uniqueVisitors,
        uniqueSessions,
        avgSessionDuration,
      },
      stepMetrics,
      dailyBreakdown,
      weeklyData: analytics?.weeklyViews || [],
    };
  },
});

/**
 * Get funnel analysis - shows where users drop off
 */
export const getFunnelAnalysis = query({
  args: { tourId: v.id("tours") },
  handler: async (ctx, { tourId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    // Verify tour belongs to user
    const tour = await ctx.db.get(tourId);
    if (!tour || tour.userId !== userId) return null;

    // Get tour steps
    const steps = await ctx.db
      .query("tourSteps")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .order("asc")
      .collect();

    // Get all events
    const events = await ctx.db
      .query("tourEvents")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .collect();

    // Group events by session
    type TourEvent = {
      eventType: string;
      stepId?: string;
      sessionId?: string;
      timestamp: number;
      // Add more specific properties here if needed
    };
    const sessionMap = new Map<string, TourEvent[]>();
    events.forEach(event => {
      if (!event.sessionId) return;
      const sessionEvents = sessionMap.get(event.sessionId) || [];
      sessionEvents.push(event);
      sessionMap.set(event.sessionId, sessionEvents);
    });

    // Calculate funnel
    const funnel = steps.map((step) => {
      let viewed = 0;
      let completed = 0;

      sessionMap.forEach(sessionEvents => {
        const stepViewed = sessionEvents.some(
          e => e.eventType === "step_view" && e.stepId === step.stepId
        );
        const stepCompleted = sessionEvents.some(
          e => e.eventType === "complete" && e.stepId === step.stepId
        );

        if (stepViewed) viewed++;
        if (stepCompleted) completed++;
      });

    //   const dropOffRate = viewed > 0 ? ((viewed - completed) / viewed) * 100 : 0;

      return {
        stepId: step.stepId,
        title: step.title,
        order: step.order,
        viewed,
        completed,
        // dropOffRate,
      };
    });

    return funnel;
  },
});

// Helper functions

type TourEvent = {
  eventType: string;
  stepId?: string;
  sessionId?: string;
  timestamp: number;
  visitorId?: string;
  // Add more properties as needed
};

function calculateStepMetrics(events: TourEvent[]) {
  const stepMap = new Map<string, { views: number; completions: number; skips: number }>();

  events.forEach(event => {
    if (!event.stepId) return;

    const metrics = stepMap.get(event.stepId) || {
      views: 0,
      completions: 0,
      skips: 0,
    };

    if (event.eventType === "step_view") metrics.views++;
    if (event.eventType === "complete") metrics.completions++;
    if (event.eventType === "skip") metrics.skips++;

    stepMap.set(event.stepId, metrics);
  });

  return Array.from(stepMap.entries()).map(([stepId, metrics]) => ({
    stepId,
    ...metrics,
    completionRate: metrics.views > 0 ? (metrics.completions / metrics.views) * 100 : 0,
  }));
}

function calculateDailyBreakdown(events: TourEvent[], startTime: number, endTime: number) {
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.ceil((endTime - startTime) / dayMs);
  const breakdown = [];

  for (let i = 0; i < days; i++) {
    const dayStart = startTime + i * dayMs;
    const dayEnd = dayStart + dayMs;

    const dayEvents = events.filter(
      e => e.timestamp >= dayStart && e.timestamp < dayEnd
    );

    breakdown.push({
      date: new Date(dayStart).toISOString().split('T')[0],
      views: dayEvents.filter(e => e.eventType === "view").length,
      completions: dayEvents.filter(e => e.eventType === "complete").length,
      skips: dayEvents.filter(e => e.eventType === "skip").length,
    });
  }

  return breakdown;
}

function calculateSessionDurations(events: TourEvent[]): number[] {
  const sessionMap = new Map<string, { first: number; last: number }>();

  events.forEach(event => {
    if (!event.sessionId) return;

    const session = sessionMap.get(event.sessionId) || {
      first: event.timestamp,
      last: event.timestamp,
    };

    session.first = Math.min(session.first, event.timestamp);
    session.last = Math.max(session.last, event.timestamp);

    sessionMap.set(event.sessionId, session);
  });

  return Array.from(sessionMap.values())
    .map(s => s.last - s.first)
    .filter(d => d > 0 && d < 60 * 60 * 1000); // Filter out invalid durations
}