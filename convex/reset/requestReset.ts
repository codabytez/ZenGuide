import { mutation } from "../_generated/server";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default mutation(async ({ db }, { email }) => {
  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  const existing = await db
    .query("resetCodes")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();

  for (const e of existing) {
    await db.delete(e._id);
  }

  await db.insert("resetCodes", { email, code: otp, expiresAt });

  console.log("OTP for", email, "=>", otp);

  return { ok: true };
});
