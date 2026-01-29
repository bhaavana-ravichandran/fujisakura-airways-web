'use client';

import { PREMIUM_ECONOMY_FARE_TYPES } from '../utils/seatUtils';

export default function PremiumEconomyFareSelector({ selectedFareType, onFareTypeChange }) {
  const fareTypes = Object.values(PREMIUM_ECONOMY_FARE_TYPES);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Premium Economy Fare Options</h3>
      
      <div style={styles.fareGrid}>
        {fareTypes.map((fareType) => (
          <div
            key={fareType.id}
            onClick={() => onFareTypeChange(fareType.id)}
            style={{
              ...styles.fareCard,
              ...(selectedFareType === fareType.id ? styles.selectedCard : {}),
              borderColor: fareType.color
            }}
          >
            <div style={styles.fareHeader}>
              <span style={styles.fareIcon}>{fareType.icon}</span>
              <div style={styles.fareNameContainer}>
                <h4 style={styles.fareName}>{fareType.name}</h4>
                {fareType.recommended && (
                  <span style={styles.recommendedBadge}>Recommended</span>
                )}
              </div>
            </div>
            
            <p style={styles.fareDescription}>{fareType.description}</p>
            
            <div style={styles.benefitsSection}>
              <div style={styles.benefitItem}>
                <span style={styles.benefitLabel}>Flexibility:</span>
                <span style={styles.benefitValue}>{fareType.flexibility}</span>
              </div>
              
              <div style={styles.benefitItem}>
                <span style={styles.benefitLabel}>Seat Selection:</span>
                <span style={styles.benefitValue}>Included</span>
              </div>
              
              <div style={styles.baggageSection}>
                <div style={styles.baggageTitle}>Baggage Included:</div>
                <div style={styles.baggageDetails}>
                  <div>Cabin: {fareType.baggage.cabin.weight}</div>
                  <div>Check-in: {fareType.baggage.checkin.included}</div>
                  {fareType.baggage.checkin.modifications && (
                    <div style={styles.baggageExtra}>{fareType.baggage.checkin.modifications}</div>
                  )}
                </div>
              </div>
            </div>
            
            {selectedFareType === fareType.id && (
              <div style={styles.selectedIndicator}>
                <span style={styles.checkmark}>✓</span>
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={styles.noteSection}>
        <div style={styles.noteIcon}>ℹ️</div>
        <p style={styles.noteText}>
          Premium Economy offers enhanced comfort with wider seats, extra legroom, and premium services. 
          All fares include seat selection and priority check-in.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  
  title: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
    textAlign: 'center'
  },
  
  fareGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  
  fareCard: {
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white',
    position: 'relative',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  
  selectedCard: {
    borderColor: '#3b82f6',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
    transform: 'translateY(-2px)'
  },
  
  fareHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px'
  },
  
  fareIcon: {
    fontSize: '1.5rem'
  },
  
  fareNameContainer: {
    flex: 1
  },
  
  fareName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 4px 0'
  },
  
  recommendedBadge: {
    background: '#10b981',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  fareDescription: {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: '1.4'
  },
  
  benefitsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  benefitItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem'
  },
  
  benefitLabel: {
    fontWeight: '500',
    color: '#374151'
  },
  
  benefitValue: {
    color: '#6b7280'
  },
  
  baggageSection: {
    marginTop: '12px',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  
  baggageTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  },
  
  baggageDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '0.8rem',
    color: '#6b7280'
  },
  
  baggageExtra: {
    color: '#10b981',
    fontWeight: '500'
  },
  
  selectedIndicator: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#3b82f6',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  
  checkmark: {
    fontSize: '0.8rem'
  },
  
  noteSection: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
    borderRadius: '12px',
    border: '1px solid #bfdbfe'
  },
  
  noteIcon: {
    fontSize: '1.2rem',
    flexShrink: 0
  },
  
  noteText: {
    fontSize: '0.9rem',
    color: '#1e40af',
    margin: 0,
    lineHeight: '1.5'
  }
};