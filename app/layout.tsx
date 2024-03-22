import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: {
    default: 'Nikhil S',
    template: '%s | Nikhil S',
  },
  description: 'Software Engineer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
