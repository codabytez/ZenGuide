import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user by email (returns the user document but avoid exposing passwordHash to clients)
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // return user document for server-side mutations; calling from client should be limited
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
  },
});

// Server-side helper to set passwordHash (should be used by server mutations only)
export const setPasswordHash = mutation({
  args: { userId: v.id("users"), passwordHash: v.string() },
  handler: async (ctx, { userId, passwordHash }) => {
    // If you have Convex Auth in place, ensure caller is authorized to update this user
    await ctx.db.patch(userId, { passwordHash });
    return { ok: true };
  },
});
