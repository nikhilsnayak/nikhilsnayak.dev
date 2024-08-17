import type { Metadata } from 'next';
import Image from 'next/image';
import { techMang24 } from '@/assets/images';
import { SiNestjs, SiNextdotjs, SiReact } from '@icons-pack/react-simple-icons';
import { ArrowUpRight } from 'lucide-react';

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
          Developing user-focused software solutions and continuously sharing my
          knowledge and insights with the community.
        </p>
      </header>
      <hr className='my-6 border-foreground/20' />
      <section>
        <h2 className='mb-6 font-mono text-2xl font-medium tracking-tighter underline'>
          Experience
        </h2>
        <h3 className='mb-2 inline-block font-mono text-xl font-medium tracking-tighter hover:underline hover:opacity-70'>
          <a
            href='https://www.codecrafttech.com/'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='codecraft technologies'
            className='flex items-center gap-2 transition-all'
          >
            CodeCraft Technologies <ArrowUpRight className='w-4' />
          </a>
        </h3>
        <p className='mb-4 flex flex-col gap-1 text-sm text-muted-foreground'>
          <span className='font-medium'>
            Trainee Engineer - Software Development{' '}
          </span>
          <span>(Aug 2023 - Present)</span>
        </p>
        <p className='my-4'>
          CodeCraft is an award-winning creative engineering company where
          super-talented designers and engineers work closely and bring to life,
          user-focused solutions.
        </p>
        <p className='my-4 *:align-middle'>
          <span>
            At CodeCraft I contribute to projects using modern frameworks such
            as
          </span>
          <Badge className='m-1' variant={'secondary'} asChild>
            <a
              href='https://react.dev'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='react'
              className='flex items-center gap-1 transition-all'
            >
              <SiReact className='w-4 text-blue-500' />
              React
              <ArrowUpRight className='w-4' />
            </a>
          </Badge>
          <Badge className='m-1' variant={'secondary'} asChild>
            <a
              href='https://nextjs.org'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='nextjs'
              className='flex items-center gap-1 transition-all'
            >
              <SiNextdotjs className='w-4' />
              Next.js
              <ArrowUpRight className='w-4' />
            </a>
          </Badge>
          <Badge className='m-1' variant={'secondary'} asChild>
            <a
              href='https://nestjs.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='nestjs'
              className='flex items-center gap-1 transition-all'
            >
              <SiNestjs className='w-4 text-red-600' />
              NestJS
              <ArrowUpRight className='w-4' />
            </a>
          </Badge>
          <span>to build rich and interactive user experience </span>
        </p>
      </section>
      <section className='mt-12'>
        <h2 className='mb-6 font-mono text-2xl font-medium tracking-tighter underline'>
          Other Activites
        </h2>
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
          <div className='space-y-2'>
            <span className='text-sm text-muted-foreground underline'>
              Jan 14 2024
            </span>
            <p>
              Delivered a captivating session on React Server Components, Server
              Actions, and Full-Stack Development using Next.js 14 at Mangalore
              Tech Day 2024 hosted by{' '}
              <a
                href='https://mangaloreinfotech.in/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-green-500 hover:underline'
              >
                (UniCourt India) Mangalore Infotech Solutions Private Limited
              </a>
            </p>
          </div>
          <Image
            src={techMang24}
            alt='Me as Speaker at TechMang24 giving a talk on Next.js 14'
            className='w-full max-w-sm rounded-sm object-cover drop-shadow-sm'
            placeholder='blur'
          />
        </div>
      </section>
    </section>
  );
}
