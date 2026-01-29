'use client';

import { FIRST_CLASS_FARE_TYPES } from '../utils/seatUtils';

export default function FirstClassFareSelector({ selectedFareType, onFareTypeChange }) {
  const fareTypes = Object.values(FIRST_CLASS_FARE_TYPES);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        <span style={styles.premiumLabel}>✨ Premium Experience</span>
        First Class Fare Options
      </h3>
      
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
              <h4 style={styles.fareName}>{fareType.name}</h4>
            </div>
            
            <p style={styles.fareDescription}>{fareType.description}</p>
            
            <div style={styles.benefitsSection}>
              <div style={styles.benefitItem}>
                <span style={styles.benefitLabel}>Seat Selection:</span>
                <span style={styles.benefitValue}>
                  {fareType.id === 'suite' ? 'Private suite seats' : 'Standard first-class seats'}
                </span>
              </div>
              
              <div style={styles.benefitItem}>
                <span style={styles.benefitLabel}>Cancellation:</span>
                <span style={styles.benefitValue}>{fareType.cancellation}</span>
              </div>
              
              <div style={styles.benefitItem}>
                <span style={styles.benefitLabel}>Date Change:</span>
                <span style={styles.benefitValue}>{fareType.dateChange}</span>
              </div>
              
              <div style={styles.benefitItem}>
                <span style={styles.benefitLabel}>Meals:</span>
                <span style={styles.benefitValue}>{fareType.meals}</span>
              </div>
              
              <div style={styles.baggageSection}>
                <div style={styles.baggageTitle}>Baggage Included:</div>
                <div style={styles.baggageDetails}>
                  <div>Cabin: {fareType.baggage.cabin.weight}</div>
                  <div>Check-in: {fareType.baggage.checkin.included}</div>
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
          All First Class fares include seat selection at no additional cost. 
          Suite seats are available only with First Class Suite fare.
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
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  
  premiumLabel: {
    fontSize: '0.9rem',
    color: '#8b5cf6',
    fontWeight: '500',
    background: 'linear-gradient(135deg, #f3e8ff, #e0e7ff)',
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid #c4b5fd'
  },
  
  fareGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  
  fareIcon: {
    fontSize: '1.5rem'
  },
  
  fareName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
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
    alignItems: 'flex-start',
    fontSize: '0.85rem',
    gap: '8px'
  },
  
  benefitLabel: {
    fontWeight: '500',
    color: '#374151',
    minWidth: '90px'
  },
  
  benefitValue: {
    color: '#6b7280',
    textAlign: 'right',
    flex: 1
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