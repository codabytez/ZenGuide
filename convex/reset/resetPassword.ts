import { mutation } from "../_generated/server";
import bcrypt from "bcryptjs";

export default mutation(async ({ db }, { email, newPassword }) => {
  const user = await db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .first();

  if (!user) throw new Error("User not found");

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.patch(user._id, { passwordHash });

  const codes = await db
    .query("resetCodes")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();

  for (const c of codes) {
    await db.delete(c._Id);
  }

  return { ok: true };
});
