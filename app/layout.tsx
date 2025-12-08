import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { ToursProvider } from "@/context/ToursContext";
import { ConvexProviderWrapper } from "@/context/convex-provider";


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
    <ConvexProviderWrapper>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system">
              <html lang="en" suppressHydrationWarning>
                <body className={`${poppins.variable} font-sans antialiased`}>
                      <ToursProvider>
                        {children}
                      </ToursProvider>
                      <Toaster />
                </body>
              </html>
            </ThemeProvider>
          </AuthProvider>
    </ConvexProviderWrapper>
  );
}
