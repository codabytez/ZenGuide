"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import crypto from "crypto";
import { Resend } from "resend";

const OTP_EXPIRY_MS = 10 * 60 * 1000;

export const requestResetAction = action({
  args: { email: v.string() },
  async handler(ctx, { email }) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    await ctx.runMutation("reset.storeOtp", {
      email,
      otp,
      expiresAt,
    });

    const resend = new Resend(ctx.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "ZenGuide <no-reply@yourdomain.com>",
      to: email,
      subject: "Your Password Reset Code",
      html: `<h2>${otp}</h2><p>Valid for 10 minutes.</p>`,
    });

    return { ok: true };
  },
});
