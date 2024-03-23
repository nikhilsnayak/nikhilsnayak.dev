import Image from "next/image";
import { gImage1 } from "@/assets/images";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const images = [
  {
    src: gImage1,
    alt: "Me as Speaker at TechMang24 giving a talk on Next.js 14",
  },
] as const;

export function Gallery() {
  return (
    <div id="gallery">
      <h3 className="mb-[0.5em] text-2xl sm:text-4xl font-bold">Gallery :</h3>
      <ul className="flex items-center flex-wrap gap-8">
        {images.map((image, index) => (
          <li className="max-w-[450px]" key={index}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    className="object-cover rounded-sm drop-shadow-sm"
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
    </div>
  );
}
