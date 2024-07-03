import Image from 'next/image';
import { Source_Code_Pro } from 'next/font/google';
import { cn } from '@/lib/utils';
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
import { Badge } from '@/components/ui/badge';

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
  weight: ['400'],
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

function Skills() {
  return (
    <section>
      <h3 className='mb-[0.5em] font-mono text-2xl font-bold sm:text-4xl'>
        Skills:
      </h3>
      <ul className='flex flex-wrap items-center gap-4'>
        {skills.map(({ Icon, name }) => (
          <li key={name}>
            <Badge asChild className='cursor-default'>
              <div className='flex items-center gap-1'>
                <Icon className='w-3 sm:w-4' />
                <span className='text-sm sm:text-base'>{name}</span>
              </div>
            </Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HomePage() {
  return (
    <section className='space-y-20'>
      <header className='relative'>
        <h1 className='mb-[0.25em] text-5xl font-light sm:text-7xl'>
          Hi, I am <strong className='block font-extrabold'>Nikhil S</strong>
        </h1>
        <p
          className={cn(
            'mb-[1em] bg-fluorescent px-[1em] py-[0.25em] text-xl text-slate-800 sm:text-2xl',
            sourceCodePro.className
          )}
        >
          full-stack dev
        </p>
        <Image
          src={profile}
          alt='picture of Nikhil S'
          className='mx-auto aspect-[4/3] drop-shadow-md sm:absolute sm:right-4 sm:top-0 sm:w-[300px]'
          priority
          placeholder='blur'
        />
      </header>
      <section className='space-y-8'>
        <h2 className='mb-[0.25em] font-mono text-3xl font-bold after:block after:h-[2px] after:w-full after:bg-current dark:text-fluorescent after:dark:bg-fluorescent sm:text-5xl'>
          Get to Know Me
        </h2>
        <p className='text-lg sm:text-xl'>
          An ambitious and motivated software engineer with a strong foundation
          in web development, I possess a deep understanding of both front-end
          and backend development. This proficiency enables me to create
          comprehensive web solutions.
        </p>
        <Gallery />
        <p className='text-lg sm:text-xl'>
          My ability to adapt to new technologies and proficiency in debugging
          errors make me a quick learner. My passion for web development has
          driven me to acquire essential knowledge and skills in the field.
        </p>
        <Skills />
        <p className='text-lg sm:text-xl'>
          I am eager to continue learning and expanding my skillset, believing
          that my adaptability and willingness to learn make me a valuable asset
          to any development team.
        </p>
      </section>
    </section>
  );
}
