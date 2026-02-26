import { Calculator, ClipboardCheck, ArrowRight } from '@/lib/icons';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Tools</h1>
          <p className="text-xl text-gray-600">Smart utilities to help you navigate compliance and safety.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-2xl shadow-sm border group hover:border-green-500 transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <ClipboardCheck className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Eligibility Quiz</h2>
            <p className="text-gray-600 mb-6">Find out if you meet the legal requirements to join a private association in Spain.</p>
            <div className="flex items-center text-green-600 font-bold">
              Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-sm border group hover:border-green-500 transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Calculator className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Fine Estimator</h2>
            <p className="text-gray-600 mb-6">Understand the potential administrative fines for public possession or consumption under Organic Law 4/2015.</p>
            <div className="flex items-center text-green-600 font-bold">
              Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mt-20 bg-green-900 text-white p-12 rounded-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Want to be the first to use these tools?</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">Join our verified waitlist to get early access and our exclusive Visitor Safety Kit.</p>
          <button className="bg-card text-green-900 px-8 py-3 rounded-full font-bold hover:bg-green-50 transition-colors">
            Get Early Access
          </button>
        </div>
      </main>

    </div>
  );
}
