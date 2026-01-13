'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { validateSignupForm, formatPhoneNumber } from '../../utils/helpers';
import '../../styles/globals.css';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number as user types
    let formattedValue = value;
    if (name === 'phone') {
      // Only allow digits and common phone formatting characters
      formattedValue = value.replace(/[^\d\s\-\(\)]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time password match validation
    if (name === 'confirmPassword' || name === 'password') {
      const password = name === 'password' ? formattedValue : formData.password;
      const confirmPassword = name === 'confirmPassword' ? formattedValue : formData.confirmPassword;
      
      if (confirmPassword && password !== confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (confirmPassword && password === confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateSignupForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in real app, this would be API call
      console.log('Signup attempt:', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        // Don't log passwords in production
      });
      
      // Successful registration - redirect to home page
      router.push('/home');
      
    } catch (error) {
      setErrors({
        general: 'Registration failed. Please try again.'
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
          className="w-full max-w-lg relative z-10"
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
              Create Account
            </CardTitle>
            <CardDescription 
              style={{
                color: '#718096',
                fontSize: '0.95rem'
              }}
            >
              Join Fujisakura Airways for exclusive benefits
            </CardDescription>
          </CardHeader>
          
          <CardContent style={{ padding: '0 2rem 2rem 2rem' }}>
            {errors.general && (
              <div style={styles.errorContainer}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={styles.formGroup}>
                <Label htmlFor="fullName" style={styles.label}>
                  Full Name <span style={{ color: '#e74c3c' }}>*</span>
                </Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  style={{
                    ...styles.input,
                    border: errors.fullName ? '2px solid #e53e3e' : '2px solid #e2e8f0'
                  }}
                />
                {errors.fullName && (
                  <div style={styles.errorMessage}>{errors.fullName}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <Label htmlFor="email" style={styles.label}>
                  Email Address <span style={{ color: '#e74c3c' }}>*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  style={{
                    ...styles.input,
                    border: errors.email ? '2px solid #e53e3e' : '2px solid #e2e8f0'
                  }}
                />
                {errors.email && (
                  <div style={styles.errorMessage}>{errors.email}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <Label htmlFor="phone" style={styles.label}>
                  Phone Number <span style={{ color: '#e74c3c' }}>*</span>
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  style={{
                    ...styles.input,
                    border: errors.phone ? '2px solid #e53e3e' : '2px solid #e2e8f0'
                  }}
                />
                {errors.phone && (
                  <div style={styles.errorMessage}>{errors.phone}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <Label htmlFor="password" style={styles.label}>
                  Password <span style={{ color: '#e74c3c' }}>*</span>
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password (min. 8 characters)"
                  autoComplete="new-password"
                  style={{
                    ...styles.input,
                    border: errors.password ? '2px solid #e53e3e' : '2px solid #e2e8f0'
                  }}
                />
                {errors.password && (
                  <div style={styles.errorMessage}>{errors.password}</div>
                )}
              </div>

              <div style={styles.formGroup}>
                <Label htmlFor="confirmPassword" style={styles.label}>
                  Confirm Password <span style={{ color: '#e74c3c' }}>*</span>
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  style={{
                    ...styles.input,
                    border: errors.confirmPassword ? '2px solid #e53e3e' : '2px solid #e2e8f0'
                  }}
                />
                {errors.confirmPassword && (
                  <div style={styles.errorMessage}>{errors.confirmPassword}</div>
                )}
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div style={styles.signupContainer}>
              Already have an account?{' '}
              <Link href="/login" style={styles.link}>
                Sign in here
              </Link>
            </div>

            <div style={styles.termsContainer}>
              By creating an account, you agree to our{' '}
              <a href="#" style={styles.link}>Terms of Service</a>{' '}
              and{' '}
              <a href="#" style={styles.link}>Privacy Policy</a>
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
  
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '0.5rem',
    display: 'block'
  },
  
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '1rem',
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