"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexProvider } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ConvexProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthProvider>
      <ConvexProvider client={api}>
        {children}
      </ConvexProvider>
    </ConvexAuthProvider>
  );
}
