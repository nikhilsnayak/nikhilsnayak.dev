'use client';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { useRouter } from 'next/navigation';

export function SummarizeButton({ blogTitle }: { blogTitle: string }) {
  const router = useRouter();

  const handleClick = () => {
    const searchParams = new URLSearchParams();
    searchParams.set('prompt', `Summarize "${blogTitle}" Blog`);
    router.push(`/bot?${searchParams.toString()}`);
  };

  return (
    <HoverBorderGradient
      containerClassName='rounded-full'
      as='button'
      onClick={handleClick}
      className='bg-background text-green-500'
    >
      summarize with zoro
    </HoverBorderGradient>
  );
}
