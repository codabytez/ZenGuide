import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const storeOtp = mutation({
  args: {
    email: v.string(),
    otp: v.string(),
    expiresAt: v.number(),
  },
  async handler(ctx, { email, otp, expiresAt }) {
    const db = ctx.db;

    const existing = await db
      .query("resetCodes")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    for (const item of existing) {
      await db.delete(item._id);
    }

    await db.insert("resetCodes", {
      email,
      otp,
      expiresAt,
      createdAt: Date.now(),
    });

    return { ok: true };
  },
});
