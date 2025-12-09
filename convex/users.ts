import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Check email exists
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

// Fetch user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
  },
});

// Store/update password hash
export const setPasswordHash = mutation({
  args: { userId: v.id("users"), passwordHash: v.string() },
  handler: async (ctx, { userId, passwordHash }) => {
    const existing = await ctx.db
      .query("userPasswords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, { passwordHash });
    }

    return await ctx.db.insert("userPasswords", {
      userId,
      passwordHash,
    });
  },
});

// Get stored password hash
export const getPasswordHash = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("userPasswords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});
