// convex/publicTours.ts
// Public API endpoints for the widget (no auth required)

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get a tour by ID - PUBLIC endpoint for widget
 * This doesn't require authentication so widgets can fetch tour data
 */
export const getTourById = query({
  args: { tourId: v.id("tours") },
  handler: async (ctx, { tourId }) => {
    const tour = await ctx.db.get(tourId);

    // Only return if tour exists and is active
    if (!tour || !tour.isActive) {
      return null;
    }

    // Fetch steps
    const steps = await ctx.db
      .query("tourSteps")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .order("asc")
      .collect();

    // Return tour data in widget-friendly format
    return {
      tourId: tour._id,
      name: tour.name,
      description: tour.description,
      steps: steps.map((s) => ({
        id: s.stepId,
        title: s.title,
        description: s.description,
        order: s.order,
        target: s.targetSelector,
        placement: s.position || "bottom",
      })),
    };
  },
});

/**
 * Track analytics events from the widget
 * This allows the widget to send analytics data back to Convex
 */
export const trackWidgetEvent = mutation({
  args: {
    tourId: v.id("tours"),
    eventType: v.union(
      v.literal("view"),
      v.literal("start"),
      v.literal("complete"),
      v.literal("skip"),
      v.literal("step_view")
    ),
    stepId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    visitorId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Record the event
    await ctx.db.insert("tourEvents", {
      tourId: args.tourId,
      eventType: args.eventType,
      stepId: args.stepId,
      sessionId: args.sessionId,
      visitorId: args.visitorId,
      timestamp: now,
    });

    // Update analytics
    let analytics = await ctx.db
      .query("tourAnalytics")
      .withIndex("by_tour", (q) => q.eq("tourId", args.tourId))
      .first();

    // Create analytics record if it doesn't exist
    if (!analytics) {
      console.log("Creating new analytics record for tour:", args.tourId);
      const analyticsId = await ctx.db.insert("tourAnalytics", {
        tourId: args.tourId,
        views: 0,
        completions: 0,
        skips: 0,
        avgCompletionRate: 0,
        lastUpdated: now,
      });
      analytics = await ctx.db.get(analyticsId);
    }

    if (analytics) {
      const updates: {
        lastUpdated: number;
        views?: number;
        completions?: number;
        skips?: number;
        avgCompletionRate?: number;
      } = { lastUpdated: now };

      if (args.eventType === "view") {
        updates.views = analytics.views + 1;
        console.log(`Updated views: ${analytics.views} -> ${updates.views}`);
      } else if (args.eventType === "complete") {
        updates.completions = analytics.completions + 1;
        const newViews = analytics.views || 1;
        updates.avgCompletionRate =
          ((analytics.completions + 1) / newViews) * 100;
        console.log(`Updated completions: ${analytics.completions} -> ${updates.completions}`);
      } else if (args.eventType === "skip") {
        updates.skips = analytics.skips + 1;
        console.log(`Updated skips: ${analytics.skips} -> ${updates.skips}`);
      }

      await ctx.db.patch(analytics._id, updates);
      console.log("Analytics updated successfully");
    }

    return { success: true };
  },
});