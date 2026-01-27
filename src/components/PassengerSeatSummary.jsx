'use client';

import { getSeatTypeDisplayName, calculateSeatPrice, ECONOMY_FARE_TYPES, BUSINESS_FARE_TYPES } from '../utils/seatUtils';
import { formatPrice, CURRENCY_CONFIG } from '../utils/currency';

export default function PassengerSeatSummary({ 
  passengers, 
  selectedSeats, 
  cabinClass, 
  fareType = 'base',
  businessFareType = 'flex',
  totalPrice 
}) {
  const getPassengerSeat = (passenger) => {
    const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
    return selectedSeats[passengerKey] || null;
  };

  const getPassengerIcon = (passenger) => {
    if (passenger.title === 'Mr') return '👨';
    if (passenger.title === 'Ms' || passenger.title === 'Mrs') return '👩';
    return '🧒';
  };

  const allPassengersSeated = Object.keys(selectedSeats).length === passengers.length;

  return (
    <div style={styles.summaryContainer}>
      {/* Header */}
      <div style={styles.summaryHeader}>
        <h3 style={styles.summaryTitle}>Seat Selection Summary</h3>
        <div style={styles.progressIndicator}>
          <span style={styles.progressText}>
            {Object.keys(selectedSeats).length} of {passengers.length} passengers
          </span>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${(Object.keys(selectedSeats).length / passengers.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Passenger List */}
      <div style={styles.passengerList}>
        {passengers.map((passenger, index) => {
          const seat = getPassengerSeat(passenger);
          const hasSelectedSeat = !!seat;
          const fareMultiplier = ECONOMY_FARE_TYPES[fareType.toUpperCase()]?.priceMultiplier || 1.0;
          const seatPrice = seat ? calculateSeatPrice(seat.type, cabinClass, fareMultiplier) : 0;

          return (
            <div 
              key={index} 
              style={{
                ...styles.passengerCard,
                ...(hasSelectedSeat ? styles.completedCard : styles.pendingCard)
              }}
            >
              <div style={styles.passengerInfo}>
                <div style={styles.passengerAvatar}>
                  {getPassengerIcon(passenger)}
                </div>
                <div style={styles.passengerDetails}>
                  <p style={styles.passengerName}>
                    {passenger.title} {passenger.firstName} {passenger.lastName}
                  </p>
                  <p style={styles.passengerMeta}>
                    Age: {passenger.age} • {parseInt(passenger.age) >= 12 ? 'Adult' : 'Child'}
                  </p>
                </div>
              </div>

              <div style={styles.seatInfo}>
                {hasSelectedSeat ? (
                  <div style={styles.selectedSeatInfo}>
                    <div style={styles.seatBadge}>
                      <span style={styles.seatNumber}>{seat.id}</span>
                    </div>
                    <div style={styles.seatDetails}>
                      <p style={styles.seatType}>
                        {getSeatTypeDisplayName(seat.type)}
                      </p>
                      <p style={styles.seatPrice}>
                        {seatPrice > 0 ? `+${formatPrice(seatPrice, CURRENCY_CONFIG)}` : 'Free'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={styles.noSeatInfo}>
                    <div style={styles.emptySeatBadge}>
                      <span style={styles.emptySeatIcon}>?</span>
                    </div>
                    <p style={styles.noSeatText}>No seat selected</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Summary */}
      <div style={styles.priceSummary}>
        <div style={styles.priceHeader}>
          <h4 style={styles.priceTitle}>Seat Selection Charges</h4>
        </div>
        
        <div style={styles.priceBreakdown}>
          {/* Seat Charges */}
          {Object.entries(selectedSeats).map(([passengerKey, seat]) => {
            let price = 0;
            if (cabinClass === 'Economy') {
              const fareMultiplier = ECONOMY_FARE_TYPES[fareType.toUpperCase()]?.priceMultiplier || 1.0;
              price = calculateSeatPrice(seat.type, cabinClass, fareMultiplier);
            } else if (cabinClass === 'Business') {
              price = calculateSeatPrice(seat.type, cabinClass, 1.0, businessFareType);
            } else {
              price = calculateSeatPrice(seat.type, cabinClass, 1.0);
            }
            
            return (
              <div key={passengerKey} style={styles.priceRow}>
                <span style={styles.priceLabel}>
                  {seat.id} - {getSeatTypeDisplayName(seat.type)}
                </span>
                <span style={styles.priceValue}>
                  {price > 0 ? `+${formatPrice(price, CURRENCY_CONFIG)}` : 
                   cabinClass === 'Business' ? 'Included' : 'Free'}
                </span>
              </div>
            );
          })}
          
          {Object.keys(selectedSeats).length === 0 && (
            <div style={styles.noChargesRow}>
              <span style={styles.noChargesText}>No seat selection charges</span>
            </div>
          )}
        </div>

        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total Seat Charges</span>
          <span style={styles.totalValue}>
            {totalPrice > 0 ? `+${formatPrice(totalPrice, CURRENCY_CONFIG)}` : formatPrice(0, CURRENCY_CONFIG)}
          </span>
        </div>
      </div>

      {/* Status Messages */}
      {allPassengersSeated ? (
        <div style={styles.successMessage}>
          <div style={styles.successIcon}>✅</div>
          <div>
            <p style={styles.successTitle}>All passengers seated!</p>
            <p style={styles.successText}>
              You can now continue to payment or modify your selections.
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.infoMessage}>
          <div style={styles.infoIcon}>ℹ️</div>
          <div>
            <p style={styles.infoTitle}>Seat Selection in Progress</p>
            <p style={styles.infoText}>
              Please select seats for all passengers to continue.
            </p>
          </div>
        </div>
      )}

      {/* Cabin Class Info */}
      <div style={styles.cabinInfo}>
        <div style={styles.cabinBadge}>
          <span style={styles.cabinIcon}>✈️</span>
          <span style={styles.cabinText}>{cabinClass} Class</span>
        </div>
        {cabinClass !== 'Economy' && (
          <p style={styles.cabinNote}>
            Interactive seat selection available for Economy Class only
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  summaryContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  summaryHeader: {
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '1rem',
  },
  
  summaryTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 1rem 0',
  },
  
  progressIndicator: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  progressText: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '500',
  },
  
  progressBar: {
    width: '100%',
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  
  passengerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  
  passengerCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid',
    transition: 'all 0.3s ease',
  },
  
  completedCard: {
    borderColor: '#10b981',
    background: 'rgba(16, 185, 129, 0.05)',
  },
  
  pendingCard: {
    borderColor: '#f59e0b',
    background: 'rgba(245, 158, 11, 0.05)',
  },
  
  passengerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  passengerAvatar: {
    fontSize: '1.5rem',
    background: '#f1f5f9',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  passengerDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  
  passengerName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  
  passengerMeta: {
    fontSize: '0.75rem',
    color: '#64748b',
    margin: 0,
  },
  
  seatInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  selectedSeatInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  seatBadge: {
    background: '#10b981',
    color: 'white',
    borderRadius: '8px',
    padding: '0.5rem',
    minWidth: '40px',
    textAlign: 'center',
  },
  
  seatNumber: {
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  
  seatDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1rem',
  },
  
  seatType: {
    fontSize: '0.75rem',
    color: '#374151',
    fontWeight: '500',
    margin: 0,
  },
  
  seatPrice: {
    fontSize: '0.7rem',
    color: '#059669',
    fontWeight: '600',
    margin: 0,
  },
  
  noSeatInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  emptySeatBadge: {
    background: '#f59e0b',
    color: 'white',
    borderRadius: '8px',
    padding: '0.5rem',
    minWidth: '40px',
    textAlign: 'center',
  },
  
  emptySeatIcon: {
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  
  noSeatText: {
    fontSize: '0.8rem',
    color: '#92400e',
    fontWeight: '500',
    margin: 0,
  },
  
  priceSummary: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '1rem',
    border: '1px solid #e2e8f0',
  },
  
  priceHeader: {
    marginBottom: '0.75rem',
  },
  
  priceTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  
  priceBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  priceLabel: {
    fontSize: '0.8rem',
    color: '#475569',
  },
  
  priceValue: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#059669',
  },
  
  noChargesRow: {
    textAlign: 'center',
    padding: '0.5rem',
  },
  
  noChargesText: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '2px solid #e2e8f0',
    paddingTop: '0.75rem',
  },
  
  totalLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  
  totalValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#059669',
  },
  
  successMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '2px solid #10b981',
    borderRadius: '12px',
    padding: '1rem',
  },
  
  successIcon: {
    fontSize: '1.2rem',
    flexShrink: 0,
  },
  
  successTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#065f46',
    margin: '0 0 0.25rem 0',
  },
  
  successText: {
    fontSize: '0.8rem',
    color: '#047857',
    margin: 0,
    lineHeight: '1.4',
  },
  
  infoMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '2px solid #f59e0b',
    borderRadius: '12px',
    padding: '1rem',
  },
  
  infoIcon: {
    fontSize: '1.2rem',
    flexShrink: 0,
  },
  
  infoTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#92400e',
    margin: '0 0 0.25rem 0',
  },
  
  infoText: {
    fontSize: '0.8rem',
    color: '#a16207',
    margin: 0,
    lineHeight: '1.4',
  },
  
  cabinInfo: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
    color: 'white',
  },
  
  cabinBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  
  cabinIcon: {
    fontSize: '1.2rem',
  },
  
  cabinText: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  
  cabinNote: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
    fontStyle: 'italic',
  },
};