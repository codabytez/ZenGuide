import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: { email: v.string(), newPasswordHash: v.string() },
  handler: async ({ db }, { email, newPasswordHash }) => {
    // ensure user exists
    const user = await db.query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("User not found");

    // store hashed password on user record
    // Note: Convex Auth manages users; modifying users created by authTables may differ by setup.
    // We patch the user document with a passwordHash field for your custom auth flow.
    await db.patch(user._id, { passwordHash: newPasswordHash });

    // delete any leftover OTPs
    const codes = await db.query("resetCodes")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    for (const c of codes) {
      await db.delete(c._id);
    }

    return { ok: true };
  },
});
