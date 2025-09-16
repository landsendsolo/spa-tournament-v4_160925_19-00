"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    // Display a placeholder while the session is loading
    return <div className="h-10 w-24 bg-gray-800 rounded-md animate-pulse" />;
  }

  if (user) {
    return (
      <Button
        onClick={() => signOut()}
        variant="ghost"
        className="text-gray-200 hover:bg-gray-800 hover:text-white"
      >
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      className="text-gray-200 hover:bg-gray-800 hover:text-white"
    >
      <Link href="/signin">
        <LogIn className="mr-2 h-4 w-4" /> Sign In
      </Link>
    </Button>
  );
}
