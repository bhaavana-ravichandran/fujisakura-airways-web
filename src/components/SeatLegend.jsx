'use client';

import { SEAT_PRICING, getSeatTypeDisplayName } from '../utils/seatUtils';
import { formatPrice, CURRENCY_CONFIG } from '../utils/currency';

export default function SeatLegend({ cabinClass }) {
  const seatTypes = [
    { status: 'available', color: '#10b981', label: 'Available', icon: '🟢' },
    { status: 'selected', color: '#3b82f6', label: 'Selected', icon: '🔵' },
    { status: 'occupied', color: '#6b7280', label: 'Occupied', icon: '⚫' },
    { status: 'blocked', color: '#ef4444', label: 'Unavailable', icon: '🔴' },
  ];

  const pricingInfo = SEAT_PRICING[cabinClass] || {};

  return (
    <div style={styles.legendContainer}>
      {/* Main Legend Card - Seat Status & Pricing Combined */}
      <div style={styles.mainLegendCard}>
        <h4 style={styles.cardTitle}>Seat Selection Guide</h4>
        
        {/* Seat Status and Pricing in Two Columns */}
        <div style={styles.legendGrid}>
          {/* Left Column - Seat Status */}
          <div style={styles.legendSection}>
            <h5 style={styles.sectionTitle}>Seat Status</h5>
            <div style={styles.statusGrid}>
              {seatTypes.map((type) => (
                <div key={type.status} style={styles.legendItem}>
                  <div 
                    style={{
                      ...styles.legendSeat,
                      backgroundColor: type.color
                    }}
                  >
                    <span style={styles.legendSeatLabel}>A</span>
                  </div>
                  <span style={styles.legendLabel}>{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Seat Pricing */}
          <div style={styles.legendSection}>
            <h5 style={styles.sectionTitle}>Seat Pricing</h5>
            <div style={styles.pricingGrid}>
              {Object.entries(pricingInfo).map(([seatType, price]) => (
                <div key={seatType} style={styles.pricingItem}>
                  <div style={styles.pricingInfo}>
                    <span style={styles.seatTypeIcon}>
                      {getSeatTypeIcon(seatType)}
                    </span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.seatTypeName}>
                        {getSeatTypeDisplayName(seatType)}
                      </span>
                      <span style={styles.seatTypePrice}>
                        {price > 0 ? `+${formatPrice(price, CURRENCY_CONFIG)}` : 'Free'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Information Card - Separate */}
      <div style={styles.infoCard}>
        <h4 style={styles.cardTitle}>Additional Information</h4>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>🪟</span>
            <span style={styles.infoText}>Window seats offer scenic views</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>🚶</span>
            <span style={styles.infoText}>Aisle seats provide easy access</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>🚪</span>
            <span style={styles.infoText}>Emergency exit seats have extra legroom</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>⭐</span>
            <span style={styles.infoText}>Premium seats in front rows</span>
          </div>
        </div>

        {/* Cabin Class Badge */}
        <div style={styles.cabinClassInfo}>
          <div style={styles.cabinClassBadge}>
            <span style={styles.cabinClassIcon}>✈️</span>
            <span style={styles.cabinClassText}>{cabinClass} Class</span>
          </div>
          {cabinClass !== 'Economy' && (
            <p style={styles.comingSoonText}>
              Full seat selection available soon
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get seat type icons
const getSeatTypeIcon = (seatType) => {
  const icons = {
    window: '🪟',
    middle: '🪑',
    aisle: '🚶',
    premium: '⭐',
    emergency: '🚪'
  };
  return icons[seatType] || '🪑';
};

const styles = {
  legendContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  mainLegendCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e2e8f0',
  },
  
  infoCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e2e8f0',
  },
  
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '0.75rem',
  },
  
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  
  legendSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 0.75rem 0',
    textAlign: 'center',
    background: '#f8fafc',
    padding: '0.5rem',
    borderRadius: '8px',
  },
  
  statusGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  legendSeat: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    flexShrink: 0,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  legendSeatLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'white',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },
  
  legendLabel: {
    fontSize: '0.9rem',
    color: '#475569',
    fontWeight: '500',
  },
  
  pricingGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  
  pricingItem: {
    display: 'flex',
    alignItems: 'center',
  },
  
  pricingInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1,
  },
  
  seatTypeIcon: {
    fontSize: '1.3rem',
    width: '28px',
    textAlign: 'center',
    flexShrink: 0,
  },
  
  pricingDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1rem',
  },
  
  seatTypeName: {
    fontSize: '0.85rem',
    color: '#374151',
    fontWeight: '500',
  },
  
  seatTypePrice: {
    fontSize: '0.8rem',
    color: '#059669',
    fontWeight: '700',
  },
  
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  
  infoIcon: {
    fontSize: '1rem',
    width: '20px',
    textAlign: 'center',
    flexShrink: 0,
    marginTop: '0.1rem',
  },
  
  infoText: {
    fontSize: '0.8rem',
    color: '#64748b',
    lineHeight: '1.4',
  },
  
  cabinClassInfo: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
    color: 'white',
  },
  
  cabinClassBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  
  cabinClassIcon: {
    fontSize: '1.2rem',
  },
  
  cabinClassText: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  
  comingSoonText: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
    fontStyle: 'italic',
  },
};