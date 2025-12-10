import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

//
// 1️⃣ GET ALL TOURS FOR LOGGED-IN USER
//
export const getUserTours = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    return await ctx.db
      .query("tours")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

//
// 2️⃣ LIST TOURS BY USER ID
//
export const listTours = query({
  args: { userId: v.id("users") },
  async handler(ctx, { userId }) {
    return await ctx.db
      .query("tours")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

//
// 3️⃣ GET SPECIFIC TOUR
//
export const getTour = query({
  args: { tourId: v.id("tours") },
  async handler(ctx, { tourId }) {
    return await ctx.db.get(tourId);
  },
});

//
// 4️⃣ CREATE TOUR
//
export const createTour = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string())
  },
  async handler(ctx, { userId, title, description }) {
    const now = Date.now();

    return await ctx.db.insert("tours", {
      userId,
      title,
      description: description ?? "",
      steps: [],
      isPublished: false,
      createdAt: now,
      updatedAt: now
    });
  },
});

//
// 5️⃣ UPDATE TOUR
//
export const updateTour = mutation({
  args: {
    tourId: v.id("tours"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    steps: v.optional(
      v.array(
        v.object({
          id: v.string(),
          content: v.string(),
          order: v.number()
        })
      )
    ),
    isPublished: v.optional(v.boolean())
  },
  async handler(ctx, args) {
    const { tourId, ...patch } = args;

    return await ctx.db.patch(tourId, {
      ...patch,
      updatedAt: Date.now()
    });
  },
});

//
// 6️⃣ DELETE TOUR
//
export const deleteTour = mutation({
  args: { tourId: v.id("tours") },
  async handler(ctx, { tourId }) {
    await ctx.db.delete(tourId);
    return true;
  },
});

//
// 7️⃣ TOUR ANALYTICS
//
export const getTourAnalytics = query({
  args: {
    tourId: v.id("tours"),
    timeRange: v.string()
  },
  async handler(ctx, { tourId, timeRange }) {
    const now = Date.now();

    let range = 7 * 24 * 60 * 60 * 1000;
    if (timeRange === "30d") range = 30 * 24 * 60 * 60 * 1000;
    if (timeRange === "24h") range = 24 * 60 * 60 * 1000;

    const since = now - range;

    return await ctx.db
      .query("tourAnalytics")
      .withIndex("by_tour_time", (q) =>
        q.eq("tourId", tourId).gte("timestamp", since)
      )
      .collect();
  }
});
