'use client';
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/react/next";
import { ConvexProvider } from "convex/react";
import { api } from "@/convex/_generated/api";

export const ConvexAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConvexAuthNextjsProvider>
      <ConvexProvider {...api}>
        {children}
      </ConvexProvider>
    </ConvexAuthNextjsProvider>
  );
};
