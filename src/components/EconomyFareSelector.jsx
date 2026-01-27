'use client';

import { ECONOMY_FARE_TYPES } from '../utils/seatUtils';

// Baggage allowance for each fare type
const BAGGAGE_ALLOWANCES = {
  saver: {
    cabin: '7kg',
    checkin: 'Not included',
    checkinNote: 'Available for purchase'
  },
  base: {
    cabin: '7kg',
    checkin: '15kg included',
    checkinNote: 'Upgrade options available'
  },
  green: {
    cabin: '7kg',
    checkin: '20kg included',
    checkinNote: 'Premium allowance'
  }
};

export default function EconomyFareSelector({ selectedFareType, onFareTypeChange }) {
  const fareTypes = Object.values(ECONOMY_FARE_TYPES);

  return (
    <div style={styles.fareSelector}>
      <h3 style={styles.title}>Choose Your Economy Fare</h3>
      <p style={styles.subtitle}>Select the fare type that best suits your travel needs</p>
      
      <div style={styles.fareOptions}>
        {fareTypes.map((fareType) => (
          <div
            key={fareType.id}
            style={{
              ...styles.fareCard,
              ...(selectedFareType === fareType.id ? styles.selectedCard : {}),
              borderColor: fareType.color
            }}
            onClick={() => onFareTypeChange(fareType.id)}
          >
            {/* Radio Button */}
            <div style={styles.radioContainer}>
              <div style={{
                ...styles.radioButton,
                backgroundColor: selectedFareType === fareType.id ? fareType.color : 'transparent',
                borderColor: fareType.color
              }}>
                {selectedFareType === fareType.id && (
                  <div style={styles.radioInner}></div>
                )}
              </div>
            </div>

            {/* Fare Content */}
            <div style={styles.fareContent}>
              <div style={styles.fareHeader}>
                <span style={styles.fareIcon}>{fareType.icon}</span>
                <h4 style={styles.fareName}>{fareType.name}</h4>
              </div>
              <p style={styles.fareDescription}>{fareType.description}</p>
              
              {/* Baggage Allowance Section */}
              <div style={styles.baggageAllowance}>
                <div style={styles.baggageTitle}>
                  <span style={styles.baggageIcon}>🧳</span>
                  <span style={styles.baggageTitleText}>Baggage Allowance</span>
                </div>
                
                <div style={styles.baggageDetails}>
                  <div style={styles.baggageItem}>
                    <div style={styles.baggageItemLeft}>
                      <span style={styles.baggageItemIcon}>🎒</span>
                      <span style={styles.baggageLabel}>Cabin:</span>
                    </div>
                    <span style={styles.baggageValue}>{BAGGAGE_ALLOWANCES[fareType.id].cabin}</span>
                  </div>
                  <div style={styles.baggageItem}>
                    <div style={styles.baggageItemLeft}>
                      <span style={styles.baggageItemIcon}>✈️</span>
                      <span style={styles.baggageLabel}>Check-in:</span>
                    </div>
                    <span style={{
                      ...styles.baggageValue,
                      color: fareType.id === 'saver' ? '#ef4444' : '#10b981',
                      fontWeight: '700'
                    }}>
                      {BAGGAGE_ALLOWANCES[fareType.id].checkin}
                    </span>
                  </div>
                  <div style={styles.baggageNote}>
                    {BAGGAGE_ALLOWANCES[fareType.id].checkinNote}
                  </div>
                </div>
              </div>
              
              {/* Separator */}
              <div style={styles.separator}></div>
              
              {/* Price Indicator */}
              <div style={styles.priceIndicator}>
                {fareType.priceMultiplier < 1.0 && (
                  <span style={styles.discountBadge}>
                    {Math.round((1 - fareType.priceMultiplier) * 100)}% OFF
                  </span>
                )}
                {fareType.priceMultiplier > 1.0 && (
                  <span style={styles.premiumBadge}>
                    +{Math.round((fareType.priceMultiplier - 1) * 100)}% Premium
                  </span>
                )}
                {fareType.priceMultiplier === 1.0 && (
                  <span style={styles.standardBadge}>Standard Pricing</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  fareSelector: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e2e8f0',
    marginBottom: '2rem',
  },
  
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: '0 0 2rem 0',
    textAlign: 'center',
  },
  
  fareOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  
  fareCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.5rem',
    border: '2px solid',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white',
    minHeight: '280px', // Increased height to accommodate baggage info
  },
  
  selectedCard: {
    background: 'rgba(59, 130, 246, 0.05)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
    transform: 'translateY(-2px)',
  },
  
  radioContainer: {
    flexShrink: 0,
    marginTop: '0.25rem',
  },
  
  radioButton: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  
  radioInner: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'white',
  },
  
  fareContent: {
    flex: 1,
  },
  
  fareHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  
  fareIcon: {
    fontSize: '1.5rem',
  },
  
  fareName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  
  fareDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: '0 0 1.5rem 0',
    lineHeight: '1.4',
  },
  
  // Baggage Allowance Styles
  baggageAllowance: {
    background: '#f8fafc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    border: '1px solid #e2e8f0',
  },
  
  baggageTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  
  baggageIcon: {
    fontSize: '1rem',
  },
  
  baggageTitleText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151',
  },
  
  baggageDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  baggageItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  
  baggageItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  baggageItemIcon: {
    fontSize: '0.9rem',
  },
  
  baggageLabel: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
  },
  
  baggageValue: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#374151',
  },
  
  baggageNote: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '0.25rem',
  },
  
  separator: {
    height: '1px',
    background: '#e2e8f0',
    margin: '0.5rem 0',
  },
  
  priceIndicator: {
    display: 'flex',
    alignItems: 'center',
  },
  
  discountBadge: {
    background: '#059669',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
  },
  
  premiumBadge: {
    background: '#f59e0b',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
  },
  
  standardBadge: {
    background: '#3b82f6',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
  },
};