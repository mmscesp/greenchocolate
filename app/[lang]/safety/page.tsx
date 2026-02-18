'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EligibilityQuiz from '@/components/marketing/EligibilityQuiz';
import { Shield, AlertTriangle, Heart, Clock, ArrowRight, CheckCircle, Phone, MapPin, Users, Leaf, Brain, Activity } from 'lucide-react';

interface SafetyPageProps {
  params: Promise<{ lang: string }>;
}

const safetyCategories = [
  {
    id: 'edibles',
    title: 'Edibles & Concentrates',
    description: 'Different rules apply to infused products. Onset times and dosing differ significantly from smoking.',
    icon: Clock,
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tips: [
      'Wait 2+ hours before taking more - onset can take up to 2 hours',
      'Start with 5mg THC or less if you\'re new',
      'Effects last 4-12 hours vs 1-3 hours from smoking',
      'Edibles convert to more potent 11-hydroxy-THC in the liver'
    ]
  },
  {
    id: 'first-time',
    title: 'First Club Visit',
    description: 'What to expect at your first visit to a cannabis social club.',
    icon: Users,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    tips: [
      'Bring valid photo ID (passport or EU ID card)',
      'Most clubs are cash-only for consumption fees',
      'You\'ll sign a membership agreement and house rules',
      'Ask staff about their strains and consumption areas'
    ]
  },
  {
    id: 'medical',
    title: 'Medical Considerations',
    description: 'Important information for those with health conditions or on medications.',
    icon: Activity,
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
    tips: [
      'Cannabis can interact with blood pressure and heart medications',
      'Avoid if pregnant or breastfeeding',
      'Start low and go slow with any new product',
      'Consult your doctor if you have heart conditions'
    ]
  },
  {
    id: 'mental',
    title: 'Mental Health',
    description: 'Understanding the psychological effects of cannabis.',
    icon: Brain,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    tips: [
      'High doses can cause anxiety or paranoia in some people',
      'Take a break if you feel foggy or unmotivated',
      'Cannabis can trigger underlying mental health conditions',
      'Less is more - you can always take more, not less'
    ]
  }
];

export default function SafetyPage({ params }: SafetyPageProps) {
  const [lang, setLang] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ lang: resolvedLang }) => {
      setLang(resolvedLang);
      setTimeout(() => setIsLoading(false), 300);
    });
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero with Quiz */}
        <motion.section 
          className="rounded-3xl border bg-card shadow-lg shadow-primary/5 p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                  Knowledge is Safety
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                Responsible Use{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                  Guide
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Cannabis social clubs in Spain operate under a unique legal framework. 
                Understanding the rules, risks, and best practices ensures you have a safe, 
                enjoyable experience while respecting local laws.
              </p>

              <div className="flex flex-wrap gap-3">
                {['Evidence-based', '2026 Updated', 'Expert Reviewed'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-[380px] shrink-0">
              <EligibilityQuiz />
            </div>
          </div>
        </motion.section>

        {/* Safety Categories */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Essential Knowledge
            </h2>
            <p className="text-muted-foreground">
              Key information every club member should know
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="rounded-2xl border bg-card p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>
                </div>

                <ul className="space-y-3 mt-4">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Emergency */}
        <motion.section 
          className="rounded-3xl border border-red-200 bg-red-50 p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Emergency Information</h2>
              <p className="text-muted-foreground">
                Save these numbers. In case of medical emergency, be honest with healthcare providers about cannabis consumption.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-red-100">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-5 w-5 text-red-600" />
                <h3 className="font-bold text-foreground">EU Emergency</h3>
              </div>
              <p className="text-3xl font-black text-red-600 mb-2">112</p>
              <p className="text-sm text-muted-foreground">Ambulance, Police, Fire</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-red-100">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-red-600" />
                <h3 className="font-bold text-foreground">Barcelona Hospitals</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Hospital Clínic - C/ Villarroel 170</li>
                <li>Hospital de Sant Pau - C/ Sant Quintí 89</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-red-100">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-red-600" />
                <h3 className="font-bold text-foreground">Mossos d'Esquadra</h3>
              </div>
              <p className="text-3xl font-black text-red-600 mb-2">088</p>
              <p className="text-sm text-muted-foreground">Catalan Police (non-emergency)</p>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section 
          className="mt-12 rounded-3xl border bg-gradient-to-br from-primary/5 to-background p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Ready to find a club?</h3>
                <p className="text-muted-foreground">Browse verified cannabis social clubs.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href={`/${lang}/clubs`}>
                  Browse Clubs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
