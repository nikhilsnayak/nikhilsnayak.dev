import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SiGithub, SiLinkedin, SiX } from '@icons-pack/react-simple-icons';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Monitor, Moon, Sun } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import { ViewTransitions } from 'next-view-transitions';

import { BASE_URL } from '~/lib/constants';
import { cn } from '~/lib/utils';
import { Toaster } from '~/components/ui/sonner';
import { BotLink, NavLink } from '~/components/navigation';
import { ThemeButton } from '~/components/theme-button';
import { AI } from '~/features/ai';
import { LanguageStats } from '~/features/github/components/language-stats';
import { LatestCommit } from '~/features/github/components/latest-commit';
import { SourceLink } from '~/features/github/components/source-link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
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
            <AI>
              <Header />
              <main className='mx-auto my-4 w-full max-w-screen-lg flex-grow px-4 py-2'>
                {children}
              </main>
              <Footer />
            </AI>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}

function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b shadow-md backdrop-blur'>
      <nav className='mx-auto flex max-w-screen-lg items-center justify-between p-4'>
        <ul className='flex gap-4'>
          <li>
            <NavLink href='/'>home</NavLink>
          </li>
          <li>
            <NavLink href='/work'>work</NavLink>
          </li>
          <li>
            <NavLink href='/blogs'>blogs</NavLink>
          </li>
        </ul>
        <ul className='flex items-center gap-4'>
          <li className='hover:opacity-70'>
            <BotLink />
          </li>
          <li className='hover:opacity-70'>
            <a
              href='https://x.com/_nikhilsnayak_'
              className='dark:text-fluorescent'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='x.com'
            >
              <SiX className='size-4' />
            </a>
          </li>
          <li className='hover:opacity-70'>
            <a
              href='https://github.com/nikhilsnayak'
              className='dark:text-fluorescent'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='github'
            >
              <SiGithub className='size-4' />
            </a>
          </li>
          <li className='hover:opacity-70'>
            <a
              href='https://linkedin.com/in/nikhilsnayak'
              className='dark:text-fluorescent'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='linkedin'
            >
              <SiLinkedin className='size-4' />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function ThemeToggle() {
  return (
    <div className='flex gap-2 rounded-full border bg-muted'>
      <span className='sr-only'>Toggle theme</span>
      <ThemeButton type='light'>
        <Sun />
      </ThemeButton>
      <ThemeButton type='dark'>
        <Moon />
      </ThemeButton>
      <ThemeButton type='system'>
        <Monitor />
      </ThemeButton>
    </div>
  );
}

function Footer() {
  return (
    <footer className='mx-auto w-full max-w-screen-lg space-y-6 border-t p-4'>
      <div className='flex items-center justify-between gap-6'>
        <div className='space-y-2'>
          <SourceLink />
          <LatestCommit />
        </div>
        <ThemeToggle />
      </div>
      <LanguageStats />
    </footer>
  );
}
