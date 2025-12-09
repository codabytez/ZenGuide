import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Check if email already exists
export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    return existingUser !== null;
  },
});