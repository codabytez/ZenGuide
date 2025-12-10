// app/(auth)/layout.tsx

import { AuthProvider } from "@/context/auth-context";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
