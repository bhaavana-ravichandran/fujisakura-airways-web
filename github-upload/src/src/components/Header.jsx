'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header style={headerStyles.header}>
      <div style={headerStyles.container}>
        <div style={headerStyles.content}>
          {/* Left side - Logo */}
          <Link href="/" style={headerStyles.logoLink}>
            <div style={headerStyles.logo}>
              <span style={headerStyles.logoIcon}>✈️</span>
              <span style={headerStyles.logoText}>Fujisakura Airways</span>
            </div>
          </Link>
          
          {/* Right side - Navigation */}
          <nav style={headerStyles.nav}>
            <Link 
              href="/" 
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
              Landing
            </Link>
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
              href="/support" 
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
              Support
            </Link>
          </nav>
        </div>
      </div>
    </header>
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
    gap: '2.5rem'
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
  }
};