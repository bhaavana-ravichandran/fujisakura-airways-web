'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-20 pb-8 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Your privacy is important to us.
          </p>
          <p className="text-lg text-white/80">
            Privacy policy content coming soon...
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}