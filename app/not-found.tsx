import Link from 'next/link';

import { ArrowLeft, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// app/not-found.tsx or pages/404.tsx for Pages Router

// app/not-found.tsx or pages/404.tsx for Pages Router

// app/not-found.tsx or pages/404.tsx for Pages Router

// app/not-found.tsx or pages/404.tsx for Pages Router

export default function NotFound() {
  return (
    <div className="bg-background flex h-full items-center justify-center px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="py-10">
          <h1 className="text-foreground text-6xl font-bold">404</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Oops! The page you’re looking for doesn’t exist.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild variant="default">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="mailto:prayashpriyansu27@gmail.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
