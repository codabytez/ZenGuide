import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { ConvexProviderWrapper } from "@/context/convex-provider";
import { ThemeProvider } from "@/context/theme-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "ZenGuide Onboarding Tour Platform",
  description:
    "An interactive platform to guide users through onboarding tours seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} font-sans antialiased`}>
          <ConvexProviderWrapper>
            <AuthProvider>
              <ThemeProvider attribute="class" defaultTheme="system">
                {children}
                <Toaster />
                <Sonner richColors />
              </ThemeProvider>
            </AuthProvider>
          </ConvexProviderWrapper>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
