'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-20 pb-8 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Please read our terms and conditions.
          </p>
          <p className="text-lg text-white/80">
            Terms of service content coming soon...
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}