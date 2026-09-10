import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';

import { EffectiveRscIcon } from '~/assets/icons/effective-rsc';
import { TetherIcon } from '~/assets/icons/tether';
import { ErrorBoundary } from '~/components/error-boundary';
import { ExternalLink } from '~/components/external-link';
import { InteractiveName } from '~/components/interactive-name';
import { InteractivePortrait } from '~/components/interactive-portrait';
import { NameMark } from '~/components/name-mark';
import { Spinner } from '~/components/spinner';
import { getBlogMetadata } from '~/features/blog/functions/queries';
import { Contributions } from '~/features/github/components/contributions';
import { BASE_URL, SITE_INTRO } from '~/lib/constants';
import { viewTransitionName } from '~/lib/utils';

export default async function HomePage() {
  const posts = await getBlogMetadata();

  return (
    <div className='space-y-20 sm:space-y-24'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Nikhil S',
            url: BASE_URL,
            jobTitle: 'Software Engineer',
            sameAs: [
              'https://github.com/nikhilsnayak',
              'https://x.com/_nikhilsnayak_',
              'https://www.linkedin.com/in/nikhilsnayak/',
            ],
          }).replace(/</g, '\\u003c'),
        }}
      />
      <header className='relative pt-40 sm:min-h-88 sm:pt-16'>
        <InteractivePortrait className='portrait-mask pointer-events-none absolute -top-18 -right-6 z-0 w-[min(22rem,100vw)] opacity-45 mix-blend-multiply invert select-none sm:-top-20 sm:w-112 lg:-right-24 lg:w-124 dark:opacity-55 dark:mix-blend-screen dark:invert-0 print:hidden forced-colors:hidden' />
        <div className='relative z-1 max-w-116'>
          <p className='text-muted-foreground mb-5 font-mono text-sm'>hey, i'm</p>
          <h1>
            <span className='sr-only'>Nikhil S</span>
            <InteractiveName>
              <NameMark />
            </InteractiveName>
          </h1>
          <p className='mt-7 max-w-96 text-base leading-relaxed text-pretty sm:text-lg'>
            {SITE_INTRO}
          </p>
        </div>
      </header>

      <section aria-labelledby='building-heading'>
        <h2 id='building-heading' className='section-label mb-6'>
          things i've built
        </h2>
        <div className='grid gap-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-0'>
          <article className='border-border min-w-0 border-t pt-5 sm:row-span-4 sm:grid sm:grid-rows-subgrid'>
            <p className='flex items-center gap-2 font-mono text-xs'>
              <span className='bg-background inline-flex size-5 shrink-0 items-center justify-center rounded-[5px] shadow-sm dark:shadow-[0_1px_6px_oklch(1_0_0/0.14)]'>
                <EffectiveRscIcon className='size-3' />
              </span>
              effective-rsc
            </p>
            <h3 className='mt-6 text-xl leading-normal tracking-tight text-pretty'>
              What if Effect handled the runtime behind RSC?
            </h3>
            <p className='text-muted-foreground mt-3 text-sm leading-7 text-pretty'>
              Both clicked for me, so I wanted to see how they'd fit together. Still an experiment.
            </p>
            <div className='mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm'>
              <Link href='/blog/introducing-effective-rsc' className='text-link'>
                the story
              </Link>
              <ExternalLink
                href='https://effective-rsc.nikhilsnayak.dev'
                aria-label='effective-rsc documentation'
                className='text-link inline-flex items-center gap-1'
              >
                docs
              </ExternalLink>
              <ExternalLink
                href='https://github.com/nikhilsnayak/effective-rsc'
                aria-label='effective-rsc code on GitHub'
                className='text-link inline-flex items-center gap-1'
              >
                code
              </ExternalLink>
            </div>
          </article>
          <article className='border-border min-w-0 border-t pt-5 sm:row-span-4 sm:grid sm:grid-rows-subgrid'>
            <p className='flex items-center gap-2 font-mono text-xs'>
              <span className='bg-background inline-flex size-5 shrink-0 items-center justify-center rounded-[5px] shadow-sm dark:shadow-[0_1px_6px_oklch(1_0_0/0.14)]'>
                <TetherIcon className='size-3' />
              </span>
              Tether
            </p>
            <h3 className='mt-6 text-xl leading-normal tracking-tight text-pretty'>
              What if a call felt like sharing a room?
            </h3>
            <p className='text-muted-foreground mt-3 text-sm leading-7 text-pretty'>
              A little room for two people. You share a link, they knock, you let them in. Video,
              audio and chat go directly between your devices. No accounts.
            </p>
            <div className='mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm'>
              <ExternalLink
                href='https://tether.nikhilsnayak.dev'
                className='text-link inline-flex items-center gap-1'
              >
                try it
              </ExternalLink>
              <ExternalLink
                href='https://github.com/nikhilsnayak/tether'
                aria-label='Tether code on GitHub'
                className='text-link inline-flex items-center gap-1'
              >
                code
              </ExternalLink>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby='writing-heading'>
        <div className='mb-5 flex items-baseline justify-between gap-4'>
          <h2 id='writing-heading' className='section-label'>
            things i've written
          </h2>
          <Link href='/blog' className='text-link text-xs'>
            all writing
          </Link>
        </div>
        <ul className='divide-border divide-y'>
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className='focus-ring group flex items-baseline justify-between gap-6 py-5'
              >
                <ViewTransition
                  name={viewTransitionName(post.slug)}
                  default='none'
                  share='article-title'
                >
                  <h3 className='text-sm leading-6 text-pretty underline-offset-4 group-hover:underline sm:text-base'>
                    {post.metadata.title}
                  </h3>
                </ViewTransition>
                <time
                  dateTime={post.metadata.publishedAt.toISOString()}
                  className='text-muted-foreground shrink-0 font-mono text-xs tabular-nums'
                >
                  {post.metadata.publishedAt.getFullYear()}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby='upstream-heading'>
        <h2 id='upstream-heading' className='section-label mb-6'>
          things i've run into
        </h2>
        <p className='text-muted-foreground mb-6 max-w-xl text-sm leading-7 text-pretty'>
          These started as bugs I hit while building something. Some I fixed with a small PR. For
          the others, I put together a repro and opened an issue.
        </p>
        <ErrorBoundary
          fallback={
            <p className='text-muted-foreground text-sm'>
              Couldn't load these right now.{' '}
              <a
                href='https://github.com/nikhilsnayak'
                target='_blank'
                rel='noopener noreferrer'
                className='text-link'
              >
                Find me on GitHub.
              </a>
            </p>
          }
        >
          <Suspense fallback={<Spinner variant='ellipsis' />}>
            <Contributions />
          </Suspense>
        </ErrorBoundary>
      </section>

      <section aria-labelledby='about-heading' className='max-w-xl'>
        <h2 id='about-heading' className='section-label mb-6'>
          a little about me
        </h2>
        <div className='text-muted-foreground space-y-4 text-sm leading-7 text-pretty'>
          <p>
            I studied electronics, discovered C in my first semester, and spent lockdown learning
            Python on an old laptop. Somehow I ended up a React nerd.{' '}
            <Link href='/blog/2-years-into-software-engineering' className='text-link'>
              There's a longer version.
            </Link>
          </p>
          <p>
            I'm based in India and work at{' '}
            <a
              href='https://www.codecrafttech.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-link'
            >
              CodeCraft
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
