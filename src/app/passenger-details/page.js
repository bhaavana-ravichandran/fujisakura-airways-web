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

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }
    
    // Store passenger details in localStorage
    localStorage.setItem('passengerDetails', JSON.stringify(passengerDetails));
    
    // Navigate to payment page (placeholder)
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

          {/* Continue Button */}
          <div style={styles.buttonContainer}>
            <button
              onClick={() => router.push('/flights')}
              style={styles.backButton}
            >
              ← Back to Flights
            </button>
            <button
              onClick={handleContinue}
              style={styles.continueButton}
            >
              Continue to Payment →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
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
  }
};