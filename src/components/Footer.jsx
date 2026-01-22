'use client';

import Link from 'next/link';

export default function Footer() {
  const socialMediaIcons = [
    { name: 'Facebook', icon: '📘', href: 'https://facebook.com/fujisakuraairways' },
    { name: 'Instagram', icon: '📷', href: 'https://instagram.com/fujisakuraairways' },
    { name: 'Twitter', icon: '🐦', href: 'https://twitter.com/fujisakuraairways' },
    { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com/company/fujisakuraairways' }
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'MasterCard', icon: '💳' },
    { name: 'RuPay', icon: '💳' },
    { name: 'UPI', icon: '📱' },
    { name: 'Net Banking', icon: '🏦' }
  ];

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.container}>
        {/* Main Footer Content - Horizontal Layout */}
        <div style={footerStyles.mainContent}>
          {/* Company Info */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Fujisakura Airways</h3>
            <p style={footerStyles.description}>
              Experience premium air travel with exceptional service and comfort.
            </p>
          </div>

          {/* Social Media */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Follow Us</h3>
            <div style={footerStyles.socialGrid}>
              <div style={footerStyles.socialItem}>
                <a
                  href="https://facebook.com/fujisakuraairways"
                  style={footerStyles.socialIcon}
                  title="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://facebook.com/fujisakuraairways" style={footerStyles.footerLink} target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
              
              <div style={footerStyles.socialItem}>
                <a
                  href="https://instagram.com/fujisakuraairways"
                  style={footerStyles.socialIcon}
                  title="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E4405F">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/fujisakuraairways" style={footerStyles.footerLink} target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
              
              <div style={footerStyles.socialItem}>
                <a
                  href="https://twitter.com/fujisakuraairways"
                  style={footerStyles.socialIcon}
                  title="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/fujisakuraairways" style={footerStyles.footerLink} target="_blank" rel="noopener noreferrer">Twitter</a>
              </div>
              
              <div style={footerStyles.socialItem}>
                <a
                  href="https://linkedin.com/company/fujisakuraairways"
                  style={footerStyles.socialIcon}
                  title="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077B5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/fujisakuraairways" style={footerStyles.footerLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Legal</h3>
            <div style={footerStyles.linksHorizontal}>
              <Link href="/privacy" style={footerStyles.footerLink}>Privacy Policy</Link>
              <Link href="/terms" style={footerStyles.footerLink}>Terms of Service</Link>
              <Link href="/contact" style={footerStyles.footerLink}>Contact Us</Link>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Payment Methods</h3>
            <div style={footerStyles.paymentMethods}>
              {paymentMethods.map((method, index) => (
                <div key={index} style={footerStyles.paymentMethod} title={method.name}>
                  <span style={footerStyles.paymentIcon}>{method.icon}</span>
                  <span style={footerStyles.paymentText}>{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={footerStyles.bottomBar}>
          <div style={footerStyles.copyright}>
            © 2024 Fujisakura Airways. All rights reserved.
          </div>
          <div style={footerStyles.bottomLinks}>
            <span style={footerStyles.bottomText}>Made with ❤️ for travelers</span>
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
  
  mainContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '2rem',
    padding: '2rem 0 1rem 0'
  },
  
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    minWidth: '200px'
  },
  
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '0.5rem'
  },
  
  description: {
    fontSize: '0.85rem',
    color: '#6b7280',
    lineHeight: '1.4',
    maxWidth: '250px'
  },
  
  linksHorizontal: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  
  footerLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    whiteSpace: 'nowrap'
  },
  
  socialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    maxWidth: '200px'
  },
  
  socialItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  socialIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: '1px solid rgba(0, 123, 255, 0.2)'
  },
  
  iconEmoji: {
    fontSize: '1.1rem'
  },
  
  paymentMethods: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    maxWidth: '200px'
  },
  
  paymentMethod: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.3rem 0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '4px',
    border: '1px solid rgba(0, 123, 255, 0.2)',
    fontSize: '0.7rem'
  },
  
  paymentIcon: {
    fontSize: '0.8rem'
  },
  
  paymentText: {
    fontSize: '0.7rem',
    fontWeight: '500',
    color: '#374151'
  },
  
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1rem 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.3)'
  },
  
  copyright: {
    fontSize: '0.85rem',
    color: '#4a5568',
    fontWeight: '500'
  },
  
  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  bottomText: {
    fontSize: '0.85rem',
    color: '#6b7280',
    fontWeight: '500'
  }
};