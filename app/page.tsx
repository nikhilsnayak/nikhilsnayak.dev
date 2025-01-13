import { Suspense, type ReactNode } from 'react';
import { Source_Code_Pro } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import {
  SiBun,
  SiDrizzle,
  SiNextdotjs,
  SiPostgresql,
  SiRadixui,
  SiReact,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
} from '@icons-pack/react-simple-icons';
import { profile } from '~/assets/images';
import { ArrowUpRight } from 'lucide-react';

import { cn, formatDate } from '~/lib/utils';
import { ErrorBoundary } from '~/components/error-boundary';
import { Spinner } from '~/components/spinner';
import { BlogViewsCount } from '~/features/blog/components/views';
import { getBlogsMetadata } from '~/features/blog/functions/queries';

const sourceCodePro = Source_Code_Pro({
  weight: ['600'],
  subsets: ['latin'],
});

export default async function HomePage() {
  const recentBlogs = await getBlogsMetadata();

  return (
    <section>
      <header className='relative'>
        <h1 className='mb-3 text-3xl font-light sm:text-5xl'>
          {"Hi, I'm"}
          <strong className='block font-extrabold'>Nikhil S</strong>
        </h1>
        <p
          className={cn(
            'mb-4 bg-fluorescent px-4 py-1 text-lg font-semibold text-slate-800 sm:text-xl',
            sourceCodePro.className
          )}
        >
          Full-Stack Developer
        </p>
        <Image
          src={profile}
          alt='Nikhil S'
          className='mx-auto aspect-[4/3] drop-shadow-md sm:absolute sm:right-8 sm:top-0 sm:w-[250px]'
          priority
          placeholder='blur'
        />
      </header>
      <section className='mt-8 space-y-4'>
        <h2 className='mb-4 font-mono text-2xl font-medium tracking-tighter underline'>
          Tech Stack:
        </h2>
        <ul className='list-disc space-y-2 px-4'>
          <li>
            <Tech
              name='Bun'
              href='https://bun.sh/'
              icon={
                <SiBun className='inline size-3 fill-amber-300 dark:fill-[#f9f1e1]' />
              }
              className='mr-2'
            />
            +
            <Tech
              name='Typescript'
              href='https://www.typescriptlang.org/'
              icon={<SiTypescript className='inline size-3 fill-[#3178c6]' />}
              className='mx-2'
            />
            for blazingly fast ⚡ dev exp and full stack type safety
          </li>
          <li>
            <Tech
              name='React'
              href='https://react.dev/'
              icon={<SiReact className='inline size-3 fill-[#58c4dc]' />}
              className='mr-2'
            />
            +
            <Tech
              name='Next.js (App Router)'
              href='https://nextjs.org/'
              icon={<SiNextdotjs className='inline size-3' />}
              className='mx-2'
            />
            for powering interactive UIs at scale
          </li>
          <li>
            <Tech
              name='TailwindCSS'
              href='https://tailwindcss.com/'
              icon={<SiTailwindcss className='inline size-3 fill-[#0ea5e9]' />}
              className='mr-2'
            />
            +
            <Tech
              name='Radix UI'
              href='https://www.radix-ui.com/'
              icon={<SiRadixui className='inline size-3' />}
              className='mx-2'
            />
            =
            <Tech
              name='Shadcn UI'
              href='https://ui.shadcn.com/'
              icon={<SiShadcnui className='inline size-3' />}
              className='mx-2'
            />
            for consistent and accessible web 🌐
          </li>
          <li>
            <Tech
              name='PostgreSQL'
              href='https://www.postgresql.org/'
              icon={<SiPostgresql className='inline size-3 fill-[#699dc9]' />}
              className='mr-2'
            />
            +
            <Tech
              name='Drizzle ORM'
              href='https://orm.drizzle.team/'
              icon={<SiDrizzle className='inline size-3 dark:fill-[#c5f74f]' />}
              className='mx-2'
            />
            for flexible and type safe data storage
          </li>
        </ul>
        <p className='text-lg sm:text-xl'>
          In my free time, I{' '}
          <Link href='/blogs' className='underline'>
            write
          </Link>{' '}
          about these technologies, breaking down complex concepts from the
          ground up.
        </p>
      </section>
      <section className='mt-8'>
        <h2 className='mb-6 font-mono text-2xl font-medium tracking-tighter underline'>
          Recent Posts:
        </h2>
        <div className='space-y-8'>
          {recentBlogs.slice(0, 2).map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className='group block'
            >
              <div className='h-full transform space-y-4 overflow-hidden rounded-lg border border-border p-4 shadow-lg transition-all duration-300 hover:translate-x-2 hover:shadow-xl'>
                <div className='space-y-1'>
                  <p className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>{formatDate(post.metadata.publishedAt)}</span>
                    <ArrowUpRight className='w-4 transition-transform duration-300 group-hover:rotate-45' />
                  </p>
                  <h2
                    className='font-mono text-xl font-semibold'
                    style={{
                      viewTransitionName: post.slug,
                    }}
                  >
                    {post.metadata.title}
                  </h2>
                </div>
                <ErrorBoundary fallback={<p>{"Couldn't load views"}</p>}>
                  <Suspense fallback={<Spinner variant='ellipsis' />}>
                    <BlogViewsCount slug={post.slug}>
                      {(count) => <p>{count} views</p>}
                    </BlogViewsCount>
                  </Suspense>
                </ErrorBoundary>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

function Tech({
  href,
  icon,
  name,
  className,
}: Readonly<{
  name: string;
  icon: ReactNode;
  href: string;
  className?: string;
}>) {
  return (
    <span className={className}>
      {icon}
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className='ml-1 font-medium underline'
      >
        {name}
      </a>
    </span>
  );
}
