import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  // Built-in Convex Auth users table
  ...authTables,

  // Password storage mapped to Convex Auth user IDs
  userPasswords: defineTable({
    userId: v.id("users"),
    passwordHash: v.string(),
  }).index("by_user", ["userId"]),

  // OTP reset codes
  resetCodes: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
  }).index("by_email", ["email"]),

  // --------------------------
  // Tours table
  // --------------------------
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

  // Tour steps
  tourSteps: defineTable({
    tourId: v.id("tours"),
    stepId: v.string(),
    title: v.string(),
    description: v.string(),
    order: v.number(),
    targetSelector: v.optional(v.string()),
    position: v.optional(
      v.union(
        v.literal("top"),
        v.literal("bottom"),
        v.literal("left"),
        v.literal("right"),
        v.literal("center")
      )
    ),
  })
    .index("by_tour", ["tourId"])
    .index("by_tour_order", ["tourId", "order"]),

  // Analytics
  tourAnalytics: defineTable({
    tourId: v.id("tours"),
    views: v.number(),
    completions: v.number(),
    skips: v.number(),
    avgCompletionRate: v.number(),
    weeklyViews: v.optional(v.array(v.number())),
    weeklyCompletions: v.optional(v.array(v.number())),
    lastUpdated: v.number(),
  }).index("by_tour", ["tourId"]),

  // Events
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
    sessionId: v.optional(v.string()),
    timestamp: v.number(),
    visitorId: v.optional(v.string()),
  })
    .index("by_tour", ["tourId"])
    .index("by_tour_date", ["tourId", "timestamp"])
    .index("by_session", ["sessionId"]),

  // User settings
  userSettings: defineTable({
    userId: v.id("users"),
    emailNotifications: v.boolean(),
    weeklyReport: v.boolean(),
    defaultShowAvatar: v.boolean(),
    defaultAutoStart: v.boolean(),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Embeds
  tourEmbeds: defineTable({
    tourId: v.id("tours"),
    userId: v.id("users"),
    domain: v.string(),
    primaryColor: v.optional(v.string()),
    showAvatar: v.boolean(),
    autoStart: v.boolean(),
    allowSkip: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_tour", ["tourId"])
    .index("by_user", ["userId"])
    .index("by_domain", ["domain"]),
});

export default schema;
