import './globals.css';

import { ViewTransition } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SiGithub, SiX } from '@icons-pack/react-simple-icons';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from 'next-themes';

import { BASE_URL } from '~/lib/constants';
import { cn } from '~/lib/utils';
import { Toaster } from '~/components/ui/sonner';
import { NavLink } from '~/components/nav-link';
import { ThemeToggle } from '~/components/theme-toggle';
import { LanguageStats } from '~/features/github/components/language-stats';
import { LatestCommit } from '~/features/github/components/latest-commit';
import { SourceLink } from '~/features/github/components/source-link';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Nikhil S',
    template: '%s | Nikhil S',
  },
  description: 'Software Engineer from India',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'Nikhil S',
    description: 'Software Engineer from India',
    url: BASE_URL,
    siteName: 'Nikhil S',
    locale: 'en_IN',
    type: 'website',
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
    title: 'Nikhil S',
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <ViewTransition>
      <html lang='en' suppressHydrationWarning className='styled-scrollbar'>
        <body
          className={cn(
            geistSans.variable,
            geistMono.variable,
            'flex min-h-dvh flex-col font-sans'
          )}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors />
            <header className='w-full border-b shadow-xs'>
              <nav className='mx-auto flex max-w-(--breakpoint-lg) items-center justify-between p-4'>
                <a
                  href='#main-content'
                  className='sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:p-2'
                >
                  Skip to content
                </a>
                <ul className='flex gap-4'>
                  <li>
                    <NavLink href='/'>home</NavLink>
                  </li>
                  <li>
                    <NavLink href='/blog'>blog</NavLink>
                  </li>
                </ul>
                <ul className='flex items-center gap-3'>
                  <li className='border-r pr-3'>
                    <a
                      href='https://x.com/_nikhilsnayak_'
                      className='dark:text-theme hover:opacity-70'
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label='x.com'
                    >
                      <SiX className='size-4' />
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://github.com/nikhilsnayak'
                      className='dark:text-theme hover:opacity-70'
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label='github'
                    >
                      <SiGithub className='size-4' />
                    </a>
                  </li>
                </ul>
              </nav>
            </header>
            <main
              id='main-content'
              className='mx-auto my-4 w-full max-w-(--breakpoint-lg) grow px-4 py-2'
            >
              {children}
            </main>
            <footer className='mx-auto w-full max-w-(--breakpoint-lg) space-y-6 border-t p-4'>
              <div className='flex items-center justify-between gap-6'>
                <div className='space-y-2'>
                  <SourceLink />
                  <LatestCommit />
                </div>
                <ThemeToggle />
              </div>
              <LanguageStats />
            </footer>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ViewTransition>
  );
}
