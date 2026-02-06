'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { formatPrice, getCurrencyFromData } from '../../utils/currency';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [bookingId, setBookingId] = useState('');
  const [pnr, setPnr] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(10);
  
  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Generate random booking ID and PNR
  const generateBookingId = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `FJA-BK-${randomDigits}`;
  };

  const generatePNR = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pnr;
  };

  useEffect(() => {
    // Check if required data exists in localStorage
    const flightData = localStorage.getItem('selectedFlight');
    const passengerData = localStorage.getItem('passengerDetails');
    const bookingSaved = sessionStorage.getItem('bookingSaved');
    
    if (!flightData || !passengerData) {
      // Redirect to home if no data found
      router.push('/home');
      return;
    }

    try {
      const flight = JSON.parse(flightData);
      const passengers = JSON.parse(passengerData);
      
      setSelectedFlight(flight);
      setPassengerDetails(passengers);
      
      // Handle both old array format and new object format for display
      const passengerList = Array.isArray(passengers) ? passengers : (passengers?.passengers || []);
      setPassengerDetails(passengerList);
      
      // Check if booking was already saved in this session
      if (!bookingSaved) {
        // Generate booking ID and PNR once
        const newBookingId = generateBookingId();
        const newPnr = generatePNR();
        setBookingId(newBookingId);
        setPnr(newPnr);
        
        // Save booking to localStorage
        const seatSelectionData = localStorage.getItem('seatSelection');
        const seatSelection = seatSelectionData ? JSON.parse(seatSelectionData) : null;
        
        // Handle both old array format and new object format for passengers
        const passengerList = Array.isArray(passengers) ? passengers : (passengers?.passengers || []);
        
        const booking = {
          bookingId: newBookingId,
          pnr: newPnr,
          flight: {
            from: flight.searchCriteria?.from || 'Unknown',
            to: flight.searchCriteria?.to || 'Unknown',
            airline: flight.airline,
            flightNumber: flight.flightNumber,
            price: flight.pricing ? flight.pricing.total.amount : flight.finalPrice,
            pricing: flight.pricing, // Store full pricing structure
            departureDate: flight.searchCriteria?.departureDate || 'Not specified',
            duration: flight.duration || 'N/A'
          },
          passengers: passengerList, // Always store as array for consistency
          seatSelection: seatSelection, // Include seat selection data
          status: 'Upcoming',
          bookingDate: new Date().toISOString()
        };
        
        // Get existing bookings or initialize empty array
        const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(existingBookings));
        
        // Mark booking as saved in this session
        sessionStorage.setItem('bookingSaved', 'true');
        sessionStorage.setItem('currentBookingId', newBookingId);
        sessionStorage.setItem('currentPnr', newPnr);
      } else {
        // Retrieve existing booking ID and PNR from session
        setBookingId(sessionStorage.getItem('currentBookingId') || generateBookingId());
        setPnr(sessionStorage.getItem('currentPnr') || generatePNR());
      }
      
      setIsLoaded(true);
      
      // Show success toast
      showToast('🎉 Booking confirmed successfully! You will be redirected to My Bookings shortly.', 'success');
      
    } catch (error) {
      console.error('Error parsing data:', error);
      router.push('/home');
    }
  }, [router]);

  // Auto-redirect countdown effect
  useEffect(() => {
    if (!isLoaded) return;

    const countdown = setInterval(() => {
      setAutoRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleViewBookings();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [isLoaded]);

  const formatCityName = (cityCode) => {
    if (!cityCode) return '';
    return cityCode.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleGoToHome = () => {
    // Clear session flag when leaving confirmation page
    sessionStorage.removeItem('bookingSaved');
    sessionStorage.removeItem('currentBookingId');
    sessionStorage.removeItem('currentPnr');
    router.push('/home');
  };

  const handleViewBookings = () => {
    // Clear session flag when leaving confirmation page
    sessionStorage.removeItem('bookingSaved');
    sessionStorage.removeItem('currentBookingId');
    sessionStorage.removeItem('currentPnr');
    
    // Set flag to show welcome toast in my-bookings
    sessionStorage.setItem('fromBookingConfirmation', 'true');
    
    showToast('Redirecting to My Bookings...', 'info');
    setTimeout(() => {
      router.push('/my-bookings');
    }, 1000);
  };

  if (!selectedFlight || !passengerDetails.length || !isLoaded) {
    return (
      <div style={styles.pageContainer}>
        <Header />
        <div style={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main Content Container */}
      <div style={styles.container}>
        <div style={styles.contentCard}>
          {/* Confirmation Section */}
          <div style={styles.confirmationHeader}>
            <div style={styles.successIcon}>✓</div>
            <h1 style={styles.title}>Booking Confirmed!</h1>
            <p style={styles.subtitle}>Your flight has been successfully booked</p>
            
            {/* Auto-redirect notification */}
            <div style={styles.autoRedirectNotice}>
              <p style={styles.redirectText}>
                🚀 Automatically redirecting to My Bookings in <strong>{autoRedirectCountdown}</strong> seconds
              </p>
              <button 
                onClick={handleViewBookings}
                style={styles.redirectNowButton}
              >
                Go Now
              </button>
            </div>
          </div>

          {/* Booking Identifiers */}
          <div style={styles.identifiersSection}>
            <div style={styles.identifierCard}>
              <span style={styles.identifierLabel}>Booking ID</span>
              <span style={styles.identifierValue}>{bookingId}</span>
            </div>
            <div style={styles.identifierCard}>
              <span style={styles.identifierLabel}>PNR</span>
              <span style={styles.identifierValue}>{pnr}</span>
            </div>
          </div>

          {/* Flight Summary Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Flight Details</h3>
            <div style={styles.summaryCard}>
              <div style={styles.flightRow}>
                <div style={styles.flightInfo}>
                  <span style={styles.label}>Route</span>
                  <span style={styles.value}>
                    {formatCityName(selectedFlight.searchCriteria?.from)} → {formatCityName(selectedFlight.searchCriteria?.to)}
                  </span>
                </div>
                <div style={styles.flightInfo}>
                  <span style={styles.label}>Travel Date</span>
                  <span style={styles.value}>
                    {selectedFlight.searchCriteria?.departureDate || 'Not specified'}
                  </span>
                </div>
              </div>
              
              <div style={styles.flightRow}>
                <div style={styles.flightInfo}>
                  <span style={styles.label}>Flight</span>
                  <span style={styles.value}>
                    {selectedFlight.airline} - {selectedFlight.flightNumber}
                  </span>
                </div>
                <div style={styles.flightInfo}>
                  <span style={styles.label}>Duration</span>
                  <span style={styles.value}>{selectedFlight.duration || 'N/A'}</span>
                </div>
              </div>

              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Total Amount</span>
                <span style={styles.priceValue}>
                  {selectedFlight.pricing 
                    ? selectedFlight.pricing.total.formatted 
                    : formatPrice(selectedFlight.finalPrice, getCurrencyFromData(selectedFlight))
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Passenger Summary Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Passenger Information</h3>
            <div style={styles.summaryCard}>
              <div style={styles.passengerCount}>
                <span style={styles.label}>Total Passengers</span>
                <span style={styles.value}>{passengerDetails.length}</span>
              </div>
              
              <div style={styles.passengerList}>
                {passengerDetails.map((passenger, index) => (
                  <div key={index} style={styles.passengerItem}>
                    <span style={styles.passengerNumber}>Passenger {index + 1}</span>
                    <span style={styles.passengerName}>
                      {passenger.firstName} {passenger.middleName} {passenger.lastName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonContainer}>
            <button
              onClick={() => router.push('/home')}
              style={styles.backButton}
            >
              ← Back to Home
            </button>
            <button
              onClick={handleViewBookings}
              style={styles.primaryButton}
            >
              View My Bookings
            </button>
            <button
              onClick={handleGoToHome}
              style={styles.secondaryButton}
            >
              Book Another Flight
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={5000}
      />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #E0F6FF 75%, #F0F8FF 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  container: {
    flex: 1,
    padding: '20px',
    paddingTop: '100px',
    paddingBottom: '80px',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%'
  },
  
  loadingContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#2c3e50'
  },
  
  contentCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  confirmationHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  
  autoRedirectNotice: {
    marginTop: '30px',
    padding: '20px',
    background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
    borderRadius: '12px',
    border: '2px solid #bbdefb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
  },
  
  redirectText: {
    fontSize: '1rem',
    color: '#1565c0',
    margin: 0,
    fontWeight: '500'
  },
  
  redirectNowButton: {
    background: 'linear-gradient(135deg, #2196f3, #1976d2)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
  },
  
  successIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: 'white',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '10px'
  },
  
  subtitle: {
    fontSize: '1.1rem',
    color: '#6c757d'
  },
  
  identifiersSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  
  identifierCard: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid #e9ecef'
  },
  
  identifierLabel: {
    fontSize: '0.9rem',
    color: '#6c757d',
    marginBottom: '8px',
    fontWeight: '500'
  },
  
  identifierValue: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#007bff',
    letterSpacing: '1px'
  },
  
  section: {
    marginBottom: '30px'
  },
  
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '15px'
  },
  
  summaryCard: {
    background: '#f8f9fa',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  },
  
  flightRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  
  flightInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  
  label: {
    fontSize: '0.85rem',
    color: '#6c757d',
    marginBottom: '5px',
    fontWeight: '500'
  },
  
  value: {
    fontSize: '1rem',
    color: '#2c3e50',
    fontWeight: '600'
  },
  
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '2px solid #e9ecef',
    marginTop: '10px'
  },
  
  priceLabel: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50'
  },
  
  priceValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#28a745'
  },
  
  passengerCount: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e9ecef'
  },
  
  passengerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  
  passengerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  
  passengerNumber: {
    fontSize: '0.85rem',
    color: '#6c757d',
    fontWeight: '500'
  },
  
  passengerName: {
    fontSize: '1rem',
    color: '#2c3e50',
    fontWeight: '600'
  },
  
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '40px',
    flexWrap: 'wrap'
  },
  
  primaryButton: {
    flex: 1,
    minWidth: '200px',
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
  },
  
  secondaryButton: {
    flex: 1,
    minWidth: '200px',
    background: 'white',
    color: '#007bff',
    border: '2px solid #007bff',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  backButton: {
    flex: 1,
    minWidth: '200px',
    background: 'linear-gradient(135deg, #6c757d, #495057)',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(108, 117, 125, 0.3)'
  }
};
