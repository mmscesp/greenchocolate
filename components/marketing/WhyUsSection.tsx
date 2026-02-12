'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  BookOpen, 
  Shield, 
  Ticket, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Sparkles,
  Award,
  Fingerprint
} from 'lucide-react';

const features = [
  {
    id: 1,
    icon: BookOpen,
    title: 'Regulatory Wiki',
    description: 'Permanent, expert-reviewed knowledge nodes on laws, rights, and etiquette. We simplify the complexity of the Spanish legal grey zone.',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    glowColor: 'shadow-green-500/20',
    stat: '24/7 Updated',
  },
  {
    id: 2,
    icon: Shield,
    title: 'Confidence UI',
    description: 'Visual status indicators showing the reliability and safety level of every club. Real-time verification status you can trust.',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/20',
    stat: 'Real-time',
  },
  {
    id: 3,
    icon: Ticket,
    title: 'Verified Access',
    description: 'Standardized membership request workflows that prioritize your privacy and ensure compliance with club statutes.',
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    glowColor: 'shadow-purple-500/20',
    stat: '100% Private',
  },
];

const verificationPoints = [
  {
    icon: CheckCircle2,
    title: 'Legal Compliance Audit',
    description: 'Verified non-profit status and registration with the Regional Registry of Associations.',
  },
  {
    icon: Lock,
    title: 'Privacy Protection',
    description: 'GDPR-compliant handling of member data and secure pre-registration protocols.',
  },
  {
    icon: Eye,
    title: 'Transparency Policy',
    description: 'Clear communication of rules, membership fees, and association statutes.',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ y: -10 }}
      className="group relative"
    >
      <div className={`relative p-8 rounded-3xl border ${feature.borderColor} bg-white/5 backdrop-blur-sm transition-all duration-500 h-full overflow-hidden`}>
        {/* Gradient Background on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Glow Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />

        {/* Icon */}
        <motion.div 
          className={`relative w-20 h-20 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 mx-auto`}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 rounded-2xl`} />
          <Icon className={`h-10 w-10 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} style={{ color: 'inherit' }} />
          <div className={`absolute inset-0 flex items-center justify-center`}>
            <Icon className="h-10 w-10 text-white/80" />
          </div>
        </motion.div>

        {/* Stat Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${feature.bgColor} text-white/80 border ${feature.borderColor}`}>
            {feature.stat}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 transition-all">
          {feature.title}
        </h3>
        <p className="text-zinc-400 leading-relaxed text-center group-hover:text-zinc-300 transition-colors">
          {feature.description}
        </p>

        {/* Bottom Line Accent */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${feature.color} rounded-full group-hover:w-1/2 transition-all duration-500`} />
      </div>
    </motion.div>
  );
}

function VerificationMoat() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', 
            backgroundSize: '40px 40px' 
          }} />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-400 mb-6 border border-green-500/30">
                <Award className="h-4 w-4" />
                <span className="text-sm font-bold">Our Standard</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                The Verification{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  Moat
                </span>
              </h3>
              
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                We don't just list clubs. Every partner undergoes a multi-point verification process to ensure they operate within the strict legal framework of Spanish private associations.
              </p>
            </motion.div>

            {/* Verification Points */}
            <div className="space-y-6">
              {verificationPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex gap-4 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <Icon className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1 group-hover:text-green-400 transition-colors">
                        {point.title}
                      </h4>
                      <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        {point.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right - Trust Shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Outer Rings */}
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-80 h-80 border border-white/5 rounded-full"
            />
            <motion.div
              animate={{ rotate: isHovered ? -360 : 0 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute w-96 h-96 border border-white/5 rounded-full"
            />

            {/* Main Shield Container */}
            <div className="relative w-72 h-72">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/10 rounded-full blur-3xl" />
              
              {/* Pulse Effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-4 bg-gradient-to-br from-green-500/20 to-transparent rounded-full"
              />

              {/* Shield Icon */}
              <motion.div
                animate={{ 
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Shield className="w-32 h-32 text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]" />
              </motion.div>

              {/* Trust Stats Overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8,
                }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-sm rounded-full"
              >
                <Fingerprint className="h-8 w-8 text-green-400 mb-2" />
                <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Trust Score</p>
                <p className="text-5xl font-black text-green-400">100%</p>
                <p className="text-xs text-zinc-400 mt-1">Manual Verification</p>
              </motion.div>

              {/* Floating Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400/40 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${30 + (i % 2) * 30}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', 
          backgroundSize: '32px 32px' 
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-zinc-400 mb-6 border border-white/10">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-bold">Why Trust Us</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            The Verified{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500">
              Navigation Layer
            </span>
          </h2>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            We bridge the gap between complex local regulations and the visitor experience through rigorous standards.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Verification Moat */}
        <VerificationMoat />
      </div>
    </section>
  );
}
