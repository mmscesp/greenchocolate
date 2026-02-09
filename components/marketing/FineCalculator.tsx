'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FineCalculator() {
  const [severity, setSeverity] = useState(1);
  
  const fines = [
    {
      level: 1,
      range: '€601 - €10,000',
      title: 'Minor Violation',
      desc: 'First-time public consumption or possession in a non-sensitive area.',
      risk: 'High',
      advice: 'Keep your consumption private and within the club.'
    },
    {
      level: 2,
      range: '€10,001 - €20,000',
      title: 'Serious Violation',
      desc: 'Repeat offenses or consumption near schools/public parks.',
      risk: 'Severe',
      advice: 'The law treats proximity to children very strictly.'
    },
    {
      level: 3,
      range: '€20,001 - €30,000+',
      title: 'Very Serious Violation',
      desc: 'Obstruction of justice, large quantities, or repeat serious offenses.',
      risk: 'Extreme',
      advice: 'Avoid any confrontation or public display of possession.'
    }
  ];

  const currentFine = fines[severity - 1];

  return (
    <Card className="border-2 border-zinc-100 overflow-hidden shadow-2xl rounded-3xl">
      <div className="bg-zinc-950 p-6 text-white flex justify-between items-center">
        <div>
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-none mb-2">Legal Reality Check</Badge>
          <h3 className="text-xl font-bold">Public Consumption Risk</h3>
        </div>
        <ShieldAlert className="h-8 w-8 text-red-500" />
      </div>
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex justify-between mb-4 items-end">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Offense Severity</span>
            <span className="text-2xl font-black text-red-600">{currentFine.range}</span>
          </div>
          <Slider 
            defaultValue={[1]} 
            max={3} 
            min={1} 
            step={1} 
            onValueChange={(val) => setSeverity(val[0])}
            className="mb-2"
          />
          <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
            <span>Minor</span>
            <span>Serious</span>
            <span>Very Serious</span>
          </div>
        </div>

        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 mb-6">
          <div className="flex gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
            <h4 className="font-bold text-zinc-900">{currentFine.title}</h4>
          </div>
          <p className="text-sm text-zinc-600 mb-4">{currentFine.desc}</p>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-zinc-400">ENFORCEMENT RISK:</span>
            <span className="text-red-600 uppercase">{currentFine.risk}</span>
          </div>
        </div>

        <div className="flex gap-4 items-start bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed italic">
            <strong>Expert Advice:</strong> {currentFine.advice}
          </p>
        </div>

        <Button className="w-full mt-8 bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl py-6 font-bold">
          Download Full Legal Guide (PDF)
        </Button>
      </CardContent>
    </Card>
  );
}
