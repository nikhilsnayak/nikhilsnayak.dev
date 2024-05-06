import { Gallery } from './gallery';
import { Skills } from './skills';

export function AboutSection() {
  return (
    <section className='space-y-8'>
      <h2 className='mb-[0.25em] text-5xl font-bold after:block after:h-[2px] after:w-full after:bg-current dark:text-fluorescent after:dark:bg-fluorescent sm:text-7xl'>
        Get to Know Me
      </h2>
      <p className='text-lg sm:text-xl'>
        An ambitious and motivated software engineer with a strong foundation in
        web development, I possess a deep understanding of both front-end and
        backend development. This proficiency enables me to create comprehensive
        web solutions.
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
  );
}
