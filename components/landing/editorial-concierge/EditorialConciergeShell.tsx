import EditorialConciergeFlow from '@/components/landing/editorial-concierge/EditorialConciergeFlow';
import EditorialConciergeEnhancements from '@/components/landing/editorial-concierge/EditorialConciergeEnhancements';

export default function EditorialConciergeShell() {
  return (
    <section className="relative overflow-hidden bg-bg-base">
      <EditorialConciergeEnhancements />
      <EditorialConciergeFlow />
    </section>
  );
}
