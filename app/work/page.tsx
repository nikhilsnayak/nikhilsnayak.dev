import { Metadata } from 'next';
import Image from 'next/image';
import { techMang24 } from '@/assets/images';
import { SiNestjs, SiNextdotjs, SiReact } from '@icons-pack/react-simple-icons';
import { ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Div, H1, P, Section } from '@/components/framer-motion';

export const metadata: Metadata = {
  title: 'Work',
  description: 'A summary of my work.',
};

export default function WorkPage() {
  return (
    <Section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header>
        <H1
          //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
          className='mb-6 font-mono text-2xl font-medium tracking-tighter'
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          My Work
        </H1>
        <P
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Developing user-focused software solutions and continuously sharing my
          knowledge and insights with the community.
        </P>
      </header>
      <Div
        //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
        className='my-6 border-foreground/20'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <hr />
      </Div>
      <Section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <h2 className='mb-6 font-mono text-2xl font-medium tracking-tighter underline'>
          Experience
        </h2>
        <div>
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
            super-talented designers and engineers work closely and bring to
            life, user-focused solutions.
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
            <span>to build rich and interactive user experience</span>
          </p>
        </div>
      </Section>
      <Section
        //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
        className='mt-12'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <h2 className='mb-6 font-mono text-2xl font-medium tracking-tighter underline'>
          Other Activities
        </h2>
        <Div
          //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
          className='flex flex-col gap-4 md:flex-row md:items-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
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
          <Div
            //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
            className='w-full max-w-sm'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, duration: 0.6 }}
          >
            <Image
              src={techMang24}
              alt='Me as Speaker at TechMang24 giving a talk on Next.js 14'
              className='w-full rounded-sm object-cover drop-shadow-sm'
              placeholder='blur'
            />
          </Div>
        </Div>
      </Section>
    </Section>
  );
}
