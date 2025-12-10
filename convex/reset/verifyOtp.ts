import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const verifyOtp = mutation({
  args: { email: v.string(), otp: v.string() },
  async handler(ctx, { email, otp }) {
    const entry = await ctx.db
      .query("resetCodes")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!entry) throw new Error("No reset request found.");
    if (entry.expiresAt < Date.now()) throw new Error("OTP expired.");
    if (entry.otp !== otp) throw new Error("Invalid OTP.");

    return { verified: true };
  },
});
