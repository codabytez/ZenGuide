import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// SEND OTP
export const requestReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const existing = await ctx.db
      .query("passwordResets")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { otp, createdAt: Date.now() });
    } else {
      await ctx.db.insert("passwordResets", {
        email,
        otp,
        createdAt: Date.now(),
      });
    }

    console.log("OTP:", otp);
    return { success: true };
  },
});

// VERIFY OTP
export const verifyOtp = query({
  args: { email: v.string(), otp: v.string() },
  handler: async (ctx, { email, otp }) => {
    const entry = await ctx.db
      .query("passwordResets")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!entry) return { valid: false };
    return { valid: entry.otp === otp };
  },
});

// RESET PASSWORD
export const resetPassword = mutation({
  args: { email: v.string(), newPassword: v.string() },
  handler: async (ctx, { email, newPassword }) => {
    const bcrypt = (await import("bcryptjs")).default;

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("User not found");

    const hash = await bcrypt.hash(newPassword, 10);

    await ctx.db.patch(user._id, { passwordHash: hash });

    return { success: true };
  },
});
