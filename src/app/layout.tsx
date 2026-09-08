import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { MotionConfig } from 'motion/react';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from 'next/font/google';
import { ViewTransition } from 'react';

import { ExternalLink } from '~/components/external-link';
import { NavLink } from '~/components/nav-link';
import { ThemeToggle } from '~/components/theme-toggle';
import { Toaster } from '~/components/ui/sonner';
import { SourceLink } from '~/features/github/components/source-link';
import { BASE_URL } from '~/lib/constants';
import { cn } from '~/lib/utils';

import backgroundStyles from './page-background.module.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

const siteTitle = 'Nikhil S';
const siteDescription =
  'Things I build, questions I keep coming back to, and what I learn along the way.';

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: '%s | Nikhil S',
  },
  description: siteDescription,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: BASE_URL,
    siteName: 'Nikhil S',
    locale: 'en_IN',
    type: 'website',
  },
  authors: [{ name: 'Nikhil S', url: BASE_URL }],
  alternates: {
    types: {
      'application/rss+xml': `${BASE_URL}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteTitle,
    card: 'summary_large_image',
    creator: '@_nikhilsnayak_',
    description: siteDescription,
    site: BASE_URL,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Nikhil S — things I build and what I learn along the way.',
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <ViewTransition>
      <html lang='en' suppressHydrationWarning className='styled-scrollbar bg-background h-full'>
        <body
          className={cn(
            geistSans.variable,
            geistMono.variable,
            'bg-background text-foreground relative font-sans antialiased',
          )}
        >
          <div id='root' className={cn(backgroundStyles.background, 'flex min-h-dvh flex-col')}>
            <ThemeProvider
              attribute='class'
              defaultTheme='dark'
              enableSystem
              disableTransitionOnChange
            >
              <MotionConfig reducedMotion='user'>
                <Toaster richColors />
                <header className='site-width'>
                  <nav
                    aria-label='Main navigation'
                    className='flex items-center justify-end py-8 sm:py-10'
                  >
                    <a
                      href='#main-content'
                      className='focus-ring bg-background sr-only focus:not-sr-only focus:absolute focus:top-2 focus:z-50 focus:p-2'
                    >
                      Skip to content
                    </a>
                    <ul className='flex items-center gap-7'>
                      <li>
                        <NavLink href='/'>home</NavLink>
                      </li>
                      <li>
                        <NavLink href='/blog'>writing</NavLink>
                      </li>
                    </ul>
                  </nav>
                </header>
                <main
                  id='main-content'
                  tabIndex={-1}
                  className='site-width grow pt-12 pb-20 outline-none sm:pt-16 sm:pb-24'
                >
                  {children}
                </main>
                <footer className='site-width'>
                  <div className='border-border grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-4 border-t pt-5 pb-12 sm:gap-y-3 sm:py-7'>
                    <div className='text-muted-foreground col-span-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-xs sm:col-span-1 sm:justify-start sm:gap-x-5 [&_a]:inline-flex [&_a]:min-h-8 [&_a]:items-center'>
                      <a href='mailto:nikhilsrinivasnayak@gmail.com' className='text-link'>
                        email
                      </a>
                      <ExternalLink
                        href='https://github.com/nikhilsnayak'
                        className='text-link gap-1'
                      >
                        github
                      </ExternalLink>
                      <ExternalLink href='https://x.com/_nikhilsnayak_' className='text-link gap-1'>
                        x
                      </ExternalLink>
                      <ExternalLink
                        href='https://www.linkedin.com/in/nikhilsnayak/'
                        className='text-link gap-1'
                      >
                        linkedin
                      </ExternalLink>
                      <a href={`${BASE_URL}/rss.xml`} className='text-link'>
                        rss
                      </a>
                      <SourceLink />
                    </div>
                    <p className='text-muted-foreground order-3 col-span-2 text-xs leading-5 italic'>
                      design inspired by <span className='whitespace-nowrap'>Nothing OS</span>
                    </p>
                    <div className='col-span-2 flex items-center gap-2 justify-self-end sm:col-span-1'>
                      <ThemeToggle />
                    </div>
                  </div>
                </footer>
              </MotionConfig>
            </ThemeProvider>
            <SpeedInsights />
            <Analytics />
          </div>
        </body>
      </html>
    </ViewTransition>
  );
}
