import { AboutSection } from "@/components/about-section";
import { IntroSection } from "@/components/intro-section";

export default function Home() {
  return (
    <div>
      <main>
        <IntroSection />
        <AboutSection />
      </main>
    </div>
  );
}
