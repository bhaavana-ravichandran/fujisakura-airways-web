'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.container}>
        <div style={footerStyles.content}>
          {/* Left side - Copyright */}
          <div style={footerStyles.copyright}>
            © 2024 Fujisakura Airways. All rights reserved.
          </div>
          
          {/* Right side - Links */}
          <div style={footerStyles.links}>
            <Link href="/privacy" style={footerStyles.link}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={footerStyles.link}>
              Terms of Service
            </Link>
            <Link href="/contact" style={footerStyles.link}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerStyles = {
  footer: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#4a5568',
    position: 'relative',
    zIndex: 10,
    marginTop: 'auto'
  },
  
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem'
  },
  
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1.5rem 0'
  },
  
  copyright: {
    fontSize: '0.9rem',
    color: '#4a5568',
    fontWeight: '500'
  },
  
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    fontSize: '0.9rem'
  },
  
  link: {
    color: '#007bff',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  }
};