'use client';
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import {  ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
};