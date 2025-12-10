import { mutation } from "../_generated/server";
import { v } from "convex/values";
import crypto from "crypto";

export default mutation({
  args: { email: v.string() },
  handler: async ({ db }, { email }) => {
    // secure 6-digit OTP
    const code = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // remove previous codes for this email
    const previous = await db.query("resetCodes")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    for (const p of previous) {
      await db.delete(p._id);
    }

    await db.insert("resetCodes", {
      email,
      code,
      expiresAt,
      createdAt: Date.now(),
    });

    // Do NOT log OTP in production
    if (process.env.NODE_ENV === "development") {
      console.log("OTP for", email, code);
    }

    // TODO: call an email-sending service (Resend/SendGrid) here to deliver code.
    return { ok: true };
  },
});
