import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-context";
import { ConvexProviderWrapper } from "@/context/convex-provider";
import { ThemeProvider } from "@/context/theme-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { TourProvider } from "@/contexts/TourContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "ZenGuide Onboarding Tour Platform",
  description:
    "An interactive platform to guide users through onboarding tours seamlessly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ConvexAuthNextjsServerProvider>
          <ConvexProviderWrapper>
            <AuthProvider>
              <ThemeProvider attribute="class" defaultTheme="system">
                <TourProvider>
                  {children}
                </TourProvider>

                <Toaster />
                <Sonner richColors />
              </ThemeProvider>
            </AuthProvider>
          </ConvexProviderWrapper>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
