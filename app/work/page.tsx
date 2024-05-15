import type { Metadata } from 'next';
import { ArrowIcon, NestIcon, NextIcon, ReactIcon } from '@/assets/icons';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Work',
  description: 'A summary of my work.',
};

export default function WorkPage() {
  return (
    <section>
      <header>
        <h1 className='mb-6 font-mono text-2xl font-medium tracking-tighter'>
          My Work
        </h1>
        <p>
          On a mission to build user centric software solutions and along the
          way share my learnings with the community
        </p>
      </header>
      <hr className='my-6 border-foreground/20' />
      <section>
        <h2 className='mb-1 inline-block font-mono text-xl font-medium tracking-tighter hover:underline hover:opacity-70'>
          <a
            href='https://www.codecrafttech.com/'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='codecraft technologies'
            className='flex items-center gap-2 transition-all'
          >
            CodeCraft Technologies <ArrowIcon />
          </a>
        </h2>
        <p className='mb-4 text-sm text-muted-foreground'>
          Trainee Engineer - Software Development (Aug 2023 - Present)
        </p>
        <p className='my-4'>
          CodeCraft is an award-winning creative engineering company where
          super-talented designers and engineers work closely and bring to life,
          user-focused solutions.
        </p>
        <p className='my-4'>
          At CodeCraft I contribute to projects using modern frameworks such as
          <Badge className='mx-1' variant={'secondary'} asChild>
            <a
              href='https://react.dev'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='react'
              className='flex items-center gap-1 transition-all'
            >
              <ReactIcon className='w-3' />
              React
              <ArrowIcon />
            </a>
          </Badge>
          <Badge className='mx-1' variant={'secondary'} asChild>
            <a
              href='https://nextjs.org'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='nextjs'
              className='flex items-center gap-1 transition-all'
            >
              <NextIcon className='w-4' />
              Next.js
              <ArrowIcon />
            </a>
          </Badge>
          <Badge className='mx-1' variant={'secondary'} asChild>
            <a
              href='https://nestjs.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='nestjs'
              className='flex items-center gap-1 transition-all'
            >
              <NestIcon className='w-4' />
              Nest.js
              <ArrowIcon />
            </a>
          </Badge>
          to build rich and interactive user experience
        </p>
      </section>
    </section>
  );
}
