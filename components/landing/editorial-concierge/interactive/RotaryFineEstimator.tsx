'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { PREMIUM_SPRING } from '../motion/config';
import { AlertTriangle, MapPin, Users, Building2, Dumbbell } from '@/lib/icons';

interface FineScenario {
  amount: string;
  label: string;
  risk: 'Low' | 'Medium' | 'High';
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  scenarios: string[];
}

const LEVELS: FineScenario[] = [
  { 
    amount: '€601', 
    label: 'Minor', 
    risk: 'Low', 
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    icon: AlertTriangle,
    scenarios: [
      'Carrying outside the association premises',
      'Minor possession in public view',
      'First-time administrative warning'
    ]
  },
  { 
    amount: '€10,400', 
    label: 'Serious', 
    risk: 'Medium', 
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: MapPin,
    scenarios: [
      'Consumption in public spaces near schools',
      'Group gatherings in residential zones',
      'Noise complaints from neighbors'
    ]
  },
  { 
    amount: '€30,000', 
    label: 'Severe', 
    risk: 'High', 
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: Building2,
    scenarios: [
      'Operating without proper association license',
      'Commercial sale or advertising',
      'Distribution to non-members',
      'Minors on premises'
    ]
  },
];

export function RotaryFineEstimator() {
  const [level, setLevel] = useState(0);
  const current = LEVELS[level];
  const Icon = current.icon;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Fine Display */}
      <motion.div
        key={level}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={PREMIUM_SPRING}
        className="text-center mb-8"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${current.bgColor} ${current.borderColor} border mb-4`}>
          <Icon className={`w-4 h-4 ${current.color}`} />
          <span className={`font-mono text-xs uppercase tracking-wider ${current.color}`}>
            {current.risk} Risk
          </span>
        </div>
        <div className={`text-6xl font-black font-mono mb-2 ${current.color}`}>
          {current.amount}
        </div>
        <ConciergeLabel emphasis="medium" className="text-muted-foreground">
          Maximum Administrative Penalty
        </ConciergeLabel>
      </motion.div>
      
      {/* Scenario List - THIS IS WHAT MATTERS */}
      <motion.div
        key={`scenarios-${level}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm"
      >
        <div className={`p-5 rounded-2xl ${current.bgColor} border ${current.borderColor}`}>
          <ConciergeLabel size="xs" emphasis="medium" className="text-muted-foreground mb-3 block">
            Triggered by:
          </ConciergeLabel>
          <ul className="space-y-2">
            {current.scenarios.map((scenario, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className={`w-1.5 h-1.5 rounded-full ${current.color.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                {scenario}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
      
      {/* Level Selector */}
      <div className="w-full max-w-sm mt-10 px-4">
        <div className="relative h-2 bg-muted rounded-full">
          {/* Progress bar */}
          <motion.div 
            className={`absolute left-0 h-full rounded-full ${current.bgColor.replace('/10', '/40')}`}
            animate={{ width: `${(level / 2) * 100}%` }}
            transition={PREMIUM_SPRING}
          />
          
          {/* Snap points */}
          <div className="absolute inset-0 flex justify-between items-center -top-[5px]">
            {LEVELS.map((l, i) => (
              <button 
                key={i}
                onClick={() => setLevel(i)}
                className={`
                  min-h-11 min-w-11 sm:min-h-5 sm:min-w-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                  ${i <= level 
                    ? `${l.bgColor} ${l.borderColor} border-2` 
                    : 'bg-muted border-border hover:border-muted-foreground/30'
                  }
                `}
              >
                {i <= level && <span className={`w-1.5 h-1.5 rounded-full ${l.color.replace('text-', 'bg-')}`} />}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between w-full mt-6">
          {LEVELS.map((l, i) => (
            <button 
              key={i} 
              onClick={() => setLevel(i)}
              className={`
                font-mono text-xs uppercase tracking-wide transition-all duration-300 px-2 py-1 rounded-lg
                ${level === i 
                  ? `${l.bgColor} ${l.color} font-bold` 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
