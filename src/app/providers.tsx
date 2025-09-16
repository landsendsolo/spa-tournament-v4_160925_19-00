"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth"; // Import the Session type
import { ThemeProvider } from "@/components/theme-provider";
import { AppHeader } from "@/components/AppHeader";
import { Toaster } from "react-hot-toast";

// Update the props to use the imported Session type
export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        themes={["light", "dark", "powder", "match", "green", "blue"]}
        disableTransitionOnChange
      >
        <Toaster position="bottom-center" />
        <AppHeader />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </ThemeProvider>
    </SessionProvider>
  );
}
