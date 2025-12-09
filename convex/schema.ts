// convex/schema.ts
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // Tours table
  tours: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  // Tour steps table
  tourSteps: defineTable({
    tourId: v.id("tours"),
    stepId: v.string(), // Custom ID like "step-123456"
    title: v.string(),
    description: v.string(),
    order: v.number(),
    // Optional: element selectors for highlighting
    targetSelector: v.optional(v.string()),
    // Optional: positioning
    position: v.optional(v.union(
      v.literal("top"),
      v.literal("bottom"),
      v.literal("left"),
      v.literal("right"),
      v.literal("center")
    )),
  })
    .index("by_tour", ["tourId"])
    .index("by_tour_order", ["tourId", "order"]),

  // Tour analytics table
  tourAnalytics: defineTable({
    tourId: v.id("tours"),
    views: v.number(),
    completions: v.number(),
    skips: v.number(),
    avgCompletionRate: v.number(),
    // Track weekly/monthly stats
    weeklyViews: v.optional(v.array(v.number())), // Last 7 days
    weeklyCompletions: v.optional(v.array(v.number())), // Last 7 days
    lastUpdated: v.number(),
  })
    .index("by_tour", ["tourId"]),

  // Tour events/interactions (for detailed analytics)
  tourEvents: defineTable({
    tourId: v.id("tours"),
    eventType: v.union(
      v.literal("view"),
      v.literal("start"),
      v.literal("complete"),
      v.literal("skip"),
      v.literal("step_view")
    ),
    stepId: v.optional(v.string()),
    sessionId: v.optional(v.string()), // To track unique sessions
    timestamp: v.number(),
    // Optional: User info if authenticated
    visitorId: v.optional(v.string()),
  })
    .index("by_tour", ["tourId"])
    .index("by_tour_date", ["tourId", "timestamp"])
    .index("by_session", ["sessionId"]),

  // User settings/preferences
  userSettings: defineTable({
    userId: v.id("users"),
    // Notification preferences
    emailNotifications: v.boolean(),
    weeklyReport: v.boolean(),
    // Widget defaults
    defaultShowAvatar: v.boolean(),
    defaultAutoStart: v.boolean(),
    // Theme
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Tour embed configurations (for different domains/websites)
  tourEmbeds: defineTable({
    tourId: v.id("tours"),
    userId: v.id("users"),
    domain: v.string(),
    // Customization options
    primaryColor: v.optional(v.string()),
    showAvatar: v.boolean(),
    autoStart: v.boolean(),
    allowSkip: v.boolean(),
    // Tracking
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_tour", ["tourId"])
    .index("by_user", ["userId"])
    .index("by_domain", ["domain"]),
});

export default schema;