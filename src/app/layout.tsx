import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from 'next/font/google';
import { ViewTransition } from 'react';

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

const siteTitle = 'Nikhil S | Software Engineer';
const siteDescription =
  'Software engineer building products and systems with TypeScript, React and Effect. Creator of effective-rsc and Tether. Open source and technical writing.';

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
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <ViewTransition>
      <html lang='en' suppressHydrationWarning className='styled-scrollbar h-full'>
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
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors />
              <header className='w-full'>
                <nav className='mx-auto flex max-w-(--breakpoint-lg) items-center justify-between border-b p-4'>
                  <a
                    href='#main-content'
                    className='focus-ring sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:p-2'
                  >
                    Skip to content
                  </a>
                  <ul className='flex gap-4'>
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
                className='mx-auto my-4 w-full max-w-(--breakpoint-lg) grow px-4 py-2'
              >
                {children}
              </main>
              <footer className='mx-auto mt-8 w-full max-w-(--breakpoint-lg) border-t p-4'>
                <div className='flex items-center justify-between gap-6'>
                  <div className='text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-3 text-xs'>
                    <SourceLink />
                    <a
                      href='https://github.com/nikhilsnayak'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-foreground focus-ring underline-offset-4 hover:underline focus-visible:underline'
                    >
                      GitHub
                    </a>
                    <a
                      href='https://x.com/_nikhilsnayak_'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-foreground focus-ring underline-offset-4 hover:underline focus-visible:underline'
                    >
                      X
                    </a>
                    <a
                      href='https://www.linkedin.com/in/nikhilsnayak/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-foreground focus-ring underline-offset-4 hover:underline focus-visible:underline'
                    >
                      LinkedIn
                    </a>
                    <a
                      href='mailto:nikhilsrinivasnayak@gmail.com'
                      className='hover:text-foreground focus-ring underline-offset-4 hover:underline focus-visible:underline'
                    >
                      Email
                    </a>
                    <a
                      href={`${BASE_URL}/rss.xml`}
                      className='hover:text-foreground focus-ring underline-offset-4 hover:underline focus-visible:underline'
                    >
                      RSS
                    </a>
                  </div>
                  <ThemeToggle />
                </div>
              </footer>
            </ThemeProvider>
            <SpeedInsights />
            <Analytics />
          </div>
        </body>
      </html>
    </ViewTransition>
  );
}
