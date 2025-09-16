'use client';
import { useState, useTransition, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerPlayer, ActionState } from '@/app/actions/registrationActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Home } from 'lucide-react';
import Link from 'next/link';

const initialState: ActionState = { error: '' };

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(registerPlayer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/signin');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Player Registration</CardTitle>
          <CardDescription>Register your account to access the tournament.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="As it appears in the draw" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" name="mobile" type="tel" placeholder="e.g., 07123456789" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Registration Code - Request in WhatsApp Group</Label>
              <Input id="code" name="code" placeholder="Your unique 6-character code" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            {state.success && <p className="text-sm text-primary">{state.success}</p>}
            <Button type="submit" className="w-full" disabled={isPending || !!state.success}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {state.success ? 'Redirecting...' : isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already registered?{' '}
            <Link href="/signin" className="underline">
              Sign In
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
