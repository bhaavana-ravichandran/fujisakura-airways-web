'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { isValidEmail } from '../../utils/inputValidation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or phone
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or phone number is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in real app, this would be API call
      console.log('Login attempt:', {
        identifier: formData.identifier,
        // Don't log passwords in production
      });
      
      // Successful login - redirect to home page
      router.push('/home');
      
    } catch (error) {
      setErrors({
        general: 'Login failed. Please check your credentials and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            minHeight: '380px'
          }}
        >
          <CardHeader style={{ textAlign: 'center', padding: '1.5rem 1.25rem 1rem 1.25rem' }}>
            <CardTitle 
              style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}
            >
              Welcome Back
            </CardTitle>
            <CardDescription 
              style={{
                color: '#718096',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}
            >
              Sign in to your account
            </CardDescription>
          </CardHeader>
          
          <CardContent style={{ padding: '0 1.25rem 1.5rem 1.25rem' }}>
            {errors.general && (
              <div style={styles.errorContainer}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={styles.formGroup}>
                <Label 
                  htmlFor="identifier"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  Email or Phone Number
                  <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>
                </Label>
                <Input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder="Enter your email or phone number"
                  autoComplete="username"
                  style={{
                    padding: '0.75rem 1rem',
                    border: errors.identifier ? '2px solid #e53e3e' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    background: 'white'
                  }}
                />
                {errors.identifier && (
                  <div style={styles.errorMessage}>{errors.identifier}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <Label 
                  htmlFor="password"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  Password
                  <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    padding: '0.75rem 1rem',
                    border: errors.password ? '2px solid #e53e3e' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    background: 'white'
                  }}
                />
                {errors.password && (
                  <div style={styles.errorMessage}>{errors.password}</div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                style={{
                  background: isLoading ? '#ccc' : 'linear-gradient(135deg, #007bff, #0056b3)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  marginTop: '0.5rem'
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div style={styles.linkContainer}>
              <Link href="/forgot-password" style={styles.link}>
                Forgot your password?
              </Link>
            </div>

            <div style={styles.signupContainer}>
              Don't have an account?{' '}
              <Link href="/signup" style={styles.link}>
                Sign up here
              </Link>
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
  
  linkContainer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem'
  },
  
  signupContainer: {
    textAlign: 'center',
    marginTop: '1.25rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500'
  }
};