import './globals.css';

import type { Metadata } from 'next';
import { SiGithub, SiLinkedin, SiX } from '@icons-pack/react-simple-icons';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import { ViewTransitions } from 'next-view-transitions';

import { AI } from '~/lib/ai';
import { BASE_URL } from '~/lib/constants';
import { getLanguages, getLatestCommit } from '~/lib/github';
import { cn } from '~/lib/utils';
import { Toaster } from '~/components/ui/sonner';
import { BotLink, NavLink, SourceLink } from '~/components/links';
import { ThemeToggle } from '~/components/theme-toggle';

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

async function LatestCommit() {
  const latestCommit = await getLatestCommit();
  return (
    <a
      href={latestCommit.url}
      target='_blank'
      rel='noopener noreferrer'
      className='block tracking-tighter underline dark:text-fluorescent'
    >
      Latest commit: {latestCommit.message} by {latestCommit.author} on{' '}
      {latestCommit.date}
    </a>
  );
}

async function LanguageStats() {
  const languages = await getLanguages();

  const colorMap: Record<string, string> = {
    TypeScript: '#3178C6',
    MDX: '#F9AC00',
    CSS: '#563D7C',
    JavaScript: '#F1E05A',
  };

  return (
    <div className='max-w-xs text-sm'>
      <h3 className='mb-2 font-semibold'>Languages</h3>
      <div className='mb-2 flex h-2 overflow-hidden rounded-full'>
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: colorMap[lang.name] ?? '#808080',
            }}
            className='h-full'
          />
        ))}
      </div>
      <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs'>
        {languages.map((lang) => (
          <div key={lang.name} className='flex items-center'>
            <span
              className='mr-1 h-2 w-2 rounded-full'
              style={{ backgroundColor: colorMap[lang.name] ?? '#808080' }}
            />
            <span>{lang.name}</span>
            <span className='ml-1 text-gray-400'>
              {lang.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className='mx-auto flex w-full max-w-screen-lg items-start justify-between gap-6 border-t p-4'>
      <div className='space-y-4'>
        <SourceLink />
        <LatestCommit />
        <LanguageStats />
      </div>
      <ThemeToggle />
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(
            GeistSans.variable,
            GeistMono.variable,
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
