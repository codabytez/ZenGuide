import { v } from "convex/values";
import { mutation } from "./_generated/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const OTP_EXPIRY = 1000 * 60 * 10; // 10 minutes

// REQUEST PASSWORD RESET → generates OTP and emails it
export const requestReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();

    const existing = await ctx.db
      .query("passwordResets")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { otp, createdAt: now });
    } else {
      await ctx.db.insert("passwordResets", { email, otp, createdAt: now });
    }

    // Email sending
    await resend.emails.send({
      from: "Reset <no-reply@yourdomain.com>",
      to: email,
      subject: "Your Password Reset OTP",
      html: `<p>Your OTP is:</p><h2>${otp}</h2><p>Valid for 10 minutes.</p>`,
    });

    return { ok: true };
  },
});

// VERIFY OTP
export const verifyOtp = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, { email, code }) => {
    const entry = await ctx.db
      .query("passwordResets")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (!entry) throw new Error("No reset request found.");

    if (Date.now() - entry.createdAt > OTP_EXPIRY)
      throw new Error("OTP expired.");

    if (entry.otp !== code)
      throw new Error("Invalid OTP.");

    // OTP is consumed only after password reset, not verification
    return { verified: true };
  },
});

// RESET PASSWORD
export const resetPassword = mutation({
  args: { email: v.string(), newPassword: v.string() },
  handler: async (ctx, { email, newPassword }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", q => q.eq("email", email))
      .first();

    if (!user) throw new Error("User not found.");

    const hash = await bcrypt.hash(newPassword, 10);

    await ctx.db.patch(user._id, { passwordHash: hash });

    // Consume the OTP record so it can't be reused
    const resetEntry = await ctx.db
      .query("passwordResets")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (resetEntry) {
      await ctx.db.delete(resetEntry._id);
    }

    return { success: true };
  },
});
