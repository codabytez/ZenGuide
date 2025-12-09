import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { email, code }) => {
  const entry = await db
    .query("resetCodes")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();

  if (!entry) throw new Error("No reset request found.");
  if (entry.code !== code) throw new Error("Invalid OTP.");
  if (Date.now() > entry.expiresAt) throw new Error("OTP expired.");

  return { ok: true };
});
