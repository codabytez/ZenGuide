import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // OTP reset codes table (used by reset flow)
  resetCodes: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    // Optional lockout/failure tracking could be added later:
    // failedAttempts: v.optional(v.number()),
    // lockoutUntil: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Keep other tables in your project untouched; Convex Auth provides users
  // Add additional tables only if needed.
});

export default schema;
