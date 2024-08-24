import { Suspense } from 'react';
import { Source_Code_Pro } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { profile } from '@/assets/images';
import {
  SiJavascript,
  SiNestjs,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from '@icons-pack/react-simple-icons';
import { ArrowUpRight } from 'lucide-react';

import { cn, formatDate } from '@/lib/utils';
import { getBlogPosts } from '@/lib/utils/server';
import { Badge } from '@/components/ui/badge';
import { PostViewsCount } from '@/components/post-views';
import { Spinner } from '@/components/spinner';

const skills = [
  {
    name: 'JavaScript',
    Icon: SiJavascript,
  },
  {
    name: 'TypeScript',
    Icon: SiTypescript,
  },
  {
    name: 'Tailwind CSS',
    Icon: SiTailwindcss,
  },
  {
    name: 'React',
    Icon: SiReact,
  },
  {
    name: 'Next.js',
    Icon: SiNextdotjs,
  },
  {
    name: 'NestJS',
    Icon: SiNestjs,
  },
] as const;

const sourceCodePro = Source_Code_Pro({
  weight: ['600'],
  subsets: ['latin'],
});

export default function HomePage() {
  const recentBlogs = getBlogPosts()
    .toSorted((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, 2);
  return (
    <section>
      <header className='relative'>
        <h1 className='mb-[0.25em] text-3xl font-light sm:text-5xl'>
          Hi, I&apos;m
          <strong className='block font-extrabold'>Nikhil S</strong>
        </h1>
        <p
          className={cn(
            'mb-[1em] bg-fluorescent px-[1em] py-[0.25em] text-lg font-semibold text-slate-800 sm:text-xl',
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
      <section className='mt-20 space-y-4'>
        <p className='text-lg sm:text-xl'>
          I am a passionate and driven software engineer with expertise in both
          front-end and back-end development. My skills include:
        </p>
        <ul className='flex flex-wrap items-center gap-4'>
          {skills.map(({ Icon, name }) => (
            <li key={name}>
              <Badge asChild className='cursor-default'>
                <div className='flex items-center gap-1'>
                  <Icon className='w-3 sm:w-4' />
                  <span className='text-xs sm:text-sm'>{name}</span>
                </div>
              </Badge>
            </li>
          ))}
        </ul>
        <p className='text-lg sm:text-xl'>
          Constantly seeking to learn and adapt, I strive to enhance my skills
          through continuous development.
        </p>
        <p className='text-lg sm:text-xl'>
          In my free time, I write about the technologies that excite me. I
          enjoy breaking down complex concepts from the ground up.
        </p>
      </section>
      <section className='mt-10'>
        <h2 className='mb-6 font-mono text-2xl font-medium tracking-tighter underline'>
          Recent Posts:
        </h2>
        <div className='space-y-8'>
          {recentBlogs.map((post) => (
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
                  <h2 className='font-mono text-xl font-semibold'>
                    {post.metadata.title}
                  </h2>
                </div>
                <Suspense fallback={<Spinner variant='ellipsis' />}>
                  <PostViewsCount slug={post.slug}>
                    {(count) => <p>{count} views</p>}
                  </PostViewsCount>
                </Suspense>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
