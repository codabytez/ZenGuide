// convex/tours.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// ============= QUERIES =============

// Get all tours for the current user
export const getUserTours = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const tours = await ctx.db
      .query("tours")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Fetch analytics and steps for each tour
    const toursWithData = await Promise.all(
      tours.map(async (tour) => {
        const steps = await ctx.db
          .query("tourSteps")
          .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
          .order("asc")
          .collect();

        const analytics = await ctx.db
          .query("tourAnalytics")
          .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
          .first();

        return {
          id: tour._id,
          name: tour.name,
          description: tour.description,
          isActive: tour.isActive,
          createdAt: tour.createdAt,
          updatedAt: tour.updatedAt,
          steps: steps.map((s) => ({
            id: s.stepId,
            title: s.title,
            description: s.description,
            order: s.order,
          })),
          analytics: analytics || {
            views: 0,
            completions: 0,
            skips: 0,
            avgCompletionRate: 0,
          },
        };
      })
    );

    return toursWithData;
  },
});

// Get a single tour by ID
export const getTour = query({
  args: { tourId: v.id("tours") },
  handler: async (ctx, { tourId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const tour = await ctx.db.get(tourId);
    if (!tour || tour.userId !== userId) return null;

    const steps = await ctx.db
      .query("tourSteps")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .order("asc")
      .collect();

    const analytics = await ctx.db
      .query("tourAnalytics")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .first();

    return {
      id: tour._id,
      name: tour.name,
      description: tour.description,
      isActive: tour.isActive,
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
      steps: steps.map((s) => ({
        id: s.stepId,
        title: s.title,
        description: s.description,
        order: s.order,
      })),
      analytics: analytics || {
        views: 0,
        completions: 0,
        skips: 0,
        avgCompletionRate: 0,
      },
    };
  },
});

// ============= MUTATIONS =============

// Create a new tour
export const createTour = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { name, description }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();

    const tourId = await ctx.db.insert("tours", {
      userId,
      name,
      description,
      isActive: false,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize analytics
    await ctx.db.insert("tourAnalytics", {
      tourId,
      views: 0,
      completions: 0,
      skips: 0,
      avgCompletionRate: 0,
      lastUpdated: now,
    });

    return tourId;
  },
});

// Update a tour
export const updateTour = mutation({
  args: {
    tourId: v.id("tours"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { tourId, ...updates }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const tour = await ctx.db.get(tourId);
    if (!tour || tour.userId !== userId) {
      throw new Error("Tour not found");
    }

    await ctx.db.patch(tourId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return tourId;
  },
});

// Delete a tour
export const deleteTour = mutation({
  args: { tourId: v.id("tours") },
  handler: async (ctx, { tourId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const tour = await ctx.db.get(tourId);
    if (!tour || tour.userId !== userId) {
      throw new Error("Tour not found");
    }

    // Delete associated steps
    const steps = await ctx.db
      .query("tourSteps")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .collect();

    for (const step of steps) {
      await ctx.db.delete(step._id);
    }

    // Delete analytics
    const analytics = await ctx.db
      .query("tourAnalytics")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .first();

    if (analytics) {
      await ctx.db.delete(analytics._id);
    }

    // Delete tour
    await ctx.db.delete(tourId);

    return { success: true };
  },
});

// Add/Update steps
export const saveSteps = mutation({
  args: {
    tourId: v.id("tours"),
    steps: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, { tourId, steps }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const tour = await ctx.db.get(tourId);
    if (!tour || tour.userId !== userId) {
      throw new Error("Tour not found");
    }

    // Delete existing steps
    const existingSteps = await ctx.db
      .query("tourSteps")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .collect();

    for (const step of existingSteps) {
      await ctx.db.delete(step._id);
    }

    // Insert new steps
    for (const step of steps) {
      await ctx.db.insert("tourSteps", {
        tourId,
        stepId: step.id,
        title: step.title,
        description: step.description,
        order: step.order,
      });
    }

    return { success: true };
  },
});

// Track tour event (for analytics)
export const trackEvent = mutation({
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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("tourEvents", {
      ...args,
      timestamp: Date.now(),
    });

    // Update analytics
    const analytics = await ctx.db
      .query("tourAnalytics")
      .withIndex("by_tour", (q) => q.eq("tourId", args.tourId))
      .first();

    if (analytics) {
      const updates: {
        lastUpdated: number;
        views?: number;
        completions?: number;
        avgCompletionRate?: number;
        skips?: number;
      } = { lastUpdated: Date.now() };

      if (args.eventType === "view") {
        updates.views = analytics.views + 1;
      } else if (args.eventType === "complete") {
        updates.completions = analytics.completions + 1;
        updates.avgCompletionRate =
          ((analytics.completions + 1) / (analytics.views + 1)) * 100;
      } else if (args.eventType === "skip") {
        updates.skips = analytics.skips + 1;
      }

      await ctx.db.patch(analytics._id, updates);
    }

    return { success: true };
  },
});