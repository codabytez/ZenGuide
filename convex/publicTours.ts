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
        targetSelector: s.targetSelector,
        position: s.position,
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
    // Record the event
    await ctx.db.insert("tourEvents", {
      tourId: args.tourId,
      eventType: args.eventType,
      stepId: args.stepId,
      sessionId: args.sessionId,
      visitorId: args.visitorId,
      timestamp: Date.now(),
    });

    // Update analytics
    const analytics = await ctx.db
      .query("tourAnalytics")
      .withIndex("by_tour", (q) => q.eq("tourId", args.tourId))
      .first();

    if (analytics) {
      const updates: Partial<{
        lastUpdated: number;
        views: number;
        completions: number;
        avgCompletionRate: number;
        skips: number;
      }> = { lastUpdated: Date.now() };

      if (args.eventType === "view") {
        updates.views = analytics.views + 1;
      } else if (args.eventType === "complete") {
        updates.completions = analytics.completions + 1;
        if (analytics.views > 0) {
          updates.avgCompletionRate =
            ((analytics.completions + 1) / analytics.views) * 100;
        }
      } else if (args.eventType === "skip") {
        updates.skips = analytics.skips + 1;
      }

      await ctx.db.patch(analytics._id, updates);
    }

    return { success: true };
  },
});

/**
 * Get multiple tours by domain (optional - for advanced use cases)
 * Returns all active tours for a specific domain
 */
export const getToursByDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, { domain }) => {
    // Find tour embeds for this domain
    const embeds = await ctx.db
      .query("tourEmbeds")
      .withIndex("by_domain", (q) => q.eq("domain", domain))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Fetch tour data for each embed
    const tours = await Promise.all(
      embeds.map(async (embed) => {
        const tour = await ctx.db.get(embed.tourId);
        if (!tour || !tour.isActive) return null;

        const steps = await ctx.db
          .query("tourSteps")
          .withIndex("by_tour", (q) => q.eq("tourId", embed.tourId))
          .order("asc")
          .collect();

        return {
          tourId: tour._id,
          name: tour.name,
          description: tour.description,
          config: {
            primaryColor: embed.primaryColor,
            showAvatar: embed.showAvatar,
            autoStart: embed.autoStart,
            allowSkip: embed.allowSkip,
          },
          steps: steps.map((s) => ({
            id: s.stepId,
            title: s.title,
            description: s.description,
            order: s.order,
            targetSelector: s.targetSelector,
            position: s.position,
          })),
        };
      })
    );

    return tours.filter((t) => t !== null);
  },
});