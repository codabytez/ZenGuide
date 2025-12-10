import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const resetPassword = mutation({
  args: { email: v.string(), newPassword: v.string() },
  async handler(ctx, { email, newPassword }) {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("User not found.");

    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash(newPassword, 10);

    await ctx.db.patch(user._id, { passwordHash: hash });

    const otpEntry = await ctx.db
      .query("resetCodes")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (otpEntry) {
      await ctx.db.delete(otpEntry._id);
    }

    return { success: true };
  },
});
