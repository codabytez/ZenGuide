import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // PASSWORD RESET OTP STORAGE
  passwordResets: defineTable({
    email: v.string(),
    otp: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // USERS
  users: defineTable({
    email: v.string(),
    passwordHash: v.optional(v.string()),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("email", ["email"]),

  // TOURS
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

  // TOUR STEPS
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

  // SETTINGS
  userSettings: defineTable({
    userId: v.id("users"),
    emailNotifications: v.boolean(),
    weeklyReport: v.boolean(),
    defaultShowAvatar: v.boolean(),
    defaultAutoStart: v.boolean(),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});

export default schema;
