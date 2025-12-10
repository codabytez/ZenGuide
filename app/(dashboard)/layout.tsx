"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      {/* Show loading spinner while checking auth */}
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AuthLoading>

      {/* Redirect to login if not authenticated */}
      <Unauthenticated>
        <RedirectToLogin />
      </Unauthenticated>

      {/* Show dashboard if authenticated */}
      <Authenticated>
        <div className="flex h-screen overflow-hidden bg-background">
       <DashboardSidebar />
       <main className="flex-1 overflow-auto md:ml-0">
         {children}
       </main>
     </div>
      </Authenticated>
    </>
  );
}

// Separate component for redirect to avoid hooks issues
function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );
}