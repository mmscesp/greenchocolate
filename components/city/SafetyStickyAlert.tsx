import { AlertTriangle } from 'lucide-react';

export default function SafetyStickyAlert() {
  return (
    <div className="sticky top-0 z-40 w-full bg-yellow-500/90 text-black backdrop-blur-sm shadow-md">
      <div className="container py-2 flex items-center justify-center gap-2 text-sm font-semibold">
        <AlertTriangle className="h-4 w-4" />
        <span>Public consumption in Spain is ILLEGAL. Fines start at €601. Keep it private.</span>
      </div>
    </div>
  );
}
