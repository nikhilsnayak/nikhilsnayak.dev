import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Source_Code_Pro } from 'next/font/google';
import { cn, formatDate } from '@/lib/utils';
import { getBlogPosts } from '@/lib/utils/server';
import { Badge } from '@/components/ui/badge';
import { PostViewCount } from '@/components/views';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { gImage1, profile } from '@/assets/images';
import {
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiNestjs,
} from '@icons-pack/react-simple-icons';
import { ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-static';

const skills = [
  {
    name: 'HTML5',
    Icon: SiHtml5,
  },
  {
    name: 'CSS3',
    Icon: SiCss3,
  },
  {
    name: 'Tailwind CSS',
    Icon: SiTailwindcss,
  },
  {
    name: 'JavaScript',
    Icon: SiJavascript,
  },
  {
    name: 'TypeScript',
    Icon: SiTypescript,
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
    name: 'Node.js',
    Icon: SiNodedotjs,
  },
  {
    name: 'NestJS',
    Icon: SiNestjs,
  },
] as const;

const images = [
  {
    src: gImage1,
    alt: 'Me as Speaker at TechMang24 giving a talk on Next.js 14',
  },
] as const;

const sourceCodePro = Source_Code_Pro({
  weight: ['600'],
  subsets: ['latin'],
});

function Gallery() {
  return (
    <section>
      <h3 className='mb-[0.5em] font-mono text-2xl font-bold sm:text-4xl'>
        Gallery:
      </h3>
      <ul className='flex flex-wrap items-center gap-8'>
        {images.map((image, index) => (
          <li className='max-w-[450px]' key={index}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    className='rounded-sm object-cover drop-shadow-sm'
                    priority
                    placeholder='blur'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{image.alt}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        ))}
      </ul>
    </section>
  );
}

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
    <section className='space-y-20'>
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
      <section className='space-y-4'>
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
          enjoy breaking down complex concepts from the ground up, which allows
          me to create in-depth and detailed blog posts. My goal is to make tech
          topics accessible and engaging for everyone, whether you&apos;re a
          seasoned developer or just starting out.
        </p>
      </section>
      <section>
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
              <div className='h-full transform space-y-2 overflow-hidden rounded-lg border border-border p-4 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'>
                <p className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>{formatDate(post.metadata.publishedAt)}</span>
                  <ArrowUpRight className='w-4 transition-transform duration-300 group-hover:rotate-45' />
                </p>
                <h2 className='font-mono text-xl font-semibold'>
                  {post.metadata.title}
                </h2>
                <Suspense
                  fallback={<span className='text-lg blur-sm'>100 views</span>}
                >
                  <PostViewCount slug={post.slug} />
                </Suspense>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
