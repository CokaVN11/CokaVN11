import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import appCss from '@/styles/globals.css?url';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title:
          'Khanh Nguyen - Full-Stack Developer | React & Next.js | Ho Chi Minh City',
      },
      {
        name: 'description',
        content:
          'Full-stack developer in Ho Chi Minh City, Vietnam. Building modern web applications with React, Next.js, Vue.js, and scalable backend systems. Available for freelance and remote projects.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <Outlet />
          </ThemeProvider>
        </TooltipProvider>
        <Toaster />
        <SpeedInsights />
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}