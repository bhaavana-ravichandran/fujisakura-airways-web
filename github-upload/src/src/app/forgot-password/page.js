'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { validateForgotPasswordForm } from '../../utils/helpers';
import '../../styles/globals.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email || email.trim() === '') {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to send reset email
      console.log('Password reset request for:', email);
      
      // Show success state
      setIsSubmitted(true);
      
    } catch (error) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={styles.container}>
        {/* Animated Planes Background */}
        <div style={styles.planesContainer}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.plane,
                top: `${20 + (i * 20)}%`,
                animationDelay: `${i * 4}s`,
                animationDuration: `${18 + (i * 2)}s`,
                opacity: 0.15 + (i * 0.05)
              }}
            >
              ✈️
            </div>
          ))}
        </div>

        <main style={styles.main}>
          <Card 
            className="w-full max-w-md relative z-10"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <CardHeader style={{ textAlign: 'center', padding: '2rem 2rem 1rem 2rem' }}>
              <CardTitle 
                style={{
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem'
                }}
              >
                Check Your Email
              </CardTitle>
              <CardDescription 
                style={{
                  color: '#718096',
                  fontSize: '0.95rem'
                }}
              >
                We've sent password reset instructions to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            
            <CardContent style={{ padding: '0 2rem 2rem 2rem' }}>
              <div style={{
                textAlign: 'center',
                padding: '2rem 0',
                color: '#27ae60'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  ✉️
                </div>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6',
                  marginBottom: '2rem'
                }}>
                  Please check your email and click the link to reset your password. 
                  If you don't see the email, check your spam folder.
                </p>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                >
                  Send Another Email
                </Button>
                
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <Button 
                    style={{
                      background: '#f8f9fa',
                      color: '#333',
                      border: '1px solid #e1e5e9',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: '100%'
                    }}
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Animated Planes Background */}
      <div style={styles.planesContainer}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.plane,
              top: `${20 + (i * 20)}%`,
              animationDelay: `${i * 4}s`,
              animationDuration: `${18 + (i * 2)}s`,
              opacity: 0.15 + (i * 0.05)
            }}
          >
            ✈️
          </div>
        ))}
      </div>

      <main style={styles.main}>
        <Card 
          className="w-full max-w-md relative z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <CardHeader style={{ textAlign: 'center', padding: '2rem 2rem 1rem 2rem' }}>
            <CardTitle 
              style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}
            >
              Forgot Password
            </CardTitle>
            <CardDescription 
              style={{
                color: '#718096',
                fontSize: '0.95rem'
              }}
            >
              Enter your registered email address. We'll send you instructions to reset your password.
            </CardDescription>
          </CardHeader>
          
          <CardContent style={{ padding: '0 2rem 2rem 2rem' }}>
            {error && (
              <div style={styles.errorContainer}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={styles.formGroup}>
                <Label 
                  htmlFor="email"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  Email Address
                  <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  style={{
                    padding: '0.75rem 1rem',
                    border: error ? '2px solid #e53e3e' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    background: 'white'
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                style={{
                  background: isLoading ? '#ccc' : 'linear-gradient(135deg, #007bff, #0056b3)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%'
                }}
              >
                {isLoading ? 'Sending Instructions...' : 'Reset Password'}
              </Button>
            </form>

            <div style={styles.linkContainer}>
              Remember your password?{' '}
              <Link href="/login" style={styles.link}>
                Back to Login
              </Link>
            </div>

            <div style={styles.supportContainer}>
              Need help? Contact our{' '}
              <a href="#" style={styles.link}>
                customer support
              </a>
            </div>
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
    padding: '2rem',
    position: 'relative',
    zIndex: 2
  },
  
  formGroup: {
    marginBottom: '0.5rem',
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
  
  linkContainer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  
  supportContainer: {
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