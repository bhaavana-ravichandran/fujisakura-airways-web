'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TravelInsurancePage() {
  const router = useRouter();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [seatSelection, setSeatSelection] = useState(null);
  const [baggageSelection, setBaggageSelection] = useState(null);
  const [mealSelection, setMealSelection] = useState(null);
  const [insuranceSelection, setInsuranceSelection] = useState('no'); // Default to 'no'
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Insurance pricing (mock/static)
  const INSURANCE_COST_PER_TRAVELER = 499;

  useEffect(() => {
    // Load data from localStorage
    const flightData = localStorage.getItem('selectedFlight');
    const passengerData = localStorage.getItem('passengerDetails');
    const seatData = localStorage.getItem('seatSelection');
    const baggageData = localStorage.getItem('baggageSelection');
    const mealData = localStorage.getItem('mealSelection');
    
    if (!flightData || !passengerData) {
      router.push('/home');
      return;
    }

    try {
      const flight = JSON.parse(flightData);
      const passengers = JSON.parse(passengerData);
      const seats = seatData ? JSON.parse(seatData) : null;
      const baggage = baggageData ? JSON.parse(baggageData) : null;
      const meals = mealData ? JSON.parse(mealData) : null;
      
      setSelectedFlight(flight);
      setPassengerDetails(passengers);
      setSeatSelection(seats);
      setBaggageSelection(baggage);
      setMealSelection(meals);
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading travel insurance data:', error);
      router.push('/home');
    }
  }, [router]);

  const handleInsuranceChange = (value) => {
    setInsuranceSelection(value);
  };

  const handleContinueToPayment = () => {
    // Calculate total insurance cost
    const totalInsuranceCost = insuranceSelection === 'yes' ? 
      INSURANCE_COST_PER_TRAVELER * passengerDetails.length : 0;
    
    // Save insurance selection data
    const insuranceSelectionData = {
      insuranceSelected: insuranceSelection === 'yes',
      selectionType: insuranceSelection,
      costPerTraveler: INSURANCE_COST_PER_TRAVELER,
      totalCost: totalInsuranceCost,
      travelers: passengerDetails.length
    };
    
    localStorage.setItem('insuranceSelection', JSON.stringify(insuranceSelectionData));
    router.push('/payment');
  };

  if (!isLoaded) {
    return (
      <div style={styles.pageContainer}>
        <Header />
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading travel insurance options...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Header />
      
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          {/* Page Header */}
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Travel Insurance</h1>
            <p style={styles.pageSubtitle}>
              Optional protection for your journey from {selectedFlight?.searchCriteria?.from} → {selectedFlight?.searchCriteria?.to}
            </p>
            
            {/* Progress Indicator */}
            <div style={styles.progressIndicator}>
              <span style={styles.progressText}>
                Passengers: {passengerDetails.length} • Step 5 of 6
              </span>
            </div>
          </div>

          <div style={styles.sectionsContainer}>
            {/* Left Panel - Insurance Selection */}
            <div style={styles.leftPanel}>
              
              {/* Insurance Selection Card */}
              <div style={styles.insuranceCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardIcon}>🛡️</div>
                  <div>
                    <h2 style={styles.cardTitle}>Protect Your Trip</h2>
                    <p style={styles.cardSubtitle}>
                      Travel insurance helps protect you against unexpected travel disruptions.
                    </p>
                  </div>
                </div>

                <div style={styles.optionsContainer}>
                  {/* Option 1: Yes, protect my trip */}
                  <label style={styles.optionLabel}>
                    <input
                      type="radio"
                      name="insurance"
                      value="yes"
                      checked={insuranceSelection === 'yes'}
                      onChange={() => handleInsuranceChange('yes')}
                      style={styles.radioInput}
                    />
                    <div style={styles.radioButton}>
                      {insuranceSelection === 'yes' && <div style={styles.radioInner}></div>}
                    </div>
                    <div style={styles.optionContent}>
                      <span style={styles.optionText}>Yes, protect my trip for ₹{INSURANCE_COST_PER_TRAVELER} per traveler</span>
                      <span style={styles.optionDescription}>
                        Get coverage for trip cancellations, delays, and other unexpected events
                      </span>
                    </div>
                  </label>

                  {/* Coverage Details - Show when "Yes" is selected */}
                  {insuranceSelection === 'yes' && (
                    <div style={styles.coverageDetails}>
                      <div style={styles.coverageHeader}>
                        <span style={styles.coverageIcon}>🛡️</span>
                        <span style={styles.coverageTitle}>Travel Insurance Includes</span>
                      </div>
                      <div style={styles.coverageList}>
                        <div style={styles.coverageItem}>
                          <span style={styles.checkIcon}>✔</span>
                          <span style={styles.coverageText}>Medical emergency coverage</span>
                        </div>
                        <div style={styles.coverageItem}>
                          <span style={styles.checkIcon}>✔</span>
                          <span style={styles.coverageText}>Trip cancellation protection</span>
                        </div>
                        <div style={styles.coverageItem}>
                          <span style={styles.checkIcon}>✔</span>
                          <span style={styles.coverageText}>Flight delay compensation</span>
                        </div>
                        <div style={styles.coverageItem}>
                          <span style={styles.checkIcon}>✔</span>
                          <span style={styles.coverageText}>Lost or delayed baggage</span>
                        </div>
                        <div style={styles.coverageItem}>
                          <span style={styles.checkIcon}>✔</span>
                          <span style={styles.coverageText}>Accidental death coverage</span>
                        </div>
                        <div style={styles.coverageItem}>
                          <span style={styles.checkIcon}>✔</span>
                          <span style={styles.coverageText}>Permanent disability coverage</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Option 2: No, I don't need insurance */}
                  <label style={styles.optionLabel}>
                    <input
                      type="radio"
                      name="insurance"
                      value="no"
                      checked={insuranceSelection === 'no'}
                      onChange={() => handleInsuranceChange('no')}
                      style={styles.radioInput}
                    />
                    <div style={styles.radioButton}>
                      {insuranceSelection === 'no' && <div style={styles.radioInner}></div>}
                    </div>
                    <div style={styles.optionContent}>
                      <span style={styles.optionText}>No, I don't need travel insurance</span>
                      <span style={styles.optionDescription}>
                        Continue without travel insurance protection
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Information Note */}
              <div style={styles.infoNote}>
                <div style={styles.noteIcon}>ℹ️</div>
                <p style={styles.noteText}>
                  You can review and modify your insurance selection before completing your booking.
                </p>
              </div>
            </div>

            {/* Right Panel - Summary */}
            <div style={styles.rightPanel}>
              {/* Selection Summary */}
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Insurance Selection</h3>
                
                <div style={styles.summaryContent}>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Travel Insurance:</span>
                    <span style={styles.summaryValue}>
                      {insuranceSelection === 'yes' ? `Yes, ₹${INSURANCE_COST_PER_TRAVELER} per traveler` : 'No insurance'}
                    </span>
                  </div>
                  
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Total Travelers:</span>
                    <span style={styles.summaryValue}>
                      {passengerDetails.length}
                    </span>
                  </div>
                  
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Insurance Cost:</span>
                    <span style={styles.summaryValue}>
                      {insuranceSelection === 'yes' ? 
                        `₹${INSURANCE_COST_PER_TRAVELER * passengerDetails.length}` : 
                        '₹0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div style={styles.backButtonRow}>
                <button
                  onClick={() => router.push('/meal-selection')}
                  style={styles.backButton}
                >
                  ← Back to Meal Selection
                </button>
              </div>

              {/* Continue Button */}
              <div style={styles.continueButtonRow}>
                <button
                  onClick={handleContinueToPayment}
                  style={styles.continueButton}
                >
                  Continue to Payment
                  {insuranceSelection === 'yes' && (
                    <span style={styles.buttonPrice}>
                      (+₹{INSURANCE_COST_PER_TRAVELER * passengerDetails.length})
                    </span>
                  )}
                </button>
              </div>
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  
  pageHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
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
    margin: '0 auto 1rem auto',
  },
  
  progressIndicator: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '0.75rem 1.5rem',
    display: 'inline-block',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  
  progressText: {
    fontSize: '0.9rem',
    color: '#3b82f6',
    fontWeight: '600',
  },
  
  sectionsContainer: {
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
  
  insuranceCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #e2e8f0',
  },
  
  cardIcon: {
    fontSize: '2.5rem',
    flexShrink: 0,
  },
  
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
  },
  
  cardSubtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.5',
  },
  
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  optionLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.5rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white',
    ':hover': {
      borderColor: '#3b82f6',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
      transform: 'translateY(-1px)',
    }
  },
  
  radioInput: {
    display: 'none',
  },
  
  radioButton: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '0.25rem',
  },
  
  radioInner: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
  },
  
  optionContent: {
    flex: 1,
  },
  
  optionText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    display: 'block',
    marginBottom: '0.5rem',
  },
  
  optionDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.4',
  },
  
  coverageDetails: {
    background: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginTop: '1rem',
    marginLeft: '3rem', // Align with option content
  },
  
  coverageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  
  coverageIcon: {
    fontSize: '1.25rem',
  },
  
  coverageTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  
  coverageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  
  coverageItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  checkIcon: {
    fontSize: '1rem',
    color: '#10b981',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  
  coverageText: {
    fontSize: '0.9rem',
    color: '#374151',
    lineHeight: '1.4',
  },
  
  infoNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '2px solid #3b82f6',
    borderRadius: '12px',
    padding: '1rem',
  },
  
  noteIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  
  noteText: {
    fontSize: '0.9rem',
    color: '#1e40af',
    margin: 0,
    lineHeight: '1.4',
  },
  
  summaryCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '1.5rem',
  },
  
  summaryTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 1.5rem 0',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.75rem',
  },
  
  summaryContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  
  summaryLabel: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151',
  },
  
  summaryValue: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  
  backButtonRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '1rem',
  },
  
  backButton: {
    background: 'linear-gradient(135deg, #6c757d, #495057)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(108, 117, 125, 0.3)',
  },
  
  continueButtonRow: {
    display: 'flex',
    justifyContent: 'stretch',
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
    width: '100%',
  },
  
  buttonPrice: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginTop: '0.25rem',
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
};