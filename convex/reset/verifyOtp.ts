import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: { email: v.string(), code: v.string() },
  handler: async ({ db }, { email, code }) => {
    const entry = await db.query("resetCodes")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!entry) throw new Error("No OTP found");
    if (Date.now() > entry.expiresAt) throw new Error("OTP expired");

    // constant-time comparison suggestion: not available here, but string compare is used
    if (entry.code !== code) {
      // optional: increment failed attempts / lockout logic here
      throw new Error("Invalid OTP");
    }

    // delete OTP after successful verification to prevent reuse
    await db.delete(entry._id);

    return { ok: true };
  },
});
