'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ 
  customPath = null, 
  label = 'Back',
  style = 'default' 
}) {
  const router = useRouter();

  const handleBack = () => {
    if (customPath) {
      router.push(customPath);
    } else {
      router.back();
    }
  };

  const buttonStyle = style === 'floating' ? styles.floatingButton : styles.defaultButton;

  return (
    <button
      onClick={handleBack}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = style === 'floating' 
          ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
          : '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <span style={styles.backIcon}>←</span>
      <span style={styles.backText}>{label}</span>
    </button>
  );
}

const styles = {
  defaultButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    marginBottom: '1.5rem',
  },
  
  floatingButton: {
    position: 'fixed',
    top: '100px',
    left: '2rem',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  
  backIcon: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#3b82f6',
  },
  
  backText: {
    color: '#374151',
  },
};