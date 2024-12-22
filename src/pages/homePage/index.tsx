import AboutUs from './AboutUs.tsx';
import { Hero } from './Hero.tsx';

export function HomePage() {
  return (
    <div className="flex flex-col h-full grid-cols-1 gap-6 py-6 bg-gray-50">
      <Hero />
      <AboutUs />
    </div>
  );
}
