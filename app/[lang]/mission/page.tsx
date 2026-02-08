import { useLanguage } from '@/hooks/useLanguage';
import { Shield, CheckCircle, Eye, Lock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/Footer';

export default function MissionPage() {
  // Use a simple t function or wait for translation update
  // For now, hardcoding key sections while keeping i18n structure in mind
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mission: Trust & Transparency</h1>
          <p className="text-xl text-gray-600">We are building the verified navigation layer for Spain's cannabis social club culture.</p>
        </div>

        <div className="grid gap-12">
          <section className="bg-green-50 p-8 rounded-2xl border border-green-100">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Why We Exist</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Navigating the cannabis landscape in Spain can be complex and risky for visitors. Our mission is to provide a safe, compliance-first layer that prioritizes education, harm reduction, and privacy.
            </p>Section
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Verification Standards</h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Legal Compliance',
                  desc: 'We verify that every club is a registered non-profit association in accordance with Spanish law.',
                  icon: CheckCircle
                },
                {
                  title: 'Privacy First',
                  desc: 'Sensitive club details are never public. We use gated access to protect both clubs and members.',
                  icon: Lock
                },
                {
                  title: 'On-Site Vetting',
                  desc: 'Our team personally visits clubs to ensure they meet our high standards for safety and atmosphere.',
                  icon: Eye
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white border rounded-xl shadow-sm">
                  <item.icon className="h-6 w-6 text-green-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-12 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Trust Network</h2>
            <p className="text-gray-600 mb-8">Ready to navigate the culture safely?</p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
              Join the Waitlist
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
