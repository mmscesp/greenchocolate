'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, MapPin, Camera, Lock, Shield, Sparkles } from 'lucide-react';

interface MistakeData {
  id: number;
  mistake: string;
  correction: string;
  explanation: string;
  icon: typeof MapPin;
  color: string;
  stat: string;
}

const mistakes: MistakeData[] = [
  {
    id: 1,
    mistake: 'Walking into a club off the street',
    correction: 'Private associations are not public spaces',
    explanation: 'CSCs are member-only. Prospective members must meet private association criteria to be considered.',
    icon: MapPin,
    color: 'from-amber-500 to-orange-600',
    stat: 'Strict entry protocols',
  },
  {
    id: 2,
    mistake: 'Consuming in public spaces',
    correction: 'Administrative fines: €601–€30,000',
    explanation: 'Public consumption is illegal and strictly enforced. Keep it private.',
    icon: AlertCircle,
    color: 'from-red-500 to-rose-600',
    stat: '€601 minimum fine',
  },
  {
    id: 3,
    mistake: 'Sharing locations on social media',
    correction: 'Privacy is the foundation of this culture',
    explanation: 'Discretion protects members and clubs. What happens in the club, stays in the club.',
    icon: Camera,
    color: 'from-violet-500 to-purple-600',
    stat: 'Zero tolerance policy',
  },
];

function MistakeCard({ data, isActive, onClick, index }: { 
  data: MistakeData; 
  isActive: boolean; 
  onClick: () => void;
  index: number;
}) {
  const Icon = data.icon;
  
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`relative cursor-pointer group ${isActive ? 'z-10' : 'z-0'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -8 }}
    >
      <motion.div
        layout
        className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${
          isActive ? 'shadow-2xl shadow-black/20' : 'shadow-lg hover:shadow-xl'
        }`}
        animate={{
          scale: isActive ? 1.05 : 1,
        }}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-10`} />
        
        {/* Active State Glow */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-20 blur-xl`}
          />
        )}

        <div className="relative p-8 bg-white/80 backdrop-blur-sm border border-gray-100">
          {/* Number Badge */}
          <div className="absolute top-4 right-4">
            <span className={`text-6xl font-black text-gray-100 group-hover:text-gray-200 transition-colors`}>
              0{index + 1}
            </span>
          </div>

          {/* Icon */}
          <motion.div
            animate={{
              rotate: isActive ? [0, -10, 10, 0] : 0,
              scale: isActive ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center mb-6 shadow-lg`}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {!isActive ? (
              <motion.div
                key="mistake"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Common Mistake</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {data.mistake}
                </h3>
                <p className="text-sm text-gray-500">Click to reveal the reality</p>
              </motion.div>
            ) : (
              <motion.div
                key="correction"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">The Reality</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                  {data.correction}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {data.explanation}
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-bold text-gray-900">{data.stat}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Hint */}
          <motion.div 
            className="mt-6 flex items-center gap-2 text-sm text-gray-400"
            animate={{ x: isActive ? 5 : 0 }}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isActive ? 'Click anywhere to close' : 'Click to learn more'}</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TouristMistakes() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-600 mb-6">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-bold">Reality Check</span>
        </div>
        <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">
          Spain is <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">not</span> Amsterdam
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Three common misconceptions that separate casual visitors from informed guests. 
          <span className="text-gray-900 font-semibold"> Respect the local culture.</span>
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {mistakes.map((mistake, index) => (
          <MistakeCard
            key={mistake.id}
            data={mistake}
            isActive={activeCard === mistake.id}
            onClick={() => handleCardClick(mistake.id)}
            index={index}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-gray-500 text-sm">
          Knowledge is your best protection. 
          <span className="text-green-600 font-semibold"> Stay informed, stay safe.</span>
        </p>
      </motion.div>
    </div>
  );
}
