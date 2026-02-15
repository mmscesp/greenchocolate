'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Info, Scale, ArrowRight, Banknote, Gavel } from 'lucide-react';

interface FineLevel {
  level: number;
  range: string;
  amount: string;
  title: string;
  desc: string;
  scenario: string;
  risk: string;
  riskColor: string;
  advice: string;
  icon: typeof AlertTriangle;
}

const fineLevels: FineLevel[] = [
  {
    level: 1,
    range: '€601 - €10,000',
    amount: '€601+',
    title: 'First Offense',
    desc: 'Public consumption or possession in non-sensitive areas',
    scenario: 'Smoking in a park or carrying in public',
    risk: 'High Risk',
    riskColor: 'from-yellow-400 to-orange-500',
    advice: 'Always consume within private club premises. Never carry visible amounts in public.',
    icon: AlertTriangle,
  },
  {
    level: 2,
    range: '€10,001 - €20,000',
    amount: '€10K+',
    title: 'Repeat/Sensitive Area',
    desc: 'Multiple offenses or consumption near schools, hospitals',
    scenario: 'Near schools, playgrounds, or repeat violations',
    risk: 'Severe Risk',
    riskColor: 'from-orange-500 to-red-500',
    advice: 'Police actively patrol sensitive zones. Distance yourself immediately from any restricted areas.',
    icon: Shield,
  },
  {
    level: 3,
    range: '€20,001 - €30,000+',
    amount: '€20K+',
    title: 'Aggravated Circumstances',
    desc: 'Obstruction, large quantities, or dealing suspicion',
    scenario: 'Resisting authority, commercial amounts, distribution',
    risk: 'Extreme Risk',
    riskColor: 'from-red-500 to-rose-600',
    advice: 'Never confront police. Comply immediately. Contact legal representation.',
    icon: Gavel,
  },
];

export default function FineCalculator() {
  const [severity, setSeverity] = useState(0);
  const currentFine = fineLevels[severity];
  const Icon = currentFine.icon;

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-t-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="h-5 w-5 text-white" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/90">Fine Calculator</span>
          </div>
          <h3 className="text-2xl font-bold">The Cost of Ignorance</h3>
          <p className="text-white/80 text-sm mt-1">Slide to see potential penalties</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-3xl shadow-xl border border-zinc-100 overflow-hidden">
        {/* Amount Display */}
        <div className="relative bg-gradient-to-br from-zinc-50 to-zinc-100 p-8 text-center border-b border-zinc-100">
          <motion.div
            key={severity}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="text-6xl font-black bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
              {currentFine.amount}
            </span>
            <p className="text-zinc-500 text-sm mt-2 font-medium">{currentFine.range}</p>
          </motion.div>
          
          {/* Risk Badge */}
          <motion.div 
            className="absolute top-4 right-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${currentFine.riskColor}`}>
              {currentFine.risk}
            </span>
          </motion.div>
        </div>

        <div className="p-6 space-y-6">
          {/* Custom Slider */}
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <span>Minor</span>
              <span>Serious</span>
              <span>Severe</span>
            </div>
            <div className="relative h-12 flex items-center">
              {/* Track Background */}
              <div className="absolute inset-x-0 h-3 bg-zinc-100 rounded-full" />
              
              {/* Progress Fill */}
              <motion.div 
                className="absolute left-0 h-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full"
                animate={{ width: `${((severity) / 2) * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              
              {/* Slider Handles */}
              <div className="absolute inset-x-0 flex items-center">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setSeverity(idx)}
                    className="absolute flex items-center justify-center"
                    style={{ left: `${(idx / 2) * 100}%`, transform: 'translateX(-50%)' }}
                  >
                    <motion.div
                      className={`w-8 h-8 rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
                        idx <= severity 
                          ? 'bg-white border-red-500 shadow-lg' 
                          : 'bg-zinc-200 border-transparent hover:bg-zinc-300'
                      } ${idx === severity ? 'scale-110' : 'scale-100'}`}
                      whileHover={{ scale: idx === severity ? 1.15 : 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {idx === severity && (
                        <motion.div
                          layoutId="activeSlider"
                          className="w-3 h-3 bg-red-500 rounded-full"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={severity}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100"
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentFine.riskColor} flex items-center justify-center shrink-0`}
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900 mb-1">{currentFine.title}</h4>
                  <p className="text-sm text-zinc-600 mb-2">{currentFine.desc}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Info className="h-3 w-3" />
                    <span className="italic">{currentFine.scenario}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Expert Advice */}
          <motion.div 
            className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400"
            whileHover={{ x: 5 }}
          >
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Expert Tip</span>
                <p className="text-sm text-blue-800 mt-1">{currentFine.advice}</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            className="w-full group bg-zinc-900 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Banknote className="h-5 w-5" />
            Download Legal Guide
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
