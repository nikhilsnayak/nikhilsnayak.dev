import { AboutSection } from '@/components/about-section';
import { IntroSection } from '@/components/intro-section';

export default function HomePage() {
  return (
    <div className='space-y-8'>
      <IntroSection />
      <AboutSection />
    </div>
  );
}
