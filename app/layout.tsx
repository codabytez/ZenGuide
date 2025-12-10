import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { ConvexProviderWrapper } from "@/context/convex-provider";
import { ThemeProvider } from "@/context/theme-provider";
import { ToursProvider } from "@/context/ToursContext";
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
    icons: {
    icon: [
      { url: './images/image.png' },
    ],
    shortcut: ['/images/image.png'],
    apple: [
      { url: '/images/image.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexProviderWrapper>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <html lang="en" suppressHydrationWarning>
              <body className={`${poppins.variable} font-sans antialiased`}>
                <ToursProvider>
                  {children}
                </ToursProvider>
                <Toaster />
                <Sonner richColors />
              </body>
            </html>
          </ThemeProvider>
        </AuthProvider>
      </ConvexProviderWrapper>
    </ConvexAuthNextjsServerProvider>
  );
}
