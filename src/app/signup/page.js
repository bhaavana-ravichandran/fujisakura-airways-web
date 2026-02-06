'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import '../../styles/globals.css';

export default function SignupPage() {
  const router = useRouter();

  // Redirect to home immediately since we use modal system now
  useEffect(() => {
    router.push('/home');
  }, [router]);

  return (
    <div style={styles.container}>
      {/* Animated Planes Background */}
      <div style={styles.planesContainer}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.plane,
              top: `${15 + (i * 15)}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${15 + (i * 2)}s`,
              opacity: 0.2 + (i * 0.03)
            }}
          >
            ✈️
          </div>
        ))}
      </div>

      <main style={styles.main}>
        <Card 
          className="w-full relative z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '320px',
            width: '320px',
            minHeight: '200px'
          }}
        >
          <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
              Redirecting...
            </h2>
            <p style={{ color: '#718096', fontSize: '1rem' }}>
              Please use the Create Account option in the header to register.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #E0F6FF 75%, #F0F8FF 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  planesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  },
  
  plane: {
    position: 'absolute',
    fontSize: '1.2rem',
    animation: 'flyAcross linear infinite',
    left: '-100px'
  },
  
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    paddingTop: '100px',
    paddingBottom: '60px',
    position: 'relative',
    zIndex: 2,
    minHeight: 'calc(100vh - 160px)'
  },
  
  formGroup: {
    marginBottom: '0.5rem',
  },
  
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '0.4rem',
    display: 'block'
  },
  
  input: {
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    background: 'white',
    width: '100%'
  },
  
  errorContainer: {
    background: '#fee',
    color: '#c33',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    textAlign: 'center'
  },
  
  errorMessage: {
    color: '#e53e3e',
    fontSize: '0.8rem',
    marginTop: '0.25rem',
    fontWeight: '500',
  },
  
  signupContainer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  
  termsContainer: {
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.8rem',
    color: '#999',
    lineHeight: '1.4'
  },
  
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500'
  }
};