import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';

import ConvexClientProvider from '@/components/providers/convex-provider';
import { GlobalStoreProvider } from '@/components/providers/store-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next-Start',
  description: 'Template to start your next project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} h-dvh max-h-dvh w-dvw max-w-dvw overflow-x-hidden antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <GlobalStoreProvider>{children}</GlobalStoreProvider>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}