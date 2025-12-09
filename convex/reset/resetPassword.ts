import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { email, newPassword }) => {
  const bcrypt = (await import("bcryptjs")).default;

  const user = await db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .first();

  if (!user) throw new Error("User not found");

  const passwordHash = await bcrypt.hash(newPassword, 10);

  const existingPass = await db
    .query("userPasswords")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .first();

  if (existingPass) {
    await db.patch(existingPass._id, { passwordHash });
  } else {
    await db.insert("userPasswords", { userId: user._id, passwordHash });
  }

  const codes = await db
    .query("resetCodes")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();

  for (const c of codes) {
    await db.delete(c._id);
  }

  return { ok: true };
});
