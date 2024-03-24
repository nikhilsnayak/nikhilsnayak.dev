import { Gallery } from "./gallery";
import { Skills } from "./skills";

export function AboutSection() {
  return (
    <section className="mb-4 mt-16 space-y-8" id="about">
      <h2 className="mb-[0.25em] text-5xl sm:text-7xl dark:text-fluorescent after:block after:w-full after:h-[2px] after:dark:bg-fluorescent after:bg-current font-bold">
        Get to Know Me
      </h2>
      <p className="text-xl sm:text-2xl">
        An ambitious and motivated software engineer with a strong foundation in
        web development, I possess a deep understanding of both front-end and
        backend development. This proficiency enables me to create comprehensive
        web solutions.
      </p>
      <Gallery />
      <p className="text-xl sm:text-2xl">
        My ability to adapt to new technologies and proficiency in debugging
        errors make me a quick learner. My passion for web development has
        driven me to acquire essential knowledge and skills in the field.
      </p>
      <Skills />
      <p className="text-xl sm:text-2xl">
        I am eager to continue learning and expanding my skillset, believing
        that my adaptability and willingness to learn make me a valuable asset
        to any development team.
      </p>
    </section>
  );
}
