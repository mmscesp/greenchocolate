import HeroSection from '@/components/HeroSection';
import RealityCheckSection from '@/components/home/RealityCheckSection';
import CitySelectorSection from '@/components/home/CitySelectorSection';
import EditorialFeedSection from '@/components/home/EditorialFeedSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RealityCheckSection />
      <CitySelectorSection />
      <EditorialFeedSection />
    </>
  );
}
