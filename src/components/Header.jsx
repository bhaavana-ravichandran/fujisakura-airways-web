'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import authManager from '../utils/auth';
import Toast from './Toast';

export default function Header() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Check authentication state on component mount
  useEffect(() => {
    const checkAuthState = () => {
      const isLoggedIn = authManager.isLoggedIn();
      const user = authManager.getCurrentUser();
      setIsAuthenticated(isLoggedIn);
      setCurrentUser(user);
    };

    checkAuthState();

    // Listen for auth state changes
    const handleAuthChange = (authState) => {
      setIsAuthenticated(authState.isAuthenticated);
      setCurrentUser(authState.user);
    };

    authManager.addListener(handleAuthChange);

    return () => {
      authManager.removeListener(handleAuthChange);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleSignInClick = () => {
    setShowProfileDropdown(false);
    setShowSignInModal(true);
  };

  const handleCreateAccountClick = () => {
    setShowProfileDropdown(false);
    setShowCreateAccountModal(true);
  };

  const handleSignOut = () => {
    authManager.signOut();
    setShowProfileDropdown(false);
    showToast('Successfully signed out!', 'info');
  };

  const closeModals = () => {
    setShowSignInModal(false);
    setShowCreateAccountModal(false);
  };

  return (
    <>
      <header style={headerStyles.header}>
        <div style={headerStyles.container}>
          <div style={headerStyles.content}>
            {/* Left side - Logo */}
            <Link href="/home" style={headerStyles.logoLink}>
              <div style={headerStyles.logo}>
                <span style={headerStyles.logoIcon}>✈️</span>
                <span style={headerStyles.logoText}>Fujisakura Airways</span>
              </div>
            </Link>
            
            {/* Center - Navigation */}
            <nav style={headerStyles.nav}>
              <Link 
                href="/home" 
                style={headerStyles.navLink}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                Home
              </Link>
              <Link 
                href="/flights" 
                style={headerStyles.navLink}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                Flights
              </Link>
              <Link 
                href="/my-bookings" 
                style={headerStyles.navLink}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                My Bookings
              </Link>
            </nav>

            {/* Right side - Support & Profile */}
            <div style={headerStyles.rightSection}>
              <Link 
                href="/support" 
                style={headerStyles.supportLink}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                Support
              </Link>

              {/* Profile Dropdown */}
              <div style={headerStyles.profileContainer}>
                <button 
                  onClick={handleProfileClick}
                  style={headerStyles.profileButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  👤
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div style={headerStyles.dropdown}>
                    {isAuthenticated ? (
                      <>
                        <div style={headerStyles.userInfo}>
                          <span style={headerStyles.userName}>
                            {currentUser?.fullName || currentUser?.email || 'User'}
                          </span>
                        </div>
                        <button 
                          onClick={handleSignOut}
                          style={headerStyles.dropdownItem}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={handleSignInClick}
                          style={headerStyles.dropdownItem}
                        >
                          Sign In
                        </button>
                        <button 
                          onClick={handleCreateAccountClick}
                          style={headerStyles.dropdownItem}
                        >
                          Create Account
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sign In Modal */}
      {showSignInModal && (
        <div style={modalStyles.overlay} onClick={closeModals}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <h2 style={modalStyles.title}>Sign In</h2>
              <button onClick={closeModals} style={modalStyles.closeButton}>×</button>
            </div>
            <div style={modalStyles.content}>
              <SignInForm onSuccess={(message, type) => {
                showToast(message, type);
                closeModals();
              }} onForgotPassword={() => {
                closeModals();
                window.location.href = '/forgot-password';
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateAccountModal && (
        <div style={modalStyles.overlay} onClick={closeModals}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <h2 style={modalStyles.title}>Create Account</h2>
              <button onClick={closeModals} style={modalStyles.closeButton}>×</button>
            </div>
            <div style={modalStyles.content}>
              <CreateAccountForm onSuccess={(message, type) => {
                showToast(message, type);
                closeModals();
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div 
          style={headerStyles.dropdownOverlay} 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}

// Enhanced Sign In Form Component with Toast notifications
function SignInForm({ onForgotPassword, onSuccess }) {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'

  // Detect if input is email or phone
  const detectLoginMethod = (value) => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (phoneRegex.test(value.replace(/\D/g, ''))) {
      setLoginMethod('phone');
    } else if (emailRegex.test(value)) {
      setLoginMethod('email');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const cleanPhone = formData.emailOrPhone.replace(/\D/g, '');
      
      if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(cleanPhone)) {
        newErrors.emailOrPhone = 'Please enter a valid email or 10-digit phone number';
      }
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === 'emailOrPhone') {
      // Allow only digits for phone or email format
      if (/^\d+$/.test(value)) {
        // If only digits, limit to 10 and format as phone
        value = value.slice(0, 10);
      }
      detectLoginMethod(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Frontend-only: simulate successful sign in
      const userData = {
        email: formData.emailOrPhone,
        fullName: 'Demo User',
        loginMethod: loginMethod
      };
      
      // Sign in through auth manager
      authManager.signIn(userData);
      
      // Show success toast and close modal
      onSuccess('Successfully signed in!', 'success');
    }
  };

  return (
    <div style={formStyles.container}>
      <form onSubmit={handleSubmit}>
        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>
            Email or Phone Number
          </label>
          <input 
            type="text"
            value={formData.emailOrPhone}
            onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
            placeholder={loginMethod === 'phone' ? 'Enter 10-digit phone number' : 'Enter your email or phone'}
            style={{
              ...formStyles.input,
              borderColor: errors.emailOrPhone ? '#ef4444' : '#d1d5db'
            }}
          />
          {errors.emailOrPhone && (
            <span style={formStyles.errorText}>{errors.emailOrPhone}</span>
          )}
          <div style={formStyles.helperText}>
            {loginMethod === 'phone' ? '📱 Phone number detected' : '📧 Email format detected'}
          </div>
        </div>
        
        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Password</label>
          <input 
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter your password"
            style={{
              ...formStyles.input,
              borderColor: errors.password ? '#ef4444' : '#d1d5db'
            }}
          />
          {errors.password && (
            <span style={formStyles.errorText}>{errors.password}</span>
          )}
        </div>
        
        <button type="submit" style={formStyles.submitButton}>
          Sign In
        </button>
        
        <div style={formStyles.linkContainer}>
          <button 
            type="button"
            onClick={onForgotPassword}
            style={formStyles.link}
          >
            Forgot your password?
          </button>
        </div>
      </form>
    </div>
  );
}

// Enhanced Create Account Form Component with phone number and validation
function CreateAccountForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Full name can only contain letters and spaces';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === 'fullName') {
      // Only allow letters and spaces
      value = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (field === 'phoneNumber') {
      // Only allow digits, limit to 10
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Frontend-only: simulate successful account creation
      const userData = {
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber
      };
      
      // Sign in through auth manager
      authManager.signIn(userData);
      
      // Show success toast and close modal
      onSuccess('Account created successfully!', 'success');
    }
  };

  return (
    <div style={formStyles.container}>
      <form onSubmit={handleSubmit}>
        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Full Name</label>
          <input 
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            style={{
              ...formStyles.input,
              borderColor: errors.fullName ? '#ef4444' : '#d1d5db'
            }}
          />
          {errors.fullName && (
            <span style={formStyles.errorText}>{errors.fullName}</span>
          )}
        </div>
        
        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Email Address</label>
          <input 
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            style={{
              ...formStyles.input,
              borderColor: errors.email ? '#ef4444' : '#d1d5db'
            }}
          />
          {errors.email && (
            <span style={formStyles.errorText}>{errors.email}</span>
          )}
        </div>
        
        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Phone Number</label>
          <input 
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="Enter 10-digit phone number"
            style={{
              ...formStyles.input,
              borderColor: errors.phoneNumber ? '#ef4444' : '#d1d5db'
            }}
          />
          {errors.phoneNumber && (
            <span style={formStyles.errorText}>{errors.phoneNumber}</span>
          )}
          <div style={formStyles.helperText}>
            📱 We'll use this for booking confirmations
          </div>
        </div>
        
        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Password</label>
          <input 
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a password (min 6 characters)"
            style={{
              ...formStyles.input,
              borderColor: errors.password ? '#ef4444' : '#d1d5db'
            }}
          />
          {errors.password && (
            <span style={formStyles.errorText}>{errors.password}</span>
          )}
        </div>
        
        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Confirm Password</label>
          <input 
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            style={{
              ...formStyles.input,
              borderColor: errors.confirmPassword ? '#ef4444' : '#d1d5db'
            }}
          />
          {errors.confirmPassword && (
            <span style={formStyles.errorText}>{errors.confirmPassword}</span>
          )}
        </div>
        
        <button type="submit" style={formStyles.submitButton}>
          Create Account
        </button>
      </form>
    </div>
  );
}

const headerStyles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 0',
    minHeight: '70px'
  },
  
  logoLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'white',
    transition: 'all 0.3s ease'
  },
  
  logoIcon: {
    fontSize: '1.8rem'
  },
  
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '700',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  
  navLink: {
    color: '#1f2937',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },

  supportLink: {
    color: '#1f2937',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },

  profileContainer: {
    position: 'relative'
  },

  profileButton: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },

  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    minWidth: '160px',
    zIndex: 1001
  },

  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    borderRadius: '8px'
  },

  userInfo: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '0.5rem'
  },

  userName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2d3748',
    display: 'block'
  },

  dropdownOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999
  }
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(4px)'
  },

  modal: {
    background: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem 1.5rem 0 1.5rem',
    borderBottom: '1px solid #f1f5f9'
  },

  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },

  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'color 0.2s ease'
  },

  content: {
    padding: '1.5rem'
  }
};

const formStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151'
  },

  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    outline: 'none'
  },

  submitButton: {
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem'
  },

  linkContainer: {
    textAlign: 'center',
    marginTop: '0.5rem'
  },

  link: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    textDecoration: 'underline'
  },

  errorText: {
    color: '#ef4444',
    fontSize: '0.8rem',
    marginTop: '0.25rem'
  },

  helperText: {
    color: '#6b7280',
    fontSize: '0.8rem',
    marginTop: '0.25rem',
    fontStyle: 'italic'
  }
};