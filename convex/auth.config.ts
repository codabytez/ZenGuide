import { query } from "./_generated/server";
import { v } from "convex/values";

/* -----------------------------
   Default empty analytics shape
------------------------------ */
const emptyAnalytics = {
  overview: {
    totalViews: 0,
    totalCompletions: 0,
    totalSkips: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
  },
  stepMetrics: [],
  dailyBreakdown: [],
};

/* -------------------------------------------------------
   GET ANALYTICS FOR A SINGLE TOUR
------------------------------------------------------- */
export const getTourAnalytics = query({
  args: {
    tourId: v.id("tours"),
    timeRange: v.union(v.literal("24h"), v.literal("7d"), v.literal("30d")),
  },

  async handler({ db }, { tourId, timeRange }) {
    const now = Date.now();

    const ranges: Record<string, number> = {
      "24h": now - 24 * 60 * 60 * 1000,
      "7d": now - 7 * 24 * 60 * 60 * 1000,
      "30d": now - 30 * 24 * 60 * 60 * 1000,
    };

    const since = ranges[timeRange];

    /* ------------------------------
       EVENTS (views, completions, skips)
    ------------------------------ */
    const views = await db
      .query("tourViews")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .filter((q) => q.gte(q.field("timestamp"), since))
      .collect();

    const completions = await db
      .query("tourCompletions")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .filter((q) => q.gte(q.field("timestamp"), since))
      .collect();

    const skips = await db
      .query("tourSkips")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .filter((q) => q.gte(q.field("timestamp"), since))
      .collect();

    /* ------------------------------
       STEP EVENTS
    ------------------------------ */
    const stepEvents = await db
      .query("tourStepEvents")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .filter((q) => q.gte(q.field("timestamp"), since))
      .collect();

    /* ------------------------------
       OVERVIEW
    ------------------------------ */
    const overview = {
      totalViews: views.length,
      totalCompletions: completions.length,
      totalSkips: skips.length,
      uniqueVisitors: new Set(views.map((v) => v.userId)).size,
      avgSessionDuration: 0,
    };

    /* ------------------------------
       DAILY BREAKDOWN
    ------------------------------ */
    const dailyBreakdown = [];
    const byDay = (t: number) => new Date(t).toISOString().split("T")[0];

    const map: Record<string, { views: number; completions: number }> = {};

    for (const v of views) {
      const d = byDay(v.timestamp);
      map[d] = map[d] || { views: 0, completions: 0 };
      map[d].views++;
    }

    for (const c of completions) {
      const d = byDay(c.timestamp);
      map[d] = map[d] || { views: 0, completions: 0 };
      map[d].completions++;
    }

    for (const d of Object.keys(map)) {
      dailyBreakdown.push({
        date: d,
        views: map[d].views,
        completions: map[d].completions,
      });
    }

    /* ------------------------------
       STEP METRICS
    ------------------------------ */
    const stepMetricsMap: Record<
      string,
      { stepId: string; views: number; completions: number }
    > = {};

    for (const evt of stepEvents) {
      stepMetricsMap[evt.stepId] = stepMetricsMap[evt.stepId] || {
        stepId: evt.stepId,
        views: 0,
        completions: 0,
      };

      if (evt.type === "view") stepMetricsMap[evt.stepId].views++;
      if (evt.type === "complete") stepMetricsMap[evt.stepId].completions++;
    }

    const stepMetrics = Object.values(stepMetricsMap);

    return {
      overview,
      stepMetrics,
      dailyBreakdown,
    };
  },
});

/* -------------------------------------------------------
   FUNNEL ANALYSIS
------------------------------------------------------- */
export const getFunnelAnalysis = query({
  args: { tourId: v.id("tours") },

  async handler({ db }, { tourId }) {
    const stepEvents = await db
      .query("tourStepEvents")
      .withIndex("by_tour", (q) => q.eq("tourId", tourId))
      .collect();

    const funnel: Record<
      string,
      { stepId: string; title: string; viewed: number }
    > = {};

    for (const evt of stepEvents) {
      funnel[evt.stepId] = funnel[evt.stepId] || {
        stepId: evt.stepId,
        title: evt.stepTitle ?? "Step",
        viewed: 0,
      };

      if (evt.type === "view") funnel[evt.stepId].viewed++;
    }

    return Object.values(funnel);
  },
});
