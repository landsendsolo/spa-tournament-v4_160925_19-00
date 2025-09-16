import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Trophy } from "lucide-react";
import { AuthButton } from "./AuthButton"; // Use the new component

export function AppHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-black text-gray-200 z-10">
      <Link
        href="/"
        className="text-lg font-bold flex items-center gap-2 hover:text-white transition-colors"
      >
        <Trophy className="text-primary h-5 w-5" />
        <span>SPA Tournament</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link
          href="/"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Home
        </Link>
        <Link
          href="/draw"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Tournament Draw
        </Link>
        <Link
          href="/matches"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Live Matches
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AuthButton />
      </div>
    </header>
  );
}
