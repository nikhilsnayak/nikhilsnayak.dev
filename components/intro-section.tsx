import Image from 'next/image';
import { profile } from '@/assets/images';
import { Source_Code_Pro } from 'next/font/google';
import { cn } from '@/lib/utils';

const sourceCodePro = Source_Code_Pro({
  weight: ['400'],
  subsets: ['latin'],
});

export function IntroSection() {
  return (
    <section className='relative'>
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
    </section>
  );
}
