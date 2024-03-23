import Image from "next/image";
import { profile } from "@/assets/images";
import { Source_Code_Pro } from "next/font/google";
import { cn } from "@/lib/utils";

const sourceCodePro = Source_Code_Pro({
  weight: ["400"],
  subsets: ["latin"],
});

export function IntroSection() {
  return (
    <section
      className="relative sm:mx-auto sm:max-w-screen-md my-8"
      id="introduction"
    >
      <h1 className="mb-[0.25em] text-5xl sm:text-7xl font-light">
        Hi, I am <strong className="block font-extrabold">Nikhil S</strong>
      </h1>
      <p
        className={cn(
          "text-xl sm:text-2xl bg-fluorescent mb-[1em] py-[0.25em] px-[1em] text-slate-800",
          sourceCodePro.className,
        )}
      >
        full-stack dev
      </p>
      <Image
        src={profile}
        alt="picture of Nikhil S"
        className="drop-shadow-md sm:absolute sm:top-0 sm:right-4 aspect-[4/3] sm:w-[300px] mx-auto"
        priority
      />
    </section>
  );
}
