import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  //
  // USERS
  //
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
  }).index("email", ["email"]),

  //
  // PASSWORD RESET CODES
  //
  resetCodes: defineTable({
    email: v.string(),
    otp: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  //
  // TOURS
  //
  tours: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),

    steps: v.array(
      v.object({
        id: v.string(),
        content: v.string(),
        order: v.number(),
      })
    ),

    isPublished: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_title", ["title"]),

  //
  // ANALYTICS SUMMARY TABLE
  //
  tourAnalytics: defineTable({
    tourId: v.id("tours"),
    userId: v.id("users"),

    views: v.number(),
    completions: v.number(),

    timestamp: v.number(),
  })
    .index("by_tour", ["tourId"])
    .index("by_user", ["userId"])
    .index("by_tour_time", ["tourId", "timestamp"]),

  //
  // RAW VIEW EVENTS (needed by backend analytics engine)
  //
  tourViews: defineTable({
    tourId: v.id("tours"),
    userId: v.id("users"),
    timestamp: v.number(),
  }).index("by_tour", ["tourId"]),

  //
  // RAW COMPLETION EVENTS
  //
  tourCompletions: defineTable({
    tourId: v.id("tours"),
    userId: v.id("users"),
    timestamp: v.number(),
  }).index("by_tour", ["tourId"]),

  //
  // RAW SKIP EVENTS
  //
  tourSkips: defineTable({
    tourId: v.id("tours"),
    userId: v.id("users"),
    timestamp: v.number(),
  }).index("by_tour", ["tourId"]),

  //
  // STEP-LEVEL EVENTS (for funnel + step metrics)
  //
  tourStepEvents: defineTable({
    tourId: v.id("tours"),
    stepId: v.string(),
    stepTitle: v.string(),
    type: v.union(v.literal("view"), v.literal("complete")),
    timestamp: v.number(),
  }).index("by_tour", ["tourId"]),
});
