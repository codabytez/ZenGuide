// convex/userSettings.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current user info
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user;
  },
});

// Get user settings
export const getUserSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    // Return default settings if none exist
    if (!settings) {
      return {
        emailNotifications: true,
        weeklyReport: true,
        defaultShowAvatar: true,
        defaultAutoStart: true,
        theme: "light" as const,
      };
    }

    return settings;
  },
});

// Initialize or update user settings
export const saveUserSettings = mutation({
  args: {
    emailNotifications: v.optional(v.boolean()),
    weeklyReport: v.optional(v.boolean()),
    defaultShowAvatar: v.optional(v.boolean()),
    defaultAutoStart: v.optional(v.boolean()),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
  },
  handler: async (ctx, updates) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingSettings) {
      // Update existing settings
      await ctx.db.patch(existingSettings._id, {
        ...updates,
        updatedAt: Date.now(),
      });
      return existingSettings._id;
    } else {
      // Create new settings
      return await ctx.db.insert("userSettings", {
        userId,
        emailNotifications: updates.emailNotifications ?? true,
        weeklyReport: updates.weeklyReport ?? true,
        defaultShowAvatar: updates.defaultShowAvatar ?? true,
        defaultAutoStart: updates.defaultAutoStart ?? true,
        theme: updates.theme,
        updatedAt: Date.now(),
      });
    }
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, { name, email }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const updates: { name?: string; email?: string } = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;

    await ctx.db.patch(userId, updates);

    return { success: true };
  },
});