'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PaymentPage() {
  const router = useRouter();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Check if required data exists in localStorage
    const flightData = localStorage.getItem('selectedFlight');
    const passengerData = localStorage.getItem('passengerDetails');
    
    if (!flightData || !passengerData) {
      // Redirect to home if no data found
      router.push('/home');
      return;
    }

    try {
      setSelectedFlight(JSON.parse(flightData));
      setPassengerDetails(JSON.parse(passengerData));
      setIsLoaded(true);
    } catch (error) {
      console.error('Error parsing data:', error);
      router.push('/home');
    }
  }, [router]);

  const handleProceedToPay = () => {
    setShowToast(true);
  };

  const handleToastClose = () => {
    setShowToast(false);
    router.push('/home');
  };

  const formatCityName = (cityCode) => {
    if (!cityCode) return '';
    return cityCode.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
          <h1 style={styles.title}>Payment Page</h1>
          <p style={styles.subtitle}>This is a placeholder payment page</p>
          
          <div style={styles.summarySection}>
            <h3 style={styles.sectionTitle}>Booking Summary</h3>
            
            <div style={styles.flightSummary}>
              <h4>Flight Details</h4>
              <p>{formatCityName(selectedFlight.searchCriteria?.from)} → {formatCityName(selectedFlight.searchCriteria?.to)}</p>
              <p>{selectedFlight.airline} - {selectedFlight.flightNumber}</p>
              <p>Price: ${selectedFlight.finalPrice}</p>
            </div>
            
            <div style={styles.passengerSummary}>
              <h4>Passengers ({passengerDetails.length})</h4>
              {passengerDetails.map((passenger, index) => (
                <div key={index} style={styles.passengerItem}>
                  <p>{passenger.firstName} {passenger.middleName} {passenger.lastName}</p>
                  <p>Gender: {passenger.gender}</p>
                  {passenger.email && <p>Email: {passenger.email}</p>}
                  {passenger.phone && <p>Phone: {passenger.phone}</p>}
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.buttonContainer}>
            <button
              onClick={() => router.push('/passenger-details')}
              style={styles.backButton}
            >
              ← Back to Passenger Details
            </button>
            <button
              onClick={handleProceedToPay}
              style={styles.payButton}
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Toast Modal */}
      {showToast && (
        <div style={styles.toastOverlay}>
          <div style={styles.toastModal}>
            <div style={styles.toastContent}>
              <p style={styles.toastMessage}>
                Payment integration will be implemented in a later phase.
              </p>
              <button
                onClick={handleToastClose}
                style={styles.toastButton}
                className="toast-button"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
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
    maxWidth: '800px',
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
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '300',
    color: '#2c3e50',
    marginBottom: '10px',
    textAlign: 'center'
  },
  
  subtitle: {
    fontSize: '1.1rem',
    color: '#6c757d',
    marginBottom: '30px',
    textAlign: 'center'
  },
  
  summarySection: {
    marginBottom: '30px'
  },
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px'
  },
  
  flightSummary: {
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  
  passengerSummary: {
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px'
  },
  
  passengerItem: {
    padding: '10px 0',
    borderBottom: '1px solid #e9ecef'
  },
  
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px'
  },
  
  backButton: {
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
  },
  
  payButton: {
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
  },
  
  // Toast Modal Styles
  toastOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  },
  
  toastModal: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '0',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    maxWidth: '400px',
    width: '90%',
    animation: 'slideIn 0.3s ease-out'
  },
  
  toastContent: {
    padding: '30px',
    textAlign: 'center'
  },
  
  toastMessage: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    marginBottom: '25px',
    lineHeight: '1.5',
    fontWeight: '500'
  },
  
  toastButton: {
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
    minWidth: '100px'
  }
};