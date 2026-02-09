import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  blurLevel?: 'medium' | 'heavy';
  label?: string;
}

export default function GatedContent({ blurLevel = 'medium', label = 'Members Only' }: Props) {
  const blurClass = blurLevel === 'heavy' ? 'blur-lg' : 'blur-md';
  
  return (
    <div className="relative overflow-hidden rounded-lg group">
      <div className={`${blurClass} select-none pointer-events-none opacity-50 bg-gray-100 p-4`}>
        <div className="space-y-3">
           <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
           <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
           <div className="h-4 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 z-10 p-4 text-center">
         <div className="bg-background/95 backdrop-blur-sm p-6 rounded-xl border shadow-lg max-w-sm w-full">
            <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{label}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join the community to view sensitive details like address and contact info.
            </p>
            <div className="grid gap-2">
              <Button size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                 <Link href="/register">Get Visitor Pass</Link>
              </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
