import { Suspense, ViewTransition } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { formatDate } from '~/lib/utils';
import { ErrorBoundary } from '~/components/error-boundary';
import { Spinner } from '~/components/spinner';
import { BaseUiIcon } from '~/assets/icons/base-ui';
import { BunIcon } from '~/assets/icons/bun';
import { DrizzleOrmIcon } from '~/assets/icons/drizzle-orm';
import { NextJsIcon } from '~/assets/icons/next-js';
import { PostgresqlIcon } from '~/assets/icons/postgresql';
import { ReactJsIcon } from '~/assets/icons/react-js';
import { ShadcnUiIcon } from '~/assets/icons/shadcn-ui';
import { TailwindCssIcon } from '~/assets/icons/tailwind-css';
import { TypescriptIcon } from '~/assets/icons/typescript';
import { ViewsCount } from '~/features/blog/components/views';
import { getBlogMetadata } from '~/features/blog/functions/queries';

export default async function HomePage() {
  const recentPosts = await getBlogMetadata();

  return (
    <section>
      <header>
        <h1 className='mb-3 text-3xl font-light sm:text-5xl'>
          <strong className='block font-bold'>Nikhil S</strong>
        </h1>
        <p className='mb-4 text-lg text-pretty sm:text-xl'>
          {'Full-Stack Software Engineer primarily working with React.'}
        </p>
      </header>
      <section className='mt-8 space-y-6'>
        <h2 className='font-mono text-2xl font-medium tracking-tighter underline'>
          Experience:
        </h2>
        <div>
          <h3 className='hover:text-primary mb-2 inline-flex items-center gap-2 font-mono text-xl font-medium tracking-tighter'>
            <a
              href='https://www.codecrafttech.com/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='codecraft technologies'
              className='flex items-center gap-2 transition-all hover:opacity-80'
            >
              CodeCraft Technologies
              <ArrowUpRight className='w-4' />
            </a>
          </h3>
          <div>
            <div className='relative border-l-3 pb-4 pl-4'>
              <div className='absolute top-1 -left-[9px] size-4 animate-ping border-2 bg-green-500' />
              <div className='absolute top-1 -left-[9px] size-4 border-2 bg-green-500' />
              <p className='text-muted-foreground flex flex-col gap-1'>
                <span className='font-medium'>
                  Engineer - Software Development
                </span>
                <time className='text-xs'>Nov 2024 - Present</time>
              </p>
            </div>
            <div className='relative border-l-3 pl-4'>
              <div className='bg-background absolute top-1 -left-[9px] size-4 border-2' />
              <p className='text-muted-foreground flex flex-col gap-1'>
                <span className='font-medium'>
                  Trainee Engineer - Software Development
                </span>
                <time className='text-xs'>Aug 2023 - Nov 2024</time>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className='mt-8 space-y-4'>
        <h2 className='mb-4 font-mono text-2xl font-medium tracking-tighter underline'>
          Tech Stack:
        </h2>
        <ul className='space-y-2 text-pretty'>
          <li className='border-2 border-dashed p-4'>
            <span className='mr-2'>
              <BunIcon className='inline size-3 dark:fill-[#ffffff]' />
              <a
                href='https://bun.sh/'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 font-medium underline'
              >
                Bun
              </a>
            </span>
            +
            <span className='mx-2'>
              <TypescriptIcon className='inline size-3 fill-[#3178C6]' />
              <a
                href='https://www.typescriptlang.org/'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 font-medium underline'
              >
                Typescript
              </a>
            </span>
            for blazingly fast ⚡ dev exp and full stack type safety
          </li>
          <li className='border-2 border-dashed p-4'>
            <span className='mr-2'>
              <ReactJsIcon className='inline size-3 fill-[#61DAFB]' />
              <a
                href='https://react.dev/'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 font-medium underline'
              >
                React
              </a>
            </span>
            +
            <span className='mx-2'>
              <NextJsIcon className='inline size-3 dark:fill-[#ffffff]' />
              <a
                href='https://nextjs.org/'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 font-medium underline'
              >
                Next.js (App Router)
              </a>
            </span>
            for powering interactive UIs at scale
          </li>
          <li className='border-2 border-dashed p-4'>
            <span className='mr-2'>
              <TailwindCssIcon className='inline size-3 fill-[#06B6D4]' />
              <a
                href='https://tailwindcss.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 font-medium underline'
              >
                TailwindCSS
              </a>
            </span>
            +
            <span className='mx-2'>
              <BaseUiIcon className='inline size-3 dark:fill-[#ffffff]' />
              <a
                href='https://base-ui.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 font-medium underline'
              >
                Base UI
              </a>
            </span>
            =
            <span className='mx-2'>
              <ShadcnUiIcon className='inline size-3 dark:fill-[#ffffff]' />
              <a
                href='https://ui.shadcn.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 font-medium underline'
              >
                Shadcn UI
              </a>
            </span>
            for consistent and accessible web
          </li>
          <li className='border-2 border-dashed p-4'>
            <span className='mr-2'>
              <PostgresqlIcon className='inline size-3 fill-[#4169E1]' />
              <a
                href='https://www.postgresql.org/'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 font-medium underline'
              >
                PostgreSQL
              </a>
            </span>
            +
            <span className='mx-2'>
              <DrizzleOrmIcon className='inline size-3 fill-[#C5F74F]' />
              <a
                href='https://orm.drizzle.team/'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 font-medium underline'
              >
                Drizzle ORM
              </a>
            </span>
            for flexible and type safe data storage
          </li>
        </ul>
        <p className='text-lg sm:text-xl'>
          In my free time, I{' '}
          <Link href='/blog' className='underline'>
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
          {recentPosts.slice(0, 2).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className='group border-border block h-full transform space-y-4 overflow-hidden border p-4 shadow-sm transition-all duration-300 hover:translate-x-2 hover:shadow-xl'
            >
              <div className='space-y-1'>
                <p className='text-muted-foreground flex items-center justify-between text-xs'>
                  <span>{formatDate(post.metadata.publishedAt)}</span>
                  <ArrowUpRight className='w-4 transition-transform duration-300 group-hover:rotate-45' />
                </p>
                <ViewTransition name={post.slug}>
                  <h3 className='font-mono text-xl font-semibold text-balance'>
                    {post.metadata.title}
                  </h3>
                </ViewTransition>
              </div>
              <ErrorBoundary
                fallback={
                  <p className='w-max text-sm'>{"Couldn't load views"}</p>
                }
              >
                <Suspense fallback={<Spinner variant='ellipsis' />}>
                  <ViewsCount slug={post.slug} />
                </Suspense>
              </ErrorBoundary>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
