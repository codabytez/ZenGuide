import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { email, code }) => {
  const row = await db
    .query("resetCodes")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();

  if (!row) throw new Error("No OTP found");
  if (row.code !== code) throw new Error("Invalid OTP");
  if (Date.now() > row.expiresAt) throw new Error("OTP expired");

  return { ok: true };
});
