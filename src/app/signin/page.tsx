"use client";
import { useState, useEffect } from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Eye, EyeOff, Home } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const result = await signIn("credentials", {
      redirect: false, // Keep this as false to handle errors on this page
      login,
      password,
    });

    if (result?.error) {
      setError("Invalid login or password");
    } else if (result?.ok) {
      // THE FIX:
      // 1. Invalidate the cache to get fresh server data, including the new session.
      router.refresh();
      // 2. Navigate the user to the homepage.
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your registered mobile number, email, or admin credentials to
            sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="csrfToken" type="hidden" value={csrfToken ?? ""} />
            <div className="space-y-2">
              <Label htmlFor="login">Mobile Number or Email</Label>
              <Input
                id="login"
                name="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="e.g., 07000000000 or your-email@example.com"
                required
                autoCapitalize="none"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={!csrfToken || !login || !password}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
          <div className="mt-4 border-t pt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
