import { Shield, FileCheck, MapPin } from 'lucide-react';

export default function RealityCheckSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The Reality Check</h2>
          <p className="mt-4 text-lg text-muted-foreground">Understand the rules before you arrive. Spain is not Amsterdam.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Private Associations</h3>
            <p className="text-muted-foreground">Clubs are private, non-profit organizations, not shops. Membership is required and often vetted.</p>
          </div>
          <div className="bg-background p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
             <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
              <FileCheck className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Residency & ID</h3>
            <p className="text-muted-foreground">Valid government photo ID is mandatory. Many clubs prioritize local residents over tourists.</p>
          </div>
          <div className="bg-background p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
             <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Public Fines</h3>
            <p className="text-muted-foreground">Public consumption and possession are illegal. Fines start at €601. Keep it private.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
