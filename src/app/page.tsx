import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';

import { ErrorBoundary } from '~/components/error-boundary';
import { Spinner } from '~/components/spinner';
import { getBlogMetadata } from '~/features/blog/functions/queries';
import { Contributions } from '~/features/github/components/contributions';
import { BASE_URL } from '~/lib/constants';
import { formatDate, viewTransitionName } from '~/lib/utils';

export default async function HomePage() {
  const recentPosts = await getBlogMetadata();

  return (
    <section>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Nikhil S',
            url: BASE_URL,
            jobTitle: 'Software Engineer',
            worksFor: {
              '@type': 'Organization',
              name: 'CodeCraft Technologies',
              url: 'https://www.codecrafttech.com/',
            },
            sameAs: [
              'https://github.com/nikhilsnayak',
              'https://x.com/_nikhilsnayak_',
              'https://www.linkedin.com/in/nikhilsnayak/',
            ],
          }).replace(/</g, '\\u003c'),
        }}
      />
      <header>
        <h1 className='mb-3 text-3xl font-light sm:text-5xl'>
          <strong className='block font-bold'>Nikhil S</strong>
        </h1>
        <p className='mb-4 text-lg text-pretty sm:text-xl'>
          Software engineer building products and systems with TypeScript.
        </p>
        <p className='mb-4 max-w-prose text-pretty'>
          I like owning products end-to-end. When an abstraction gets in the way, I tend to
          understand and improve the layer underneath it.
        </p>
        <p className='text-muted-foreground text-sm'>
          Software Engineer at{' '}
          <a
            href='https://www.codecrafttech.com/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-foreground focus-ring underline underline-offset-2 transition-all hover:underline-offset-4'
          >
            CodeCraft Technologies
          </a>{' '}
          · India · 2023 - present
        </p>
        <ul className='text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm'>
          {[
            { label: 'GitHub', href: 'https://github.com/nikhilsnayak' },
            { label: 'X', href: 'https://x.com/_nikhilsnayak_' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nikhilsnayak/' },
            { label: 'Email', href: 'mailto:nikhilsrinivasnayak@gmail.com' },
          ].map(({ label, href }, index) => (
            <li key={label} className='flex items-center gap-3'>
              {index > 0 ? <span aria-hidden='true'>·</span> : null}
              <a
                href={href}
                target={href.startsWith('https:') ? '_blank' : undefined}
                rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}
                className='hover:text-foreground focus-ring underline underline-offset-4'
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </header>
      <section className='mt-12 space-y-6 sm:mt-16'>
        <h2 className='font-mono text-xl font-medium tracking-tight'>Selected Work</h2>
        <div className='divide-border/60 divide-y'>
          <article className='space-y-3 pb-7'>
            <h3 className='font-mono text-lg font-semibold'>effective-rsc</h3>
            <p className='font-medium'>
              An Effect-native React Server Components framework for Bun.
            </p>
            <p className='text-muted-foreground max-w-prose text-sm leading-relaxed text-pretty'>
              An experimental framework that brings Effect's services, concurrency and resource
              management into React Server Components and native Server Functions. Built on Rspack
              and the Navigation API.
            </p>
            <p className='text-muted-foreground text-xs leading-relaxed'>
              Request-scoped runtime · Streamed navigation · Schema-validated Server Functions
            </p>
            <div className='flex flex-wrap gap-x-5 gap-y-2 text-sm'>
              <a
                href='https://github.com/nikhilsnayak/effective-rsc'
                target='_blank'
                rel='noopener noreferrer'
                className='focus-ring inline-flex items-center gap-1 underline underline-offset-2 transition-all hover:underline-offset-4'
              >
                Source <ArrowUpRight className='size-4' aria-hidden='true' />
              </a>
              <Link
                href='/blog/introducing-effective-rsc'
                className='focus-ring inline-flex items-center gap-1 underline underline-offset-2 transition-all hover:underline-offset-4'
              >
                Introduction <ArrowUpRight className='size-4' aria-hidden='true' />
              </Link>
            </div>
          </article>
          <article className='space-y-3 pt-7'>
            <h3 className='font-mono text-lg font-semibold'>Tether</h3>
            <p className='font-medium'>A private, account-free room for two people.</p>
            <p className='text-muted-foreground max-w-prose text-sm leading-relaxed text-pretty'>
              An experimental calling app with peer-to-peer video, audio and chat. Share a link and
              approve your guest, with a shared 3D room on web and desktop. Once connected, the call
              continues directly between devices without the signaling server.
            </p>
            <p className='text-muted-foreground text-xs leading-relaxed'>
              WebRTC · Effect · React Three Fiber · Web, desktop and mobile
            </p>
            <div className='flex flex-wrap gap-x-5 gap-y-2 text-sm'>
              <a
                href='https://tether.nikhilsnayak.dev'
                target='_blank'
                rel='noopener noreferrer'
                className='focus-ring inline-flex items-center gap-1 underline underline-offset-2 transition-all hover:underline-offset-4'
              >
                Open Tether <ArrowUpRight className='size-4' aria-hidden='true' />
              </a>
              <a
                href='https://github.com/nikhilsnayak/tether'
                target='_blank'
                rel='noopener noreferrer'
                className='focus-ring inline-flex items-center gap-1 underline underline-offset-2 transition-all hover:underline-offset-4'
              >
                Source <ArrowUpRight className='size-4' aria-hidden='true' />
              </a>
            </div>
          </article>
        </div>
      </section>
      <section className='mt-12 sm:mt-16'>
        <h2 className='mb-6 font-mono text-xl font-medium tracking-tight'>Writing</h2>
        <ul className='space-y-6'>
          {recentPosts.slice(0, 3).map((post) => (
            <li key={post.slug} className='space-y-1'>
              <time
                dateTime={post.metadata.publishedAt.toISOString()}
                className='text-muted-foreground text-xs'
              >
                {formatDate(post.metadata.publishedAt)}
              </time>
              <ViewTransition name={viewTransitionName(post.slug)}>
                <h3 className='font-medium text-pretty'>
                  <Link
                    href={`/blog/${post.slug}`}
                    className='focus-ring underline-offset-4 hover:underline focus-visible:underline'
                  >
                    {post.metadata.title}
                  </Link>
                </h3>
              </ViewTransition>
              <p className='text-muted-foreground max-w-prose text-sm leading-relaxed text-pretty'>
                {post.metadata.summary}
              </p>
            </li>
          ))}
        </ul>
        <Link
          href='/blog'
          className='focus-ring mt-6 inline-flex items-center gap-1 text-sm underline underline-offset-2 transition-all hover:underline-offset-4'
        >
          All writing <ArrowUpRight className='size-4' aria-hidden='true' />
        </Link>
      </section>
      <section className='mt-12 space-y-6 sm:mt-16'>
        <h2 className='font-mono text-xl font-medium tracking-tight'>Open Source</h2>
        <ErrorBoundary
          fallback={
            <p className='text-muted-foreground text-xs leading-relaxed'>
              Contributions are unavailable right now. Please check back later.
            </p>
          }
        >
          <Suspense fallback={<Spinner variant='ellipsis' />}>
            <Contributions />
          </Suspense>
        </ErrorBoundary>
      </section>
    </section>
  );
}
