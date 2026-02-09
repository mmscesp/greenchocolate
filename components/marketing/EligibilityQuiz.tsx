'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function EligibilityQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const questions = [
    {
      id: 'age',
      text: 'Are you over 18 or 21 years old?',
      desc: 'Most clubs require members to be at least 18, many 21+.'
    },
    {
      id: 'id',
      text: 'Do you have a valid government-issued photo ID?',
      desc: 'Passports or EU ID cards are generally required. Digital IDs are NOT accepted.'
    },
    {
      id: 'purpose',
      text: 'Are you joining for therapeutic or social reasons?',
      desc: 'Clubs are private associations for shared consumption, not for-profit shops.'
    }
  ];

  const handleAnswer = (answer: boolean) => {
    setAnswers({ ...answers, [questions[step].id]: answer });
    setStep(step + 1);
  };

  const isEligible = Object.values(answers).every(a => a === true);

  if (step >= questions.length) {
    return (
      <Card className="border-2 border-green-100 bg-green-50/30 overflow-hidden rounded-3xl">
        <CardContent className="p-8 text-center">
          {isEligible ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Likely Eligible</h3>
              <p className="text-zinc-600 mb-8">
                Based on your answers, you meet the basic requirements to request membership in most CSCs.
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-500 text-white rounded-xl py-6 font-bold text-lg">
                View Membership Guide <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Requirements Not Met</h3>
              <p className="text-zinc-600 mb-8">
                You might face difficulties joining a club at this time. Read our legal guide to understand the specific rules.
              </p>
              <Button variant="outline" className="w-full border-zinc-200 rounded-xl py-6 font-bold text-lg">
                Read Legal Guide
              </Button>
            </>
          )}
          <button 
            onClick={() => { setStep(0); setAnswers({}); }} 
            className="mt-6 text-sm font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest"
          >
            Restart Quiz
          </button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[step];

  return (
    <Card className="border-2 border-zinc-100 overflow-hidden shadow-xl rounded-3xl">
      <div className="bg-zinc-950 p-6 text-white flex justify-between items-center">
        <div>
          <Badge className="bg-blue-500 text-white border-none mb-2 uppercase tracking-tighter">Eligibility Check</Badge>
          <h3 className="text-xl font-bold">Can you join a CSC?</h3>
        </div>
        <UserCheck className="h-8 w-8 text-blue-400" />
      </div>
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Question {step + 1} of {questions.length}</span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`h-1 w-8 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-zinc-100'}`} />
              ))}
            </div>
          </div>
          <h4 className="text-xl font-bold text-zinc-900 mb-3">{currentQuestion.text}</h4>
          <p className="text-sm text-zinc-500 leading-relaxed">{currentQuestion.desc}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => handleAnswer(true)}
            className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl py-8 font-bold text-lg shadow-lg"
          >
            Yes
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleAnswer(false)}
            className="border-2 border-zinc-100 hover:bg-zinc-50 rounded-xl py-8 font-bold text-lg"
          >
            No
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
