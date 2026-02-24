import { Shield, FileCheck, MapPin } from '@/lib/icons';

export default function RealityCheckSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Reality Check</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand the rules before you arrive. Spain is not Amsterdam.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-card border rounded-xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
            <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Private Associations</h3>
            <p className="text-muted-foreground">Clubs are private, non-profit organizations, not shops. Membership is required and often vetted.</p>
          </div>
          <div className="bg-card border rounded-xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
             <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <FileCheck className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Residency & ID</h3>
            <p className="text-muted-foreground">Valid government photo ID is mandatory. Many clubs prioritize local residents over tourists.</p>
          </div>
          <div className="bg-card border rounded-xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
             <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Public Fines</h3>
            <p className="text-muted-foreground">Public consumption and possession are illegal. Fines start at €601. Keep it private.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
