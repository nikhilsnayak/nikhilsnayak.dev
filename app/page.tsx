import Image from 'next/image';
import { profile } from '@/assets/images';
import { Source_Code_Pro } from 'next/font/google';
import { cn } from '@/lib/utils';
import { gImage1 } from '@/assets/images';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  HtmlIcon,
  CssIcon,
  JsIcon,
  ReactIcon,
  NextIcon,
  NodeJsIcon,
  NestIcon,
  TsIcon,
  TailwindIcon,
} from '@/assets/icons';

const skillsIcons = [
  HtmlIcon,
  CssIcon,
  TailwindIcon,
  JsIcon,
  TsIcon,
  ReactIcon,
  NextIcon,
  NodeJsIcon,
  NestIcon,
];

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
      <ul className='flex flex-wrap items-center gap-8'>
        {skillsIcons.map((Icon, index) => (
          <li className='h-8 w-8 sm:h-12 sm:w-12' key={index}>
            <Icon />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HomePage() {
  return (
    <section className='space-y-8'>
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
        <h2 className='mb-[0.25em] font-mono text-5xl font-bold after:block after:h-[2px] after:w-full after:bg-current dark:text-fluorescent after:dark:bg-fluorescent sm:text-7xl'>
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
