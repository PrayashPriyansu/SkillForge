'use client';

import { useAuthActions } from '@convex-dev/auth/react';

import { Button } from '@/components/ui/button';

export function LoginForm() {
  const { signIn } = useAuthActions();
  return (
    <div className="border-border bg-background mx-auto flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border p-8 shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to SkillForge
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in with your Google account to continue
        </p>
      </div>

      <Button
        variant="outline"
        className="flex w-full items-center justify-center gap-2"
        onClick={() => void signIn('google', { redirectTo: '/groups' })}
      >
        <GoogleIcon className="h-5 w-5" />
        Sign in with Google
      </Button>

      <p className="text-muted-foreground max-w-xs text-center text-xs">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

// Google logo SVG component
function GoogleIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M533.5 278.4c0-17.6-1.6-35-4.7-51.6H272v97.7h146.9c-6.3 34.1-25.5 62.9-54.4 82.3v68.2h87.9c51.3-47.3 81.1-117.1 81.1-196.6z"
        fill="#4285f4"
      />
      <path
        d="M272 544.3c73.4 0 135-24.4 180-66.2l-87.9-68.2c-24.4 16.5-55.5 26-92.1 26-70.8 0-130.8-47.8-152.4-112.1h-89.7v70.7c45.1 89 137.6 149.8 242.1 149.8z"
        fill="#34a853"
      />
      <path
        d="M119.6 323.8c-10.2-30.3-10.2-63.5 0-93.8V159.3H29.9c-37.9 74.6-37.9 162.1 0 236.7l89.7-70.7z"
        fill="#fbbc04"
      />
      <path
        d="M272 107.1c39.8 0 75.6 13.7 103.7 40.8l77.6-77.6C407 24.2 345.4 0 272 0 167.6 0 75.1 60.8 29.9 159.3l89.7 70.7c21.6-64.3 81.6-112.1 152.4-112.1z"
        fill="#ea4335"
      />
    </svg>
  );
}
