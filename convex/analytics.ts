import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTourAnalytics = query({
  args: {
    tourId: v.id("tours"),
    timeRange: v.union(v.literal("24h"), v.literal("7d"), v.literal("30d")),
  },

  async handler(ctx, { tourId, timeRange }) {
    const db = ctx.db;

    const now = Date.now();
    const rangeMap = {
      "24h": now - 24 * 60 * 60 * 1000,
      "7d": now - 7 * 24 * 60 * 60 * 1000,
      "30d": now - 30 * 24 * 60 * 60 * 1000,
    };
    const startTime = rangeMap[timeRange];

    // Fetch view, completion, skip events
    const views = await db
      .query("tourViews")
      .withIndex("by_tour", q => q.eq("tourId", tourId))
      .collect();

    const completions = await db
      .query("tourCompletions")
      .withIndex("by_tour", q => q.eq("tourId", tourId))
      .collect();

    const skips = await db
      .query("tourSkips")
      .withIndex("by_tour", q => q.eq("tourId", tourId))
      .collect();

    // Filter by time window
    const viewsInRange = views.filter(v => v.timestamp >= startTime);
    const completionsInRange = completions.filter(v => v.timestamp >= startTime);
    const skipsInRange = skips.filter(v => v.timestamp >= startTime);

    // Build overview object expected by frontend
    const overview = {
      totalViews: viewsInRange.length,
      totalCompletions: completionsInRange.length,
      totalSkips: skipsInRange.length,
      uniqueVisitors: new Set(viewsInRange.map(v => v.userId)).size,
      avgSessionDuration: 0, // if you track durations, update this later
    };

    // Step-by-step analytics
    const allStepEvents = await db
      .query("tourStepEvents")
      .withIndex("by_tour", q => q.eq("tourId", tourId))
      .collect();

    const stepMetrics = Array.from(
      new Set(allStepEvents.map(e => e.stepId))
    ).map(stepId => {
      const events = allStepEvents.filter(e => e.stepId === stepId);
      return {
        stepId,
        title: events[0]?.stepTitle || "Untitled",
        views: events.filter(e => e.type === "view").length,
        completions: events.filter(e => e.type === "complete").length,
      };
    });

    // Daily breakdown (views + completions per day)
    const dailyBreakdown = [];
    const groupByDate = {};

    for (const v of viewsInRange) {
      const d = new Date(v.timestamp).toDateString();
      groupByDate[d] = groupByDate[d] || { date: d, views: 0, completions: 0 };
      groupByDate[d].views++;
    }

    for (const c of completionsInRange) {
      const d = new Date(c.timestamp).toDateString();
      groupByDate[d] = groupByDate[d] || { date: d, views: 0, completions: 0 };
      groupByDate[d].completions++;
    }

    for (const key in groupByDate) {
      dailyBreakdown.push(groupByDate[key]);
    }

    return {
      overview,
      stepMetrics,
      dailyBreakdown,
    };
  }
});
