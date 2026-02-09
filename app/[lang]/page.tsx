import HeroSection from '@/components/HeroSection';
import RealityCheckSection from '@/components/home/RealityCheckSection';
import CitySelectorSection from '@/components/home/CitySelectorSection';
import EditorialFeedSection from '@/components/home/EditorialFeedSection';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RealityCheckSection />
      <CitySelectorSection />
      <EditorialFeedSection />
      
      {/* FAQ Section */}
      <section className="py-20 md:py-28">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
              Common Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Know</h2>
          </div>
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
