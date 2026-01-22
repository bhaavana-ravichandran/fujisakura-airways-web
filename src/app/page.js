'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
      <div className="relative z-20" style={{ height: '80px' }}>
        <Header />
      </div>
      
      {/* Main Hero Section */}
      <main 
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10" 
        style={{ 
          minHeight: 'calc(100vh - 160px)',
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-center" style={{ minHeight: '100%' }}>
          {/* Hero Card */}
          <div 
            className={`hero-card transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              textAlign: 'center',
              maxWidth: '450px',
              width: '100%',
              margin: '0 auto',
              padding: '2.5rem 2rem'
            }}
          >
            {/* Main Heading */}
            <h1 
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              Welcome to Fujisakura Airways
            </h1>
            
            {/* Subtitle */}
            <p 
              className={`text-base sm:text-lg text-gray-600 mb-8 leading-relaxed transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ 
                transitionDelay: '400ms',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}
            >
              Experience premium air travel with exceptional service and comfort.
              <br />
              <br />
              Your journey to extraordinary destinations begins here.
            </p>
            
            {/* Buttons */}
            <div 
              className={`flex flex-col gap-4 justify-center items-center mb-6 transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ 
                transitionDelay: '600ms',
                marginTop: '1.5rem'
              }}
            >
              <Link href="/login" style={{ width: '100%', maxWidth: '300px', marginBottom: '12px', textDecoration: 'none' }}>
                <button 
                  className="landing-button-primary"
                  style={{
                    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
                    width: '100%',
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign In
                </button>
              </Link>
              
              <Link href="/signup" style={{ width: '100%', maxWidth: '300px', textDecoration: 'none' }}>
                <button 
                  className="landing-button-secondary"
                  style={{
                    background: 'white',
                    color: '#374151',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    width: '100%',
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Create Account
                </button>
              </Link>
            </div>
            
            {/* Forgot Password Link */}
            <div 
              className={`transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ 
                transitionDelay: '800ms',
                marginTop: '1rem'
              }}
            >
              <Link 
                href="/forgot-password" 
                className="forgot-password-link"
                style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  display: 'inline-block',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'color 0.2s ease'
                }}
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <div className="relative z-20" style={{ height: '80px' }}>
        <Footer />
      </div>
    </div>
  );
}