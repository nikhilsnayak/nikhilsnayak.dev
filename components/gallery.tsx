import Image from 'next/image';
import { gImage1 } from '@/assets/images';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const images = [
  {
    src: gImage1,
    alt: 'Me as Speaker at TechMang24 giving a talk on Next.js 14',
  },
] as const;

export function Gallery() {
  return (
    <div id='gallery'>
      <h3 className='mb-[0.5em] text-2xl font-bold sm:text-4xl'>Gallery :</h3>
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
    </div>
  );
}
