'use client';

import { BUSINESS_FARE_TYPES } from '../utils/seatUtils';

export default function BusinessFareSelector({ selectedFareType, onFareTypeChange }) {
  const fareTypes = Object.values(BUSINESS_FARE_TYPES);

  return (
    <div style={styles.fareSelector}>
      <h3 style={styles.title}>Choose Your Business Class Fare</h3>
      <p style={styles.subtitle}>Select the business class experience that suits your needs</p>
      
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
              
              {/* Seat Inclusion Info */}
              <div style={styles.seatInclusion}>
                <div style={styles.inclusionItem}>
                  <span style={styles.inclusionIcon}>💺</span>
                  <span style={styles.inclusionText}>
                    {fareType.seatIncluded ? 'Seat selection included' : 'Seat selection available'}
                  </span>
                </div>
                
                {fareType.premiumSeatCharge > 0 && (
                  <div style={styles.inclusionItem}>
                    <span style={styles.inclusionIcon}>⭐</span>
                    <span style={styles.inclusionText}>
                      Premium seats: +₹{fareType.premiumSeatCharge.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {fareType.premiumSeatCharge === 0 && fareType.id !== 'flex' && (
                  <div style={styles.inclusionItem}>
                    <span style={styles.inclusionIcon}>✨</span>
                    <span style={styles.inclusionText}>All seats included</span>
                  </div>
                )}
                
                {fareType.suiteAccess && (
                  <div style={styles.inclusionItem}>
                    <span style={styles.inclusionIcon}>👑</span>
                    <span style={styles.inclusionText}>Suite access included</span>
                  </div>
                )}
              </div>
              
              {/* Baggage Allowance */}
              {fareType.baggage && (
                <div style={styles.baggageSection}>
                  <div style={styles.baggageTitle}>
                    <span style={styles.baggageIcon}>🧳</span>
                    <span style={styles.baggageTitleText}>Baggage Allowance</span>
                  </div>
                  
                  {/* Cabin Baggage */}
                  <div style={styles.baggageItem}>
                    <div style={styles.baggageItemHeader}>
                      <span style={styles.baggageItemIcon}>👜</span>
                      <span style={styles.baggageItemTitle}>Cabin Baggage</span>
                    </div>
                    <div style={styles.baggageDetails}>
                      <span style={styles.baggageWeight}>{fareType.baggage.cabin.weight}</span>
                      <span style={styles.baggageIncluded}>Included</span>
                    </div>
                  </div>
                  
                  {/* Check-in Baggage */}
                  <div style={styles.baggageItem}>
                    <div style={styles.baggageItemHeader}>
                      <span style={styles.baggageItemIcon}>🧳</span>
                      <span style={styles.baggageItemTitle}>Check-in Baggage</span>
                    </div>
                    <div style={styles.baggageDetails}>
                      <span style={styles.baggageWeight}>{fareType.baggage.checkin.included}</span>
                      <span style={styles.baggageIncluded}>Included</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Premium Badge */}
              <div style={styles.premiumBadge}>
                <span style={{
                  ...styles.badgeText,
                  backgroundColor: fareType.color
                }}>
                  {fareType.id === 'flex' ? 'Flexible' : 
                   fareType.id === 'premium' ? 'Premium Experience' : 
                   'Ultimate Luxury'}
                </span>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
    minHeight: '200px',
  },
  
  selectedCard: {
    background: 'rgba(139, 92, 246, 0.05)',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
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
    margin: '0 0 1rem 0',
    lineHeight: '1.4',
  },
  
  seatInclusion: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  
  inclusionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  inclusionIcon: {
    fontSize: '1rem',
    width: '20px',
    textAlign: 'center',
  },
  
  inclusionText: {
    fontSize: '0.85rem',
    color: '#374151',
    fontWeight: '500',
  },
  
  premiumBadge: {
    display: 'flex',
    justifyContent: 'center',
  },
  
  badgeText: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
  },
  
  // Baggage Section Styles
  baggageSection: {
    marginTop: '1rem',
    padding: '1rem',
    background: 'rgba(59, 130, 246, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(59, 130, 246, 0.1)',
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
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  
  baggageItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
  },
  
  baggageItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  baggageItemIcon: {
    fontSize: '0.9rem',
  },
  
  baggageItemTitle: {
    fontSize: '0.85rem',
    color: '#374151',
    fontWeight: '500',
  },
  
  baggageDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  baggageWeight: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  
  baggageIncluded: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#059669',
    background: 'rgba(5, 150, 105, 0.1)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
  },
};