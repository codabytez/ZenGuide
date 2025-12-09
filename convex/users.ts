import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Check if a user with this email exists
 * (Uses Convex Auth built-in users table)
 */
export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    return user !== null;
  },
});

/**
 * Get user by email
 * Needed for login and OTP reset flow
 */
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
  },
});

/**
 * Store hashed password in the userPasswords table
 * (Convex Auth users table cannot be modified directly)
 */
export const setPasswordHash = mutation({
  args: {
    userId: v.id("users"),
    passwordHash: v.string(),
  },
  handler: async (ctx, { userId, passwordHash }) => {
    // Check for existing password for this user
    const existing = await ctx.db
      .query("userPasswords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      // Update password
      await ctx.db.patch(existing._id, { passwordHash });
    } else {
      // Create password entry
      await ctx.db.insert("userPasswords", { userId, passwordHash });
    }
  },
});

/**
 * Get password hash for login
 */
export const getPasswordHash = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("userPasswords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});
