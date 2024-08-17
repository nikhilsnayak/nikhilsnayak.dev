import { Suspense } from 'react';
import { Source_Code_Pro } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { LoadingSpinner2 } from '@/assets/icons';
import { profile } from '@/assets/images';
import {
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
import { Div, Header, Li, P, Section } from '@/components/framer-motion';
import { PostViewsCount } from '@/components/post-views';

const skills = [
  { name: 'React', Icon: SiReact },
  { name: 'Tailwind CSS', Icon: SiTailwindcss },
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'Next.js', Icon: SiNextdotjs },
  { name: 'NestJS', Icon: SiNestjs },
] as const;

const sourceCodePro = Source_Code_Pro({
  weight: ['600'],
  subsets: ['latin'],
});

export default function HomePage() {
  const allBlogs = getBlogPosts()
    .toSorted((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, 2);

  return (
    <Section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Header
        //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
        className='relative'
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <h1 className='mb-[0.25em] text-3xl font-light sm:text-5xl'>
          Hi, I&apos;m
          <strong className='block font-extrabold'>Nikhil S</strong>
        </h1>
        <P
          //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
          className={cn(
            'mb-[1em] bg-fluorescent px-[1em] py-[0.25em] text-lg font-semibold text-slate-800 sm:text-xl',
            sourceCodePro.className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Full-Stack Developer
        </P>
        <Div
          //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
          className='mx-auto aspect-[4/3] drop-shadow-md sm:absolute sm:right-8 sm:top-0 sm:w-[250px]'
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, duration: 0.6 }}
        >
          <Image src={profile} alt='Nikhil S' priority placeholder='blur' />
        </Div>
      </Header>

      <Section
        //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
        className='mt-20 space-y-4'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <p className='text-lg sm:text-xl'>
          I am a passionate and driven software engineer with experience in both
          front-end and back-end development. My skills include:
        </p>
        <ul className='flex flex-wrap items-center gap-4'>
          {skills.map(({ Icon, name }, index) => (
            <Li
              key={name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Badge asChild className='cursor-default'>
                <div className='flex items-center gap-1'>
                  <Icon className='w-3 sm:w-4' />
                  <span className='text-xs sm:text-sm'>{name}</span>
                </div>
              </Badge>
            </Li>
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
      </Section>

      <Section
        //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
        className='mt-10'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <h2 className='mb-6 font-mono text-2xl font-medium tracking-tighter underline'>
          Recent Posts:
        </h2>
        <div className='space-y-8'>
          {allBlogs.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className='group block'
            >
              <Div
                //@ts-ignore -- props issue due to improper peer dependency (react 19-rc)
                className='h-full transform space-y-4 overflow-hidden rounded-lg border border-border p-4 shadow-lg transition-all duration-300 hover:translate-x-2 hover:shadow-xl'
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className='space-y-1'>
                  <p className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>{formatDate(post.metadata.publishedAt)}</span>
                    <ArrowUpRight className='w-4 transition-transform duration-300 group-hover:rotate-45' />
                  </p>
                  <h2 className='font-mono text-xl font-semibold'>
                    {post.metadata.title}
                  </h2>
                </div>
                <Suspense
                  fallback={<LoadingSpinner2 className='fill-foreground' />}
                >
                  <PostViewsCount slug={post.slug}>
                    {(count) => <p>{count} views</p>}
                  </PostViewsCount>
                </Suspense>
              </Div>
            </Link>
          ))}
        </div>
      </Section>
    </Section>
  );
}
