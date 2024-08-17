import './globals.css';

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { SiGithub, SiLinkedin, SiX } from '@icons-pack/react-simple-icons';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';

import { BASE_URL } from '@/config/constants';
import { AI } from '@/lib/ai/provider';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { BotLink } from '@/components/bot-link';
import {
  Main,
  Footer as MotionFooter,
  Header as MotionHeader,
} from '@/components/framer-motion';
import { NavLink } from '@/components/nav-link';

const ThemeToggle = dynamic(() => import('@/components/theme-toggle'), {
  ssr: false,
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
    locale: 'en_US',
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
    <MotionHeader
      //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
      className='sticky top-0 z-50 w-full border-b shadow-md backdrop-blur'
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
    >
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
        <ul className='flex gap-4'>
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
    </MotionHeader>
  );
}

function Footer() {
  return (
    <MotionFooter
      //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
      className='mx-auto mb-8 flex w-full max-w-screen-lg items-center justify-between border-t p-4'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
    >
      <BotLink />
      <ThemeToggle />
    </MotionFooter>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(GeistSans.variable, GeistMono.variable, 'font-sans')}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors closeButton />
          <div className='flex min-h-dvh flex-col justify-between gap-8'>
            <AI>
              <Header />
              <Main
                //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
                className='mx-auto w-full max-w-screen-lg flex-grow px-4 py-2'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {children}
              </Main>
              <Footer />
            </AI>
          </div>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
