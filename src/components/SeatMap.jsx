'use client';

import { getSeatStatusColor, getSeatTypeDisplayName, calculateSeatPrice, ECONOMY_FARE_TYPES, BUSINESS_FARE_TYPES, FIRST_CLASS_FARE_TYPES } from '../utils/seatUtils';
import { formatPrice, CURRENCY_CONFIG } from '../utils/currency';

export default function SeatMap({ 
  seatMap, 
  selectedSeats, 
  onSeatSelect, 
  cabinClass,
  fareType = 'base',
  premiumEconomyFareType = 'standard',
  businessFareType = 'flex',
  firstClassFareType = 'standard',
  disabled = false 
}) {
  if (!seatMap) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading seat map...</p>
      </div>
    );
  }

  const isSelected = (seatId) => {
    return Object.values(selectedSeats).some(seat => seat.id === seatId);
  };

  const getSelectedPassenger = (seatId) => {
    const entry = Object.entries(selectedSeats).find(([_, seat]) => seat.id === seatId);
    return entry ? entry[0].replace('_', ' ') : null;
  };

  const handleSeatClick = (seat) => {
    if (disabled) return;
    if (seat.status === 'occupied' || seat.status === 'blocked') return;
    
    onSeatSelect(seat.id, seat);
  };

  // Determine cabin class layout
  const isBusinessClass = cabinClass === 'Business';
  const isFirstClass = cabinClass === 'First';
  const isPremiumEconomy = cabinClass === 'Premium Economy';
  const layoutConfig = seatMap.config;

  return (
    <div style={styles.seatMapContainer}>
      {/* Aircraft Header */}
      <div style={styles.aircraftHeader}>
        <div style={styles.aircraftIcon}>✈️</div>
        <div>
          <h3 style={styles.aircraftName}>{seatMap.config.name}</h3>
          <p style={styles.aircraftInfo}>
            {seatMap.config.rows} rows • {seatMap.config.seatsPerRow} seats per row
          </p>
        </div>
      </div>

      {/* Seat Selection Guide - Integrated */}
      <div style={styles.integratedGuide}>
        <h4 style={styles.guideTitle}>Seat Selection Guide</h4>
        <div style={styles.guideGrid}>
          {/* Left Column - Seat Status */}
          <div style={styles.guideSection}>
            <h5 style={styles.guideSectionTitle}>Seat Status</h5>
            <div style={styles.statusItems}>
              <div style={styles.statusItem}>
                <div style={{...styles.statusSeat, backgroundColor: '#10b981'}}>
                  <span style={styles.statusSeatLabel}>A</span>
                </div>
                <span style={styles.statusLabel}>Available</span>
              </div>
              <div style={styles.statusItem}>
                <div style={{...styles.statusSeat, backgroundColor: '#3b82f6'}}>
                  <span style={styles.statusSeatLabel}>A</span>
                </div>
                <span style={styles.statusLabel}>Selected</span>
              </div>
              <div style={styles.statusItem}>
                <div style={{...styles.statusSeat, backgroundColor: '#6b7280'}}>
                  <span style={styles.statusSeatLabel}>A</span>
                </div>
                <span style={styles.statusLabel}>Occupied</span>
              </div>
              <div style={styles.statusItem}>
                <div style={{...styles.statusSeat, backgroundColor: '#ef4444'}}>
                  <span style={styles.statusSeatLabel}>A</span>
                </div>
                <span style={styles.statusLabel}>Unavailable</span>
              </div>
            </div>
          </div>

          {/* Right Column - Seat Pricing (Dynamic based on cabin class) */}
          <div style={styles.guideSection}>
            <h5 style={styles.guideSectionTitle}>Seat Pricing</h5>
            <div style={styles.pricingItems}>
              {isFirstClass ? (
                // First Class pricing
                <>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>✨</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Premium Experience</span>
                      <span style={styles.pricingPrice}>Included</span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>💺</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>First Class Seat</span>
                      <span style={styles.pricingPrice}>Included</span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>👑</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Suite Access</span>
                      <span style={styles.pricingPrice}>
                        {firstClassFareType === 'suite' ? 'Included' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>🍽️</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Dining</span>
                      <span style={styles.pricingPrice}>
                        {firstClassFareType === 'suite' ? 'À la carte' : 
                         firstClassFareType === 'flex' ? 'Premium' : 'Gourmet'}
                      </span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>🧳</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Baggage</span>
                      <span style={styles.pricingPrice}>
                        {firstClassFareType === 'suite' ? '15kg + 50kg' : 
                         firstClassFareType === 'flex' ? '10kg + 45kg' : '10kg + 40kg'}
                      </span>
                    </div>
                  </div>
                </>
              ) : isPremiumEconomy ? (
                // Premium Economy pricing
                <>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>💺</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Premium Seat</span>
                      <span style={styles.pricingPrice}>+₹200</span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>🦵</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Extra Legroom</span>
                      <span style={styles.pricingPrice}>+₹800</span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>🧳</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Baggage</span>
                      <span style={styles.pricingPrice}>
                        {premiumEconomyFareType === 'lite' ? '10kg + 30kg' : 
                         premiumEconomyFareType === 'flex' ? '10kg + 35kg' : '10kg + 35kg'}
                      </span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>ℹ️</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Fare Type</span>
                      <span style={styles.pricingPrice}>
                        {premiumEconomyFareType === 'lite' ? 'Lite' : 
                         premiumEconomyFareType === 'flex' ? 'Flex' : 'Standard'}
                      </span>
                    </div>
                  </div>
                </>
              ) : isBusinessClass ? (
                // Business Class pricing
                <>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>💺</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Lie-Flat</span>
                      <span style={styles.pricingPrice}>Included</span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>⭐</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Extra Privacy</span>
                      <span style={styles.pricingPrice}>
                        {businessFareType === 'flex' ? '+₹5,000' : 'Included'}
                      </span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>👑</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Business Suite</span>
                      <span style={styles.pricingPrice}>
                        {businessFareType === 'suite' ? 'Included' : 
                         businessFareType === 'premium' ? 'Included' : '+₹8,000'}
                      </span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>ℹ️</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Fare Type</span>
                      <span style={styles.pricingPrice}>
                        {businessFareType === 'flex' ? 'Flex' : 
                         businessFareType === 'premium' ? 'Premium' : 'Suite'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                // Economy Class pricing (existing)
                <>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>🪟</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Window</span>
                      <span style={styles.pricingPrice}>+₹500</span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>🪑</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Middle</span>
                      <span style={styles.pricingPrice}>Free</span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>🚶</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Aisle</span>
                      <span style={styles.pricingPrice}>+₹300</span>
                    </div>
                  </div>
                  <div style={styles.pricingItem}>
                    <span style={styles.pricingIcon}>⭐</span>
                    <div style={styles.pricingDetails}>
                      <span style={styles.pricingType}>Premium</span>
                      <span style={styles.pricingPrice}>+₹800</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seat Layout Header - Dynamic based on cabin class */}
      {isFirstClass ? (
        <div style={styles.firstClassSeatHeaderGrid}>
          <div style={styles.headerRowNumber}></div>
          <div style={styles.headerGridA}>A</div>
          <div style={styles.headerAisleWide}></div>
          <div style={styles.headerGridF}>F</div>
          <div style={styles.headerRowNumber}></div>
        </div>
      ) : isPremiumEconomy ? (
        <div style={styles.premiumEconomySeatHeaderGrid}>
          <div style={styles.headerRowNumber}></div>
          <div style={styles.headerGridA}>A</div>
          <div style={styles.headerGridB}>B</div>
          <div style={styles.headerAislePremium}></div>
          <div style={styles.headerGridC}>C</div>
          <div style={styles.headerGridD}>D</div>
          <div style={styles.headerGridE}>E</div>
          <div style={styles.headerAislePremium}></div>
          <div style={styles.headerGridF}>F</div>
          <div style={styles.headerGridG}>G</div>
          <div style={styles.headerRowNumber}></div>
        </div>
      ) : isBusinessClass ? (
        <div style={styles.businessSeatHeaderGrid}>
          <div style={styles.headerRowNumber}></div>
          <div style={styles.headerGridA}>A</div>
          <div style={styles.headerAisle}></div>
          <div style={styles.headerGridD}>D</div>
          <div style={styles.headerAisleWide}></div>
          <div style={styles.headerGridG}>G</div>
          <div style={styles.headerAisle}></div>
          <div style={styles.headerGridK}>K</div>
          <div style={styles.headerRowNumber}></div>
        </div>
      ) : (
        <div style={styles.seatHeaderGrid}>
          <div style={styles.headerRowNumber}></div>
          <div style={styles.headerGridA}>A</div>
          <div style={styles.headerGridB}>B</div>
          <div style={styles.headerGridC}>C</div>
          <div style={styles.headerAisle}></div>
          <div style={styles.headerGridD}>D</div>
          <div style={styles.headerGridE}>E</div>
          <div style={styles.headerGridF}>F</div>
          <div style={styles.headerRowNumber}></div>
        </div>
      )}

      {/* Seat Rows - Dynamic Grid Version */}
      <div style={styles.seatRows}>
        {seatMap.rows.map((row) => (
          <div key={row.rowNumber} style={
            isFirstClass ? styles.firstClassSeatRowGrid : 
            isPremiumEconomy ? styles.premiumEconomySeatRowGrid :
            isBusinessClass ? styles.businessSeatRowGrid : 
            styles.seatRowGrid
          }>
            {/* Row Number */}
            <div style={styles.rowNumberGrid}>{row.rowNumber}</div>
            
            {/* Seats in Grid Layout */}
            {row.seats.map((seat, seatIndex) => {
              if (seat.type === 'aisle') {
                return <div key={seatIndex} style={
                  isPremiumEconomy ? styles.aisleGridPremium : styles.aisleGrid
                }></div>;
              }
              
              if (seat.type === 'aisle_wide') {
                return (
                  <div key={seatIndex} style={styles.aisleWideGrid}>
                    {/* Optional: Add aisle indicator for Business Class */}
                    {isBusinessClass && row.rowNumber === 6 && <span>AISLE</span>}
                  </div>
                );
              }

              const selected = isSelected(seat.id);
              const selectedPassenger = getSelectedPassenger(seat.id);
              const seatColor = getSeatStatusColor(seat.status, selected);
              const isClickable = !disabled && seat.status === 'available';
              
              // Calculate price based on cabin class
              let adjustedPrice = 0;
              if (cabinClass === 'Economy') {
                const fareMultiplier = ECONOMY_FARE_TYPES[fareType.toUpperCase()]?.priceMultiplier || 1.0;
                adjustedPrice = calculateSeatPrice(seat.type, cabinClass, fareMultiplier);
              } else if (cabinClass === 'Premium Economy') {
                adjustedPrice = calculateSeatPrice(seat.type, cabinClass, 1.0, null, null, premiumEconomyFareType);
              } else if (cabinClass === 'Business') {
                adjustedPrice = calculateSeatPrice(seat.type, cabinClass, 1.0, businessFareType);
              } else if (cabinClass === 'First') {
                adjustedPrice = calculateSeatPrice(seat.type, cabinClass, 1.0, null, firstClassFareType);
              } else {
                adjustedPrice = calculateSeatPrice(seat.type, cabinClass, 1.0);
              }

              // Determine if seat is included with Business fare
              const isIncludedWithFare = cabinClass === 'Business' && adjustedPrice === 0;
              
              // Get seat styling based on cabin class
              const seatStyle = isFirstClass ? {
                ...styles.firstClassSeatGrid,
                backgroundColor: seatColor,
                cursor: isClickable ? 'pointer' : 'not-allowed',
                opacity: disabled ? 0.6 : 1,
                transform: selected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: selected 
                  ? '0 6px 20px rgba(251, 191, 36, 0.4)' 
                  : seat.status === 'available' 
                    ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
                    : 'none',
                // Special styling for First Class suite seats
                border: seat.type === 'first_suite' 
                  ? '3px solid #dc2626' 
                  : '3px solid rgba(255, 215, 0, 0.8)',
                justifySelf: 'center',
                alignSelf: 'center',
              } : isPremiumEconomy ? {
                ...styles.premiumEconomySeatGrid,
                backgroundColor: seatColor,
                cursor: isClickable ? 'pointer' : 'not-allowed',
                opacity: disabled ? 0.6 : 1,
                transform: selected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: selected 
                  ? '0 4px 12px rgba(139, 92, 246, 0.4)' 
                  : seat.status === 'available' 
                    ? '0 3px 8px rgba(0, 0, 0, 0.12)' 
                    : 'none',
                // Special styling for Premium Economy extra legroom seats
                border: seat.type === 'premium_economy_extra_legroom' 
                  ? '2px solid #8b5cf6' 
                  : '2px solid rgba(139, 92, 246, 0.6)',
                justifySelf: 'center',
                alignSelf: 'center',
              } : isBusinessClass ? {
                ...styles.businessSeatGrid,
                backgroundColor: seatColor,
                cursor: isClickable ? 'pointer' : 'not-allowed',
                opacity: disabled ? 0.6 : 1,
                transform: selected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: selected 
                  ? '0 4px 12px rgba(59, 130, 246, 0.4)' 
                  : seat.status === 'available' 
                    ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
                    : 'none',
                // Special styling for premium Business seats
                border: (seat.type === 'extra_privacy' || seat.type === 'suite') 
                  ? '2px solid #f59e0b' 
                  : '2px solid rgba(255, 255, 255, 0.8)',
                // Center the seat in its grid cell
                justifySelf: 'center',
                alignSelf: 'center',
              } : {
                ...styles.seatGrid,
                backgroundColor: seatColor,
                cursor: isClickable ? 'pointer' : 'not-allowed',
                opacity: disabled ? 0.6 : 1,
                transform: selected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: selected 
                  ? '0 4px 12px rgba(59, 130, 246, 0.4)' 
                  : seat.status === 'available' 
                    ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
                    : 'none',
              };

              return (
                <div
                  key={seat.id}
                  style={seatStyle}
                  onMouseEnter={(e) => {
                    if (isClickable) {
                      e.target.style.transform = selected ? 'scale(1.1)' : 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isClickable) {
                      e.target.style.transform = selected ? 'scale(1.05)' : 'scale(1)';
                    }
                  }}
                  onClick={() => handleSeatClick(seat)}
                  title={
                    disabled 
                      ? `${cabinClass} Class - Coming Soon`
                      : selected
                        ? `${seat.id} - Selected by ${selectedPassenger}`
                        : seat.status === 'available'
                          ? `${seat.id} - ${getSeatTypeDisplayName(seat.type)} - ${
                              isIncludedWithFare ? 'Included with fare' : 
                              adjustedPrice > 0 ? `+₹${adjustedPrice.toLocaleString()}` : 'Free'
                            }`
                          : `${seat.id} - ${seat.status}`
                  }
                >
                  <div style={styles.seatContent}>
                    <span style={styles.seatLabel}>{seat.letter}</span>
                    {/* Price/Inclusion indicator */}
                    {seat.status === 'available' && (
                      <span style={styles.seatPrice}>
                        {isIncludedWithFare ? 'Incl.' : 
                         adjustedPrice > 0 ? `+₹${adjustedPrice.toLocaleString()}` : 'Free'}
                      </span>
                    )}
                  </div>
                  {selected && (
                    <div style={styles.selectedIndicator}>
                      <span style={styles.checkmark}>✓</span>
                    </div>
                  )}
                  {/* Premium seat indicator for Premium Economy */}
                  {isPremiumEconomy && seat.type === 'premium_economy_extra_legroom' && (
                    <div style={styles.premiumIndicator}>
                      <span style={styles.premiumIcon}>🦵</span>
                    </div>
                  )}
                  {/* Premium seat indicator for Business Class */}
                  {isBusinessClass && (seat.type === 'extra_privacy' || seat.type === 'suite') && (
                    <div style={styles.premiumIndicator}>
                      <span style={styles.premiumIcon}>
                        {seat.type === 'suite' ? '👑' : '⭐'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            
            
            {/* Row Number (Right) */}
            <div style={styles.rowNumberGrid}>{row.rowNumber}</div>
          </div>
        ))}
      </div>

      {/* Aircraft Footer */}
      <div style={styles.aircraftFooter}>
        <div style={styles.cockpitIndicator}>
          <span style={styles.cockpitIcon}>🎯</span>
          <span style={styles.cockpitText}>Cockpit</span>
        </div>
      </div>

      {/* Disabled Overlay */}
      {disabled && (
        <div style={styles.disabledOverlay}>
          <div style={styles.disabledMessage}>
            <h3 style={styles.disabledTitle}>{cabinClass} Class</h3>
            <p style={styles.disabledText}>Seat selection coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  seatMapContainer: {
    position: 'relative',
    background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '16px',
    padding: '2rem',
    border: '2px solid #e2e8f0',
  },
  
  // Integrated Guide Styles
  integratedGuide: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '2px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  
  guideTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '0.75rem',
  },
  
  guideGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  
  guideSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  guideSectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 1rem 0',
    textAlign: 'center',
    background: '#f8fafc',
    padding: '0.5rem',
    borderRadius: '8px',
  },
  
  statusItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  statusSeat: {
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
  
  statusSeatLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'white',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },
  
  statusLabel: {
    fontSize: '0.9rem',
    color: '#475569',
    fontWeight: '500',
  },
  
  pricingItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  
  pricingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  pricingIcon: {
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
  
  pricingType: {
    fontSize: '0.85rem',
    color: '#374151',
    fontWeight: '500',
  },
  
  pricingPrice: {
    fontSize: '0.8rem',
    color: '#059669',
    fontWeight: '700',
  },
  
  aircraftHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1rem',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  
  aircraftIcon: {
    fontSize: '2rem',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  aircraftName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.25rem 0',
  },
  
  aircraftInfo: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: 0,
  },
  
  // Grid-based layout for perfect alignment
  seatHeaderGrid: {
    display: 'grid',
    gridTemplateColumns: '2rem 40px 40px 40px 20px 40px 40px 40px 2rem',
    gap: '4px',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0 1rem',
  },
  
  // Business Class header grid (1-2-1 layout: A | D G | K)
  businessSeatHeaderGrid: {
    display: 'grid',
    gridTemplateColumns: '2rem 60px 40px 120px 60px 120px 40px 60px 2rem',
    gap: '0px',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0 1rem',
  },
  
  // Premium Economy header grid (2-3-2 layout: A B | C D E | F G)
  premiumEconomySeatHeaderGrid: {
    display: 'grid',
    gridTemplateColumns: '2rem 55px 55px 40px 55px 55px 55px 40px 55px 55px 2rem',
    gap: '4px',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0 1rem',
  },
  
  // First Class header grid (1-1 layout: A | F)
  firstClassSeatHeaderGrid: {
    display: 'grid',
    gridTemplateColumns: '2rem 80px 160px 80px 2rem', // A | wide aisle | F
    gap: '0px',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0 1rem',
  },
  
  seatRowGrid: {
    display: 'grid',
    gridTemplateColumns: '2rem 40px 40px 40px 20px 40px 40px 40px 2rem',
    gap: '4px',
    alignItems: 'center',
    minHeight: '44px',
  },
  
  // Business Class row grid (1-2-1 layout: A | D G | K)
  businessSeatRowGrid: {
    display: 'grid',
    gridTemplateColumns: '2rem 60px 40px 120px 60px 120px 40px 60px 2rem',
    gap: '0px',
    alignItems: 'center',
    minHeight: '70px', // Taller for business class
  },
  
  // Premium Economy row grid (2-3-2 layout: A B | C D E | F G)
  premiumEconomySeatRowGrid: {
    display: 'grid',
    gridTemplateColumns: '2rem 55px 55px 40px 55px 55px 55px 40px 55px 55px 2rem',
    gap: '4px',
    alignItems: 'center',
    minHeight: '60px', // Increased height for better spacing
    padding: '4px 0', // Added vertical padding
  },
  
  // First Class row grid (1-1 layout: A | F with wide aisle)
  firstClassSeatRowGrid: {
    display: 'grid',
    gridTemplateColumns: '2rem 80px 160px 80px 2rem', // A | wide aisle | F
    gap: '0px',
    alignItems: 'center',
    minHeight: '90px', // Tallest for first class luxury
    padding: '8px 0', // Extra padding for premium feel
  },
  
  headerGridA: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
  },
  
  headerGridB: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
  },
  
  headerGridC: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
  },
  
  headerGridD: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
  },
  
  headerGridE: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
  },
  
  headerGridF: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
  },
  
  headerGridG: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
  },
  
  headerGridK: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
  },
  
  headerAisle: {
    height: '30px',
    width: '40px',
  },
  
  headerAislePremium: {
    height: '30px',
    width: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerAisleWide: {
    height: '30px',
    width: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  rowNumberGrid: {
    textAlign: 'center',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#64748b',
  },
  
  seatGrid: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.2s ease',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'white',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },
  
  // Business Class seat styling
  businessSeatGrid: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.2s ease',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'white',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    margin: '0 auto', // Center horizontally in grid cell
  },
  
  // Premium Economy seat styling - larger than Economy, smaller than Business
  premiumEconomySeatGrid: {
    width: '55px',
    height: '55px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.2s ease',
    border: '2px solid rgba(139, 92, 246, 0.6)',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'white',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    margin: '2px auto', // Added margin for better spacing
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
  },
  
  // First Class seat styling - larger and more luxurious
  firstClassSeatGrid: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.3s ease',
    border: '3px solid rgba(255, 215, 0, 0.8)', // Gold border for luxury
    fontSize: '1rem',
    fontWeight: '700',
    color: 'white',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
    margin: '0 auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  
  aisleGrid: {
    width: '20px',
    height: '40px',
  },
  
  aisleGridPremium: {
    width: '40px',
    height: '55px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  aisleWideGrid: {
    width: '120px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    fontSize: '0.7rem',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  
  seatRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Increased gap for better spacing
    maxHeight: '500px',
    overflowY: 'auto',
    padding: '0 1rem',
  },
  
  seatRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minHeight: '44px',
  },
  
  rowNumber: {
    width: '2rem',
    textAlign: 'center',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#64748b',
    flexShrink: 0,
  },
  
  seatsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px', // Remove gap, use margin instead
    flex: 1,
  },
  
  seat: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.2s ease',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'white',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    margin: '0 2px', // Same margin as header items
  },
  
  seatContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1px',
  },
  
  seatLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    lineHeight: '1',
  },
  
  seatPrice: {
    fontSize: '0.5rem',
    fontWeight: '600',
    lineHeight: '1',
    opacity: 0.9,
  },
  
  seatFree: {
    fontSize: '0.45rem',
    fontWeight: '600',
    lineHeight: '1',
    opacity: 0.8,
  },
  
  aisle: {
    width: '20px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 2px', // Same margin as seats and headers
  },
  
  selectedIndicator: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#3b82f6',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
  },
  
  checkmark: {
    fontSize: '0.6rem',
    color: 'white',
    fontWeight: '900',
  },
  
  // Premium seat indicators for Business Class
  premiumIndicator: {
    position: 'absolute',
    top: '-6px',
    left: '-6px',
    background: '#f59e0b',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
    fontSize: '0.7rem',
  },
  
  premiumIcon: {
    fontSize: '0.7rem',
  },
  
  aircraftFooter: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  
  cockpitIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(16, 185, 129, 0.1)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  
  cockpitIcon: {
    fontSize: '1rem',
  },
  
  cockpitText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#059669',
  },
  
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(2px)',
  },
  
  disabledMessage: {
    textAlign: 'center',
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f59e0b',
  },
  
  disabledTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#92400e',
    margin: '0 0 0.5rem 0',
  },
  
  disabledText: {
    fontSize: '1rem',
    color: '#a16207',
    margin: 0,
  },
  
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    color: '#64748b',
    fontSize: '1.1rem',
  },
};