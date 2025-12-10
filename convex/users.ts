import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

/* =========================================
   GET CURRENT AUTHENTICATED USER
========================================= */
export const getCurrentUser = query(async ({ auth, db }) => {
  const identity = await auth.getUserIdentity();
  if (!identity) return null;

  // Lookup by email (unique index)
  const user = await db
    .query("users")
    .withIndex("email", (q) => q.eq("email", identity.email!))
    .first();

  return user;
});

/* =========================================
   CHECK IF EMAIL EXISTS (Signup validation)
========================================= */
export const checkEmailExists = query({
  args: { email: v.string() },
  async handler({ db }, { email }) {
    const user = await db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    return user !== null;
  },
});

/* =========================================
   CREATE USER (Signup)
========================================= */
export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  async handler({ db }, { email, password }) {
    const exists = await db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (exists) throw new Error("Email already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = await db.insert("users", {
      email,
      passwordHash,
    });

    return userId;
  },
});

/* =========================================
   LOGIN USER
========================================= */
export const loginUser = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  async handler({ db }, { email, password }) {
    const user = await db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) return null;

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return null;

    return user;
  },
});

/* =========================================
   RESET PASSWORD (Used after OTP verified)
========================================= */
export const updatePassword = mutation({
  args: {
    email: v.string(),
    newPassword: v.string(),
  },
  async handler({ db }, { email, newPassword }) {
    const user = await db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("User not found");

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.patch(user._id, { passwordHash });

    return { success: true };
  },
});
