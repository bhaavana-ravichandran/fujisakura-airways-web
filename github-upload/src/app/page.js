'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden landing-page-bg"
      style={{
        background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #E0F6FF 75%, #F0F8FF 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Flying Airplanes Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute airplane-emoji animate-fly-across"
            style={{
              top: `${15 + (i * 15)}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${15 + (i * 2)}s`,
              opacity: 0.3 + (i * 0.05),
              fontSize: '1.5rem',
              left: '-100px',
              color: '#333',
              textShadow: '0 0 2px rgba(0,0,0,0.3)'
            }}
          >
            ✈️
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>
      
      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Main Heading */}
            <h1 
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              Welcome to Fujisakura Airways
            </h1>
            
            {/* Subtitle */}
            <p 
              className={`text-lg sm:text-xl lg:text-2xl text-black mb-12 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              Experience premium air travel with exceptional service and comfort.
              <br className="hidden sm:block" />
              Your journey begins here.
            </p>
            
            {/* Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <Link href="/login">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[140px]"
                >
                  Sign In
                </Button>
              </Link>
              
              <Link href="/signup">
                <Button 
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-black border-2 border-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[140px]"
                >
                  Create Account
                </Button>
              </Link>
            </div>
            
            {/* Forgot Password Link */}
            <div 
              className={`transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <Link 
                href="/forgot-password" 
                className="text-black underline hover:text-gray-700 transition-colors duration-300 font-medium"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}