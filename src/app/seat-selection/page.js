'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeatMap from '../../components/SeatMap';
import PassengerSeatSummary from '../../components/PassengerSeatSummary';
import CabinClassSelector from '../../components/CabinClassSelector';
import EconomyFareSelector from '../../components/EconomyFareSelector';
import BusinessFareSelector from '../../components/BusinessFareSelector';
import BackButton from '../../components/BackButton';
import { generateSeatMap, calculateSeatPrice, ECONOMY_FARE_TYPES, BUSINESS_FARE_TYPES } from '../../utils/seatUtils';
import { formatPrice, CURRENCY_CONFIG } from '../../utils/currency';

export default function SeatSelectionPage() {
  const router = useRouter();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [selectedCabinClass, setSelectedCabinClass] = useState('Economy');
  const [selectedFareType, setSelectedFareType] = useState('base'); // Default to Economy Base
  const [selectedBusinessFareType, setSelectedBusinessFareType] = useState('flex'); // Default to Business Flex
  const [selectedSeats, setSelectedSeats] = useState({});
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [seatMap, setSeatMap] = useState(null);
  const [totalSeatPrice, setTotalSeatPrice] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const flightData = localStorage.getItem('selectedFlight');
    const passengerData = localStorage.getItem('passengerDetails');
    
    if (!flightData || !passengerData) {
      router.push('/home');
      return;
    }

    try {
      const flight = JSON.parse(flightData);
      const passengers = JSON.parse(passengerData);
      
      setSelectedFlight(flight);
      setPassengerDetails(passengers);
      
      // Generate seat map for selected cabin class
      const generatedSeatMap = generateSeatMap(selectedCabinClass);
      setSeatMap(generatedSeatMap);
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading seat selection data:', error);
      router.push('/home');
    }
  }, [router]);

  useEffect(() => {
    // Regenerate seat map when cabin class changes
    if (selectedCabinClass) {
      const generatedSeatMap = generateSeatMap(selectedCabinClass);
      setSeatMap(generatedSeatMap);
      
      // Clear selected seats when changing cabin class
      setSelectedSeats({});
      setCurrentPassengerIndex(0);
      setTotalSeatPrice(0);
    }
  }, [selectedCabinClass]);

  useEffect(() => {
    // Calculate total seat price based on cabin class and fare type
    let total = 0;
    
    if (selectedCabinClass === 'Economy') {
      const fareMultiplier = ECONOMY_FARE_TYPES[selectedFareType.toUpperCase()]?.priceMultiplier || 1.0;
      total = Object.values(selectedSeats).reduce((sum, seat) => {
        return sum + calculateSeatPrice(seat.type, selectedCabinClass, fareMultiplier);
      }, 0);
    } else if (selectedCabinClass === 'Business') {
      total = Object.values(selectedSeats).reduce((sum, seat) => {
        return sum + calculateSeatPrice(seat.type, selectedCabinClass, 1.0, selectedBusinessFareType);
      }, 0);
    } else {
      // First Class or other classes
      total = Object.values(selectedSeats).reduce((sum, seat) => {
        return sum + calculateSeatPrice(seat.type, selectedCabinClass, 1.0);
      }, 0);
    }
    
    setTotalSeatPrice(total);
  }, [selectedSeats, selectedCabinClass, selectedFareType, selectedBusinessFareType]);

  const handleSeatSelect = (seatId, seatData) => {
    const currentPassenger = passengerDetails[currentPassengerIndex];
    
    // Check if seat is already selected by another passenger
    const isAlreadySelected = Object.values(selectedSeats).some(seat => seat.id === seatId);
    
    if (isAlreadySelected) {
      // Deselect seat
      const newSelectedSeats = { ...selectedSeats };
      const passengerKey = Object.keys(newSelectedSeats).find(key => 
        newSelectedSeats[key].id === seatId
      );
      delete newSelectedSeats[passengerKey];
      setSelectedSeats(newSelectedSeats);
      
      // Move back to the passenger who had this seat
      const passengerIndex = passengerDetails.findIndex(p => 
        `${p.firstName}_${p.lastName}` === passengerKey
      );
      if (passengerIndex !== -1) {
        setCurrentPassengerIndex(passengerIndex);
      }
    } else {
      // Select seat for current passenger
      const passengerKey = `${currentPassenger.firstName}_${currentPassenger.lastName}`;
      let seatPrice = 0;
      
      // Calculate price based on cabin class
      if (selectedCabinClass === 'Economy') {
        const fareMultiplier = ECONOMY_FARE_TYPES[selectedFareType.toUpperCase()]?.priceMultiplier || 1.0;
        seatPrice = calculateSeatPrice(seatData.type, selectedCabinClass, fareMultiplier);
      } else if (selectedCabinClass === 'Business') {
        seatPrice = calculateSeatPrice(seatData.type, selectedCabinClass, 1.0, selectedBusinessFareType);
      } else {
        seatPrice = calculateSeatPrice(seatData.type, selectedCabinClass, 1.0);
      }
      
      setSelectedSeats(prev => ({
        ...prev,
        [passengerKey]: { ...seatData, id: seatId }
      }));
      
      // Show instant price feedback
      if (seatPrice > 0) {
        // Create temporary price notification
        const notification = document.createElement('div');
        notification.textContent = `+₹${seatPrice.toLocaleString()} added`;
        notification.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #059669;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
          animation: priceNotification 2s ease-out forwards;
        `;
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#priceNotificationStyles')) {
          const style = document.createElement('style');
          style.id = 'priceNotificationStyles';
          style.textContent = `
            @keyframes priceNotification {
              0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
              20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
              80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            }
          `;
          document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 2000);
      } else {
        // Show "Included" notification for Business Class or free seats
        const notification = document.createElement('div');
        notification.textContent = selectedCabinClass === 'Business' ? 'Included with fare' : 'Free seat selected';
        notification.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #3b82f6;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          animation: priceNotification 2s ease-out forwards;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 2000);
      }
      
      // Move to next passenger if available
      if (currentPassengerIndex < passengerDetails.length - 1) {
        setCurrentPassengerIndex(currentPassengerIndex + 1);
      }
    }
  };

  const handleFareTypeChange = (fareType) => {
    setSelectedFareType(fareType);
    // Recalculate prices for existing seat selections will happen automatically via useEffect
  };

  const handleBusinessFareTypeChange = (fareType) => {
    setSelectedBusinessFareType(fareType);
    // Recalculate prices for existing seat selections will happen automatically via useEffect
  };

  const handleContinueToPayment = () => {
    // Save seat selection data with fare type information
    let seatSelectionData;
    
    if (selectedCabinClass === 'Economy') {
      const fareMultiplier = ECONOMY_FARE_TYPES[selectedFareType.toUpperCase()]?.priceMultiplier || 1.0;
      seatSelectionData = {
        selectedSeats,
        cabinClass: selectedCabinClass,
        fareType: selectedFareType,
        fareMultiplier: fareMultiplier,
        totalSeatPrice,
        seatSummary: Object.entries(selectedSeats).map(([passengerKey, seat]) => ({
          passenger: passengerKey.replace('_', ' '),
          seat: seat.id,
          type: seat.type,
          price: calculateSeatPrice(seat.type, selectedCabinClass, fareMultiplier)
        }))
      };
    } else if (selectedCabinClass === 'Business') {
      seatSelectionData = {
        selectedSeats,
        cabinClass: selectedCabinClass,
        businessFareType: selectedBusinessFareType,
        totalSeatPrice,
        seatSummary: Object.entries(selectedSeats).map(([passengerKey, seat]) => ({
          passenger: passengerKey.replace('_', ' '),
          seat: seat.id,
          type: seat.type,
          price: calculateSeatPrice(seat.type, selectedCabinClass, 1.0, selectedBusinessFareType)
        }))
      };
    } else {
      // First Class or other
      seatSelectionData = {
        selectedSeats,
        cabinClass: selectedCabinClass,
        totalSeatPrice,
        seatSummary: Object.entries(selectedSeats).map(([passengerKey, seat]) => ({
          passenger: passengerKey.replace('_', ' '),
          seat: seat.id,
          type: seat.type,
          price: calculateSeatPrice(seat.type, selectedCabinClass, 1.0)
        }))
      };
    }
    
    localStorage.setItem('seatSelection', JSON.stringify(seatSelectionData));
    router.push('/payment');
  };

  const handleSkipSeatSelection = () => {
    // Clear any seat selection data and continue
    localStorage.removeItem('seatSelection');
    router.push('/payment');
  };

  if (!isLoaded || !seatMap) {
    return (
      <div style={styles.pageContainer}>
        <Header />
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading seat map...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const allPassengersSeated = Object.keys(selectedSeats).length === passengerDetails.length;
  const currentPassenger = passengerDetails[currentPassengerIndex];

  return (
    <div style={styles.pageContainer}>
      <Header />
      
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          {/* Page Header */}
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Select Your Seats</h1>
            <p style={styles.pageSubtitle}>
              Choose your preferred seats for {selectedFlight?.searchCriteria?.from} → {selectedFlight?.searchCriteria?.to}
            </p>
          </div>

          {/* Back Button */}
          <div style={styles.backButtonContainer}>
            <BackButton customPath="/passenger-details" label="Back to Passenger Details" />
          </div>

          <div style={styles.selectionContainer}>
            {/* Left Panel - Seat Map */}
            <div style={styles.leftPanel}>
              {/* Cabin Class Selector */}
              <CabinClassSelector
                selectedClass={selectedCabinClass}
                onClassChange={setSelectedCabinClass}
                availableClasses={['Economy', 'Business', 'First']}
              />

              {/* Economy Fare Type Selector - Only show for Economy class */}
              {selectedCabinClass === 'Economy' && (
                <EconomyFareSelector
                  selectedFareType={selectedFareType}
                  onFareTypeChange={handleFareTypeChange}
                />
              )}

              {/* Business Fare Type Selector - Only show for Business class */}
              {selectedCabinClass === 'Business' && (
                <BusinessFareSelector
                  selectedFareType={selectedBusinessFareType}
                  onFareTypeChange={handleBusinessFareTypeChange}
                />
              )}

              {/* Current Passenger Indicator */}
              {!allPassengersSeated && (
                <div style={styles.currentPassengerCard}>
                  <div style={styles.passengerIndicator}>
                    <span style={styles.passengerIcon}>👤</span>
                    <div style={styles.passengerInfo}>
                      <p style={styles.currentPassengerText}>
                        Selecting seat for:
                      </p>
                      <p style={styles.currentPassengerName}>
                        {currentPassenger?.title} {currentPassenger?.firstName} {currentPassenger?.lastName}
                      </p>
                    </div>
                  </div>
                  
                  {/* Live Price Indicator */}
                  <div style={styles.livePriceIndicator}>
                    <div style={styles.priceIndicatorHeader}>
                      <span style={styles.priceIcon}>💰</span>
                      <span style={styles.priceIndicatorText}>Current Selection</span>
                    </div>
                    <div style={styles.priceIndicatorValue}>
                      Total: {formatPrice(totalSeatPrice, CURRENCY_CONFIG)}
                    </div>
                    {Object.keys(selectedSeats).length > 0 && (
                      <div style={styles.priceIndicatorSubtext}>
                        {Object.keys(selectedSeats).length} seat{Object.keys(selectedSeats).length !== 1 ? 's' : ''} selected
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Seat Map */}
              <div style={styles.seatMapContainer}>
                <SeatMap
                  seatMap={seatMap}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                  cabinClass={selectedCabinClass}
                  fareType={selectedFareType}
                  businessFareType={selectedBusinessFareType}
                  disabled={false}
                />
              </div>

              {/* Additional Information Card */}
              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>Additional Information</h4>
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
                    <span style={styles.cabinClassText}>{selectedCabinClass} Class</span>
                  </div>
                  {selectedCabinClass !== 'Economy' && (
                    <p style={styles.comingSoonText}>
                      Full seat selection available soon
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Summary */}
            <div style={styles.rightPanel}>
              {/* Passenger Seat Summary */}
              <PassengerSeatSummary
                passengers={passengerDetails}
                selectedSeats={selectedSeats}
                cabinClass={selectedCabinClass}
                fareType={selectedFareType}
                businessFareType={selectedBusinessFareType}
                totalPrice={totalSeatPrice}
              />

              {/* Action Buttons */}
              <div style={styles.actionButtons}>
                <button
                  onClick={handleSkipSeatSelection}
                  style={styles.skipButton}
                >
                  Skip Seat Selection
                </button>
                
                <button
                  onClick={handleContinueToPayment}
                  style={{
                    ...styles.continueButton,
                  }}
                >
                  Continue to Payment
                  {totalSeatPrice > 0 && (
                    <span style={styles.buttonPrice}>
                      (+{formatPrice(totalSeatPrice, CURRENCY_CONFIG)})
                    </span>
                  )}
                </button>
              </div>

              {/* Future Classes Notice - Only show for First Class */}
              {selectedCabinClass === 'First' && (
                <div style={styles.futureNotice}>
                  <div style={styles.noticeIcon}>🚧</div>
                  <div>
                    <p style={styles.noticeTitle}>Coming Soon</p>
                    <p style={styles.noticeText}>
                      {selectedCabinClass} Class seat selection will be available in a future update.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #E0F6FF 75%, #F0F8FF 100%)',
  },
  
  main: {
    flex: 1,
    paddingTop: '100px',
    paddingBottom: '60px',
    minHeight: 'calc(100vh - 160px)'
  },
  
  contentWrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  
  pageHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#4a5568',
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  backButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  
  selectionContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '3rem',
    alignItems: 'flex-start',
  },
  
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  
  rightPanel: {
    position: 'sticky',
    top: '120px',
  },
  
  currentPassengerCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '2px solid #3b82f6',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  passengerIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  passengerIcon: {
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
  
  passengerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  
  currentPassengerText: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: '0 0 0.25rem 0',
  },
  
  currentPassengerName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0,
  },
  
  livePriceIndicator: {
    background: 'linear-gradient(135deg, #059669, #047857)',
    borderRadius: '12px',
    padding: '1rem',
    color: 'white',
    textAlign: 'center',
  },
  
  priceIndicatorHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  
  priceIcon: {
    fontSize: '1.2rem',
  },
  
  priceIndicatorText: {
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  
  priceIndicatorValue: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
  },
  
  priceIndicatorSubtext: {
    fontSize: '0.8rem',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  
  seatMapContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '2rem',
  },
  
  skipButton: {
    background: 'white',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  continueButton: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
  },
  
  disabledButton: {
    background: '#e5e7eb',
    color: '#9ca3af',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  
  buttonPrice: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginTop: '0.25rem',
  },
  
  futureNotice: {
    background: 'rgba(255, 243, 205, 0.9)',
    border: '2px solid #f59e0b',
    borderRadius: '12px',
    padding: '1.5rem',
    marginTop: '2rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  
  noticeIcon: {
    fontSize: '1.5rem',
  },
  
  noticeTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#92400e',
    margin: '0 0 0.5rem 0',
  },
  
  noticeText: {
    fontSize: '0.95rem',
    color: '#a16207',
    margin: 0,
    lineHeight: '1.4',
  },
  
  loadingContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    fontSize: '1.1rem',
    color: '#6b7280',
  },
  
  // Information Card Styles
  infoCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e2e8f0',
  },
  
  infoCardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '0.75rem',
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