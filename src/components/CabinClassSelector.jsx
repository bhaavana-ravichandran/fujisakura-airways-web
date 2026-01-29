'use client';

export default function CabinClassSelector({ 
  selectedClass, 
  onClassChange, 
  availableClasses = ['Economy', 'Premium Economy', 'Business', 'First'] 
}) {
  const classInfo = {
    Economy: {
      icon: '🪑',
      description: 'Comfortable seating with essential amenities',
      features: ['Standard legroom', 'Complimentary snacks', 'Entertainment system'],
      available: true
    },
    'Premium Economy': {
      icon: '✈️',
      description: 'Enhanced economy with extra comfort and services',
      features: ['Extra legroom', 'Premium meals', 'Priority check-in'],
      available: true // Now fully available
    },
    Business: {
      icon: '💼',
      description: 'Enhanced comfort with premium services',
      features: ['Lie-flat seats', 'Premium dining', 'Priority boarding'],
      available: true
    },
    First: {
      icon: '👑',
      description: 'Ultimate luxury travel with private suite experience',
      features: ['Private suites', 'À la carte dining', 'Personal concierge'],
      available: true
    }
  };

  return (
    <div style={styles.selectorContainer}>
      <h3 style={styles.selectorTitle}>Select Cabin Class</h3>
      <div style={styles.classGrid}>
        {availableClasses.map((className) => {
          const info = classInfo[className];
          const isSelected = selectedClass === className;
          const isAvailable = info.available;
          
          return (
            <div
              key={className}
              style={{
                ...styles.classCard,
                ...(isSelected ? styles.selectedCard : {}),
                ...(isAvailable ? {} : styles.disabledCard)
              }}
              onClick={() => isAvailable ? onClassChange(className) : null}
            >
              <div style={styles.classHeader}>
                <span style={styles.classIcon}>{info.icon}</span>
                <div>
                  <h4 style={styles.className}>{className} Class</h4>
                  {!isAvailable && (
                    <span style={styles.comingSoonBadge}>Coming Soon</span>
                  )}
                </div>
                {isSelected && (
                  <div style={styles.selectedIndicator}>
                    <span style={styles.checkmark}>✓</span>
                  </div>
                )}
              </div>
              
              <p style={styles.classDescription}>{info.description}</p>
              
              <div style={styles.featuresList}>
                {info.features.map((feature, index) => (
                  <div key={index} style={styles.featureItem}>
                    <span style={styles.featureIcon}>•</span>
                    <span style={styles.featureText}>{feature}</span>
                  </div>
                ))}
              </div>
              
              {!isAvailable && (
                <div style={styles.unavailableOverlay}>
                  <span style={styles.unavailableText}>Preview Only</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Selection Info */}
      <div style={styles.selectionInfo}>
        <div style={styles.infoIcon}>ℹ️</div>
        <div>
          <p style={styles.infoText}>
            {selectedClass === 'Economy' 
              ? 'Economy Class seat selection is fully interactive. Choose your preferred seats below.'
              : selectedClass === 'Premium Economy'
              ? 'Premium Economy seat selection is fully interactive. Choose your preferred fare type and enhanced seats below.'
              : selectedClass === 'Business'
              ? 'Business Class seat selection is fully interactive. Choose your preferred seats and fare type below.'
              : selectedClass === 'First'
              ? 'First Class seat selection is fully interactive. Choose your preferred fare type and luxury seats below.'
              : `${selectedClass} Class seat selection is coming soon. Currently showing preview layout only.`
            }
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  selectorContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  selectorTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
  },
  
  classGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  
  classCard: {
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  
  selectedCard: {
    border: '2px solid #3b82f6',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1))',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)',
  },
  
  disabledCard: {
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  
  classHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    position: 'relative',
  },
  
  classIcon: {
    fontSize: '1.5rem',
    background: '#f1f5f9',
    borderRadius: '8px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  
  className: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.25rem 0',
  },
  
  comingSoonBadge: {
    background: '#fbbf24',
    color: '#92400e',
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  selectedIndicator: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#059669',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
  },
  
  checkmark: {
    fontSize: '0.8rem',
    color: 'white',
    fontWeight: '900',
  },
  
  classDescription: {
    fontSize: '0.85rem',
    color: '#64748b',
    lineHeight: '1.4',
    margin: '0 0 1rem 0',
  },
  
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  featureIcon: {
    color: '#3b82f6',
    fontWeight: '900',
    fontSize: '0.8rem',
  },
  
  featureText: {
    fontSize: '0.8rem',
    color: '#475569',
  },
  
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
  },
  
  unavailableText: {
    background: '#f59e0b',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  selectionInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    background: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
  },
  
  infoIcon: {
    fontSize: '1.2rem',
    flexShrink: 0,
  },
  
  infoText: {
    fontSize: '0.85rem',
    color: '#1e40af',
    lineHeight: '1.4',
    margin: 0,
  },
};