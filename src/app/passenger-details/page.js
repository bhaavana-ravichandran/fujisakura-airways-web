'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { handleAlphabetsOnly, handleDigitsOnly, handlePhoneInput, isValidEmail, isValidAge } from '../../utils/inputValidation';
import { formatPrice, getCurrencyFromData } from '../../utils/currency';

export default function PassengerDetailsPage() {
  const router = useRouter();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSpecialAssistanceExpanded, setIsSpecialAssistanceExpanded] = useState(false);
  const [specialAssistanceSelections, setSpecialAssistanceSelections] = useState({});
  const [needsSpecialAssistance, setNeedsSpecialAssistance] = useState(false);
  const [specialAssistanceData, setSpecialAssistanceData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if flight data exists in localStorage
    const flightData = localStorage.getItem('selectedFlight');
    
    if (!flightData) {
      // Redirect to home if no flight selected
      router.push('/home');
      return;
    }

    try {
      const flight = JSON.parse(flightData);
      setSelectedFlight(flight);
      
      // Initialize passenger details based on traveller count
      const travellerCount = parseInt(flight.searchCriteria?.travellers || '1');
      const initialPassengers = Array.from({ length: travellerCount }, (_, index) => ({
        id: index + 1,
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        age: '',
        email: index === 0 ? '' : undefined, // Only primary passenger
        phone: index === 0 ? '' : undefined  // Only primary passenger
      }));
      
      setPassengerDetails(initialPassengers);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error parsing flight data:', error);
      router.push('/home');
    }
  }, [router]);

  // Handle modal keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleInputChange = (passengerIndex, field, value) => {
    let processedValue = value;
    
    // Apply input restrictions based on field type
    if (field === 'firstName' || field === 'middleName' || field === 'lastName') {
      processedValue = handleAlphabetsOnly(value);
    } else if (field === 'age') {
      processedValue = handleDigitsOnly(value);
    } else if (field === 'phone') {
      processedValue = handlePhoneInput(value);
    }
    
    setPassengerDetails(prev => 
      prev.map((passenger, index) => 
        index === passengerIndex 
          ? { ...passenger, [field]: processedValue }
          : passenger
      )
    );
    
    // Clear error for this field
    if (errors[`${passengerIndex}-${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${passengerIndex}-${field}`];
        return newErrors;
      });
    }
  };

  const handleSpecialAssistanceChange = (passengerIndex, assistanceType, isSelected) => {
    setSpecialAssistanceSelections(prev => ({
      ...prev,
      [passengerIndex]: {
        ...prev[passengerIndex],
        [assistanceType]: isSelected
      }
    }));
  };

  const handleAssistanceOptionChange = (passengerIndex, option, value) => {
    setSpecialAssistanceData(prev => ({
      ...prev,
      [passengerIndex]: {
        ...prev[passengerIndex],
        [option]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    passengerDetails.forEach((passenger, index) => {
      // Required fields for all passengers
      if (!passenger.firstName.trim()) {
        newErrors[`${index}-firstName`] = 'First name is required';
      }
      if (!passenger.lastName.trim()) {
        newErrors[`${index}-lastName`] = 'Last name is required';
      }
      if (!passenger.gender) {
        newErrors[`${index}-gender`] = 'Gender is required';
      }
      
      // Age validation
      if (!passenger.age) {
        newErrors[`${index}-age`] = 'Age is required';
      } else {
        const age = parseInt(passenger.age);
        if (isNaN(age) || age < 0 || age > 100) {
          newErrors[`${index}-age`] = 'Age must be between 0 and 100';
        }
      }
      
      // Additional fields for primary passenger
      if (index === 0) {
        if (!passenger.email.trim()) {
          newErrors[`${index}-email`] = 'Email is required';
        } else if (!isValidEmail(passenger.email)) {
          newErrors[`${index}-email`] = 'Please enter a valid email';
        }
        
        if (!passenger.phone.trim()) {
          newErrors[`${index}-phone`] = 'Phone number is required';
        } else if (passenger.phone.length !== 10) {
          newErrors[`${index}-phone`] = 'Phone number must be 10 digits';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToSeatSelection = () => {
    if (!validateForm()) {
      return;
    }
    
    // Store passenger details and special assistance in localStorage
    const passengerData = {
      passengers: passengerDetails,
      specialAssistance: specialAssistanceSelections
    };
    localStorage.setItem('passengerDetails', JSON.stringify(passengerData));
    
    // Navigate to seat selection page
    router.push('/seat-selection');
  };

  const handleSkipToPayment = () => {
    if (!validateForm()) {
      return;
    }
    
    // Store passenger details and special assistance in localStorage
    const passengerData = {
      passengers: passengerDetails,
      specialAssistance: specialAssistanceSelections
    };
    localStorage.setItem('passengerDetails', JSON.stringify(passengerData));
    
    // Clear any existing seat selection data
    localStorage.removeItem('seatSelection');
    
    // Navigate directly to payment page
    router.push('/payment');
  };

  const formatCityName = (cityCode) => {
    if (!cityCode) return '';
    return cityCode.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!selectedFlight || !isLoaded) {
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
        {/* Flight Summary */}
        <div style={styles.flightSummary}>
          <h1 style={styles.title}>Passenger Details</h1>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Flight Summary</h3>
            <div style={styles.routeInfo}>
              <span style={styles.route}>
                {formatCityName(selectedFlight.searchCriteria?.from)} → {formatCityName(selectedFlight.searchCriteria?.to)}
              </span>
              <span style={styles.date}>
                {selectedFlight.searchCriteria?.departureDate || 'Date not specified'}
              </span>
            </div>
            <div style={styles.flightInfo}>
              <span>{selectedFlight.airline} - {selectedFlight.flightNumber}</span>
              <span style={styles.price}>
                {selectedFlight.pricing 
                  ? selectedFlight.pricing.total.formatted 
                  : formatPrice(selectedFlight.finalPrice, getCurrencyFromData(selectedFlight))
                }
              </span>
            </div>
          </div>
        </div>



        {/* Passenger Details Form */}
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>
            Enter Details for {passengerDetails.length} Passenger{passengerDetails.length > 1 ? 's' : ''}
          </h2>
          
          {passengerDetails.map((passenger, index) => (
            <div key={passenger.id} style={styles.passengerSection}>
              <h3 style={styles.passengerTitle}>
                {index === 0 ? 'Primary Passenger' : `Passenger ${index + 1}`}
              </h3>
              
              <div style={styles.formGrid}>
                {/* First Name */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>First Name *</label>
                  <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                    style={{
                      ...styles.input,
                      ...(errors[`${index}-firstName`] ? styles.inputError : {})
                    }}
                    placeholder="Enter first name"
                  />
                  {errors[`${index}-firstName`] && (
                    <span style={styles.errorText}>{errors[`${index}-firstName`]}</span>
                  )}
                </div>

                {/* Middle Name */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Middle Name</label>
                  <input
                    type="text"
                    value={passenger.middleName}
                    onChange={(e) => handleInputChange(index, 'middleName', e.target.value)}
                    style={styles.input}
                    placeholder="Enter middle name (optional)"
                  />
                </div>

                {/* Last Name */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Last Name *</label>
                  <input
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                    style={{
                      ...styles.input,
                      ...(errors[`${index}-lastName`] ? styles.inputError : {})
                    }}
                    placeholder="Enter last name"
                  />
                  {errors[`${index}-lastName`] && (
                    <span style={styles.errorText}>{errors[`${index}-lastName`]}</span>
                  )}
                </div>

                {/* Gender */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Gender *</label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                    style={{
                      ...styles.select,
                      ...(errors[`${index}-gender`] ? styles.inputError : {})
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors[`${index}-gender`] && (
                    <span style={styles.errorText}>{errors[`${index}-gender`]}</span>
                  )}
                </div>

                {/* Age */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Age *</label>
                  <input
                    type="number"
                    value={passenger.age}
                    onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                    style={{
                      ...styles.input,
                      ...(errors[`${index}-age`] ? styles.inputError : {})
                    }}
                    placeholder="Enter age"
                    min="0"
                    max="100"
                  />
                  {errors[`${index}-age`] && (
                    <span style={styles.errorText}>{errors[`${index}-age`]}</span>
                  )}
                </div>

                {/* Email (Primary passenger only) */}
                {index === 0 && (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email ID *</label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors[`${index}-email`] ? styles.inputError : {})
                      }}
                      placeholder="Enter email address"
                    />
                    {errors[`${index}-email`] && (
                      <span style={styles.errorText}>{errors[`${index}-email`]}</span>
                    )}
                  </div>
                )}

                {/* Phone (Primary passenger only) */}
                {index === 0 && (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors[`${index}-phone`] ? styles.inputError : {})
                      }}
                      placeholder="Enter phone number"
                    />
                    {errors[`${index}-phone`] && (
                      <span style={styles.errorText}>{errors[`${index}-phone`]}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Special Assistance Section */}
          <div style={styles.specialAssistanceSection}>
            <div style={styles.specialAssistanceHeader}>
              <div style={styles.headerContent}>
                <span style={styles.headerIcon}>🐾</span>
                <div style={styles.headerText}>
                  <h3 style={styles.headerTitle}>Special Assistance (Per Passenger)</h3>
                  <p style={styles.headerSubtitle}>
                    These requests apply after passenger details are completed and will be reviewed post-booking.
                  </p>
                  <p style={styles.learnMoreText}>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      style={styles.policyButton}
                      type="button"
                    >
                      Request Special Assistance <span style={styles.infoIcon}>ℹ️</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div style={styles.buttonContainer}>
            <button
              onClick={() => router.push('/flights')}
              style={styles.backButton}
            >
              ← Back to Flights
            </button>
            <div style={styles.buttonGroup}>
              <button
                onClick={handleContinueToSeatSelection}
                style={styles.continueButton}
              >
                Continue to Seat Selection →
              </button>
              <button
                onClick={handleSkipToPayment}
                style={styles.skipButton}
              >
                Skip to Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Special Assistance Policy Modal */}
      {isModalOpen && (
        <div 
          style={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Special Assistance Request & Policy</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={styles.modalCloseButton}
                type="button"
              >
                ❌
              </button>
            </div>
            
            <div style={styles.modalBody}>
              {/* A. Request Special Assistance (FIRST SECTION) */}
              <div style={styles.assistanceSelectionSection}>
                <h4 style={styles.selectionTitle}>Request Special Assistance</h4>
                <p style={styles.selectionSubtitle}>
                  Select the assistance you need for each passenger
                </p>
                
                {passengerDetails.map((passenger, passengerIndex) => (
                  <div key={passengerIndex} style={styles.passengerAssistanceCard}>
                    <div style={styles.passengerAssistanceHeader}>
                      <span style={styles.passengerIcon}>👤</span>
                      <span style={styles.passengerAssistanceName}>
                        Passenger {passengerIndex + 1}
                        {passenger.firstName && passenger.lastName && 
                          ` (${passenger.firstName} ${passenger.lastName})`
                        } – Assistance Options
                      </span>
                    </div>
                    
                    <div style={styles.assistanceOptionsGrid}>
                      {[
                        { id: 'serviceAnimal', label: 'Service Animal', icon: '🦮' },
                        { id: 'visuallyImpaired', label: 'Visually Impaired Assistance', icon: '👁️' },
                        { id: 'hearingImpaired', label: 'Hearing Impaired Assistance', icon: '👂' },
                        { id: 'mobilityAssistance', label: 'Mobility Assistance (Wheelchair)', icon: '♿' },
                        { id: 'medicalEquipment', label: 'Medical Equipment Assistance', icon: '🏥' },
                        { id: 'elderlyAssistance', label: 'Elderly Passenger Assistance', icon: '👴' }
                      ].map((option) => (
                        <label key={option.id} style={styles.assistanceOption}>
                          <input
                            type="checkbox"
                            checked={specialAssistanceSelections[passengerIndex]?.[option.id] || false}
                            onChange={(e) => handleSpecialAssistanceChange(passengerIndex, option.id, e.target.checked)}
                            style={styles.assistanceCheckbox}
                          />
                          <div style={styles.assistanceOptionContent}>
                            <span style={styles.assistanceIcon}>{option.icon}</span>
                            <span style={styles.assistanceLabel}>{option.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* B. Section Divider */}
              <div style={styles.modalDivider}></div>

              {/* C. Service Animal Policy (SECOND SECTION) */}
              <div style={styles.serviceAnimalInfo}>
                <h4 style={styles.infoTitle}>Service Animal Policy</h4>
                
                <div style={styles.infoGrid}>
                  <div style={styles.infoCard}>
                    <div style={styles.infoCardHeader}>
                      <span style={styles.cardIcon}>🦮</span>
                      <span style={styles.cardTitle}>Allowed Animals</span>
                    </div>
                    <p style={styles.cardText}>
                      Only trained service dogs are allowed. No pets or emotional support animals are permitted.
                    </p>
                  </div>

                  <div style={styles.infoCard}>
                    <div style={styles.infoCardHeader}>
                      <span style={styles.cardIcon}>📋</span>
                      <span style={styles.cardTitle}>Required Documentation</span>
                    </div>
                    <ul style={styles.documentList}>
                      <li>Medical certificate</li>
                      <li>Vaccination proof</li>
                      <li>Training certificate</li>
                    </ul>
                  </div>

                  <div style={styles.infoCard}>
                    <div style={styles.infoCardHeader}>
                      <span style={styles.cardIcon}>✈️</span>
                      <span style={styles.cardTitle}>Travel Requirements</span>
                    </div>
                    <ul style={styles.requirementsList}>
                      <li>One service animal per passenger</li>
                      <li>Dogs must remain harnessed and under control</li>
                      <li>Notification required prior to travel</li>
                    </ul>
                  </div>

                  <div style={styles.infoCard}>
                    <div style={styles.infoCardHeader}>
                      <span style={styles.cardIcon}>💺</span>
                      <span style={styles.cardTitle}>Seating & Safety</span>
                    </div>
                    <p style={styles.cardText}>
                      Seating will be arranged to safely accommodate the animal. Compliance with aviation safety regulations is mandatory.
                    </p>
                  </div>
                </div>

                <div style={styles.importantNotice}>
                  <div style={styles.noticeHeader}>
                    <span style={styles.noticeIcon}>⚠️</span>
                    <span style={styles.noticeTitle}>Important Notice</span>
                  </div>
                  <div style={styles.noticeContent}>
                    <p style={styles.noticeText}>
                      • The airline will contact you post-booking for approval and verification
                    </p>
                    <p style={styles.noticeText}>
                      • No additional charge for service animals
                    </p>
                    <p style={styles.noticeText}>
                      • All documentation must be provided before travel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
} // End of PassengerDetailsPage component

// Styles object
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
    maxWidth: '1200px',
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
  
  flightSummary: {
    marginBottom: '30px'
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '300',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center'
  },
  
  summaryCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  summaryTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '15px'
  },
  
  routeInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  
  route: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#007bff'
  },
  
  date: {
    fontSize: '1rem',
    color: '#6c757d'
  },
  
  flightInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#495057'
  },
  
  price: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#28a745'
  },
  
  formContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '25px',
    textAlign: 'center'
  },
  
  passengerSection: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    background: '#f8f9fa'
  },
  
  passengerTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '20px'
  },
  
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '8px'
  },
  
  input: {
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    outline: 'none'
  },
  
  select: {
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  
  inputError: {
    borderColor: '#dc3545'
  },
  
  errorText: {
    fontSize: '0.8rem',
    color: '#dc3545',
    marginTop: '4px'
  },
  
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '30px',
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
  
  continueButton: {
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
  
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    flex: 1,
  },
  
  skipButton: {
    background: 'white',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  // Visual Divider Style
  sectionDivider: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
    margin: '40px 0 30px 0',
    position: 'relative',
  },

  // Special Assistance Section Styles
  specialAssistanceSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    marginBottom: '25px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(0, 123, 255, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },

  specialAssistanceHeader: {
    padding: '20px 25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '16px',
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },

  headerIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 8px 0',
  },

  headerSubtitle: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: '0 0 5px 0',
    lineHeight: '1.4',
    fontWeight: '500',
  },

  learnMoreText: {
    margin: 0,
  },

  policyButton: {
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    border: 'none',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    padding: '12px 20px',
    borderRadius: '8px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
  },

  infoIcon: {
    fontSize: '0.9rem',
    marginLeft: '4px',
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '2px solid #f1f5f9',
    backgroundColor: '#f8fafc',
  },

  modalTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  },

  modalCloseButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
  },

  modalBody: {
    padding: '25px',
    overflow: 'auto',
    flex: 1,
  },

  // Modal Divider
  modalDivider: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
    margin: '30px 0',
    position: 'relative',
  },

  // Special Assistance Selection Styles (for modal)
  assistanceSelectionSection: {
    marginBottom: '0',
  },

  selectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px',
    textAlign: 'center',
  },

  selectionSubtitle: {
    fontSize: '0.95rem',
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: '25px',
  },

  passengerAssistanceCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 123, 255, 0.1)',
    transition: 'all 0.3s ease',
  },

  passengerAssistanceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '18px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f8f9fa',
  },

  passengerIcon: {
    fontSize: '1.1rem',
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
  },

  passengerAssistanceName: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#2c3e50',
    lineHeight: '1.3',
  },

  assistanceOptionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px',
  },

  assistanceOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white',
  },

  assistanceCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#007bff',
  },

  assistanceOptionContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },

  assistanceOptionIcon: {
    fontSize: '1.2rem',
  },

  assistanceOptionLabel: {
    fontSize: '0.9rem',
    color: '#495057',
    fontWeight: '500',
  },

  // Modal Content Styles
  serviceAnimalInfo: {
    padding: '0',
  },

  infoTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },

  infoCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },

  infoCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },

  cardIcon: {
    fontSize: '1.5rem',
  },

  cardTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2c3e50',
  },

  cardText: {
    fontSize: '0.9rem',
    color: '#495057',
    lineHeight: '1.5',
    margin: 0,
  },

  documentList: {
    fontSize: '0.9rem',
    color: '#495057',
    lineHeight: '1.6',
    margin: 0,
    paddingLeft: '20px',
  },

  requirementsList: {
    fontSize: '0.9rem',
    color: '#495057',
    lineHeight: '1.6',
    margin: 0,
    paddingLeft: '20px',
  },

  importantNotice: {
    background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))',
    border: '1px solid rgba(255, 193, 7, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '25px',
  },

  noticeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },

  noticeIcon: {
    fontSize: '1.3rem',
  },

  noticeTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#856404',
  },

  noticeContent: {
    paddingLeft: '35px',
  },

  noticeText: {
    fontSize: '0.9rem',
    color: '#856404',
    margin: '0 0 8px 0',
    lineHeight: '1.5',
  },
};