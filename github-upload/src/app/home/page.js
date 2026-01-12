'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    leavingFrom: '',
    goingTo: '',
    departureDate: '',
    returnDate: '',
    tripType: 'round-trip',
    travellers: '1',
    cabinClass: 'economy'
  });

  // Fare type state
  const [fareType, setFareType] = useState('Regular');

  // Multi-city segments state
  const [multiCitySegments, setMultiCitySegments] = useState([
    { leavingFrom: '', goingTo: '', departureDate: '' },
    { leavingFrom: '', goingTo: '', departureDate: '' }
  ]);

  // Mock cities data
  const cities = [
    { code: 'NYC', name: 'New York City', country: 'USA' },
    { code: 'LON', name: 'London', country: 'UK' },
    { code: 'PAR', name: 'Paris', country: 'France' },
    { code: 'TOK', name: 'Tokyo', country: 'Japan' },
    { code: 'SIN', name: 'Singapore', country: 'Singapore' },
    { code: 'DUB', name: 'Dubai', country: 'UAE' },
    { code: 'SYD', name: 'Sydney', country: 'Australia' },
    { code: 'BOM', name: 'Mumbai', country: 'India' },
    { code: 'DEL', name: 'New Delhi', country: 'India' },
    { code: 'BLR', name: 'Bangalore', country: 'India' },
    { code: 'MAD', name: 'Madrid', country: 'Spain' },
    { code: 'ROM', name: 'Rome', country: 'Italy' },
    { code: 'BER', name: 'Berlin', country: 'Germany' },
    { code: 'AMS', name: 'Amsterdam', country: 'Netherlands' },
    { code: 'ZUR', name: 'Zurich', country: 'Switzerland' },
    { code: 'VIE', name: 'Vienna', country: 'Austria' },
    { code: 'STO', name: 'Stockholm', country: 'Sweden' },
    { code: 'HEL', name: 'Helsinki', country: 'Finland' },
    { code: 'OSL', name: 'Oslo', country: 'Norway' },
    { code: 'CPH', name: 'Copenhagen', country: 'Denmark' }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mock flight data
  const mockFlightData = {
    'new-york-city-london': { price: '$650', duration: '7h 30m' },
    'london-paris': { price: '$180', duration: '1h 20m' },
    'tokyo-singapore': { price: '$420', duration: '7h 15m' },
    'mumbai-dubai': { price: '$280', duration: '3h 45m' },
    'sydney-melbourne': { price: '$150', duration: '1h 35m' },
    'new-delhi-mumbai': { price: '$120', duration: '2h 15m' },
    'paris-rome': { price: '$220', duration: '2h 30m' },
    'berlin-amsterdam': { price: '$160', duration: '1h 45m' },
    'zurich-vienna': { price: '$190', duration: '1h 20m' },
    'stockholm-helsinki': { price: '$140', duration: '1h 10m' },
    'oslo-copenhagen': { price: '$130', duration: '1h 25m' },
    'madrid-barcelona': { price: '$90', duration: '1h 15m' },
    'london-new-york-city': { price: '$680', duration: '8h 15m' },
    'singapore-tokyo': { price: '$450', duration: '7h 45m' },
    'dubai-mumbai': { price: '$300', duration: '3h 20m' },
    'default': { price: '$350', duration: '4h 20m' }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiCityChange = (index, field, value) => {
    setMultiCitySegments(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMultiCitySegment = () => {
    setMultiCitySegments(prev => [
      ...prev,
      { leavingFrom: '', goingTo: '', departureDate: '' }
    ]);
  };

  const removeMultiCitySegment = (index) => {
    if (multiCitySegments.length > 2) {
      setMultiCitySegments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Calculate discounted price for preview
    const calculatePreviewPrice = (basePrice, fareType) => {
      const discounts = {
        'Regular': 0,
        'Student': 0.10,
        'Senior Citizen': 0.15,
        'Armed Forces': 0.20
      };
      const discount = discounts[fareType] || 0;
      const finalPrice = basePrice * (1 - discount);
      return Math.round(finalPrice);
    };

    let flightInfo;
    
    if (formData.tripType === 'multi-city') {
      // For multi-city, use the first segment for mock data
      const firstSegment = multiCitySegments[0];
      const route = `${firstSegment.leavingFrom}-${firstSegment.goingTo}`;
      flightInfo = mockFlightData[route] || mockFlightData['default'];
      
      // Calculate discounted price
      const basePrice = parseInt(flightInfo.price.replace('$', ''));
      const discountedPrice = calculatePreviewPrice(basePrice, fareType);
      
      // Show multi-city specific message
      setSearchResult({
        ...flightInfo,
        price: `$${discountedPrice}`,
        originalPrice: fareType !== 'Regular' ? flightInfo.price : null,
        fareType: fareType,
        isMultiCity: true,
        segments: multiCitySegments.length
      });
    } else {
      // Generate mock flight result for single/round trip
      const route = `${formData.leavingFrom}-${formData.goingTo}`;
      flightInfo = mockFlightData[route] || mockFlightData['default'];
      
      // Calculate discounted price
      const basePrice = parseInt(flightInfo.price.replace('$', ''));
      const discountedPrice = calculatePreviewPrice(basePrice, fareType);
      
      setSearchResult({
        ...flightInfo,
        price: `$${discountedPrice}`,
        originalPrice: fareType !== 'Regular' ? flightInfo.price : null,
        fareType: fareType
      });
    }
    
    // Navigate to flights page with query parameters after 1 second
    setTimeout(() => {
      const searchParams = new URLSearchParams();
      
      if (formData.tripType === 'multi-city') {
        // For multi-city, use first segment
        const firstSegment = multiCitySegments[0];
        searchParams.set('from', firstSegment.leavingFrom);
        searchParams.set('to', firstSegment.goingTo);
        searchParams.set('departureDate', firstSegment.departureDate);
      } else {
        searchParams.set('from', formData.leavingFrom);
        searchParams.set('to', formData.goingTo);
        searchParams.set('departureDate', formData.departureDate);
        if (formData.tripType === 'round-trip') {
          searchParams.set('returnDate', formData.returnDate);
        }
      }
      
      searchParams.set('fareType', fareType);
      searchParams.set('cabin', formData.cabinClass);
      searchParams.set('tripType', formData.tripType);
      searchParams.set('travellers', formData.travellers);
      
      router.push(`/flights?${searchParams.toString()}`);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      {/* Animated Planes Background */}
      <div style={styles.planesContainer}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.plane,
              top: `${10 + (i * 12)}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${12 + (i * 2)}s`,
              opacity: 0.3 + (i * 0.05)
            }}
          >
            ✈️
          </div>
        ))}
      </div>

      {/* Main Content */}
      <Card 
        className="w-[400px] relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '2px solid white',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out'
        }}
      >
        <CardHeader style={{ textAlign: 'center', paddingBottom: '10px', padding: '30px 30px 10px 30px' }}>
          <CardTitle 
            style={{
              fontSize: '1.8rem',
              fontWeight: '300',
              color: '#2c3e50',
              marginBottom: '10px',
              letterSpacing: '0.5px'
            }}
          >
            Fujisakura Airways
          </CardTitle>
          <CardDescription 
            style={{
              fontSize: '0.9rem',
              color: '#7f8c8d',
              fontWeight: '300',
              marginBottom: '30px'
            }}
          >
            Search your flights below
          </CardDescription>
        </CardHeader>
        
        <CardContent style={{ paddingTop: '0', padding: '0 30px 30px 30px' }}>
          <form onSubmit={handleSearch} style={styles.form}>
          {/* Trip Type Toggle */}
          <div style={styles.tripTypeContainer}>
            {['one-way', 'round-trip', 'multi-city'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleInputChange('tripType', type)}
                style={{
                  ...styles.tripTypeButton,
                  ...(formData.tripType === type ? styles.tripTypeButtonActive : {})
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Fare Type Selection */}
          <div style={styles.fareTypeContainer}>
            <label style={styles.fareTypeLabel}>Fare Type</label>
            <div style={styles.fareTypeButtons}>
              {['Regular', 'Student', 'Armed Forces', 'Senior Citizen'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFareType(type)}
                  style={{
                    ...styles.fareTypeButton,
                    ...(fareType === type ? styles.fareTypeButtonActive : {})
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Location Inputs - Conditional based on trip type */}
          {formData.tripType === 'multi-city' ? (
            // Multi-city segments
            <div style={styles.multiCityContainer}>
              <h3 style={styles.multiCityTitle}>Flight Segments</h3>
              {multiCitySegments.map((segment, index) => (
                <div key={index} style={styles.segmentContainer}>
                  <div style={styles.segmentHeader}>
                    <span style={styles.segmentNumber}>Flight {index + 1}</span>
                    {multiCitySegments.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeMultiCitySegment(index)}
                        style={styles.removeButton}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Leaving From</label>
                      <select
                        value={segment.leavingFrom}
                        onChange={(e) => handleMultiCityChange(index, 'leavingFrom', e.target.value)}
                        style={styles.select}
                        required
                      >
                        <option value="">Select departure city</option>
                        {cities.map((city) => (
                          <option key={city.code} value={city.name.toLowerCase().replace(/\s+/g, '-')}>
                            {city.name} ({city.code}) - {city.country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Going To</label>
                      <select
                        value={segment.goingTo}
                        onChange={(e) => handleMultiCityChange(index, 'goingTo', e.target.value)}
                        style={styles.select}
                        required
                      >
                        <option value="">Select destination city</option>
                        {cities.map((city) => (
                          <option key={city.code} value={city.name.toLowerCase().replace(/\s+/g, '-')}>
                            {city.name} ({city.code}) - {city.country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Departure Date</label>
                      <input
                        type="date"
                        value={segment.departureDate}
                        onChange={(e) => handleMultiCityChange(index, 'departureDate', e.target.value)}
                        style={styles.input}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addMultiCitySegment}
                style={styles.addSegmentButton}
              >
                + Add Another Flight
              </button>
            </div>
          ) : (
            // Single/Round trip inputs
            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Leaving From</label>
                <select
                  value={formData.leavingFrom}
                  onChange={(e) => handleInputChange('leavingFrom', e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">Select departure city</option>
                  {cities.map((city) => (
                    <option key={city.code} value={city.name.toLowerCase().replace(/\s+/g, '-')}>
                      {city.name} ({city.code}) - {city.country}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Going To</label>
                <select
                  value={formData.goingTo}
                  onChange={(e) => handleInputChange('goingTo', e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">Select destination city</option>
                  {cities.map((city) => (
                    <option key={city.code} value={city.name.toLowerCase().replace(/\s+/g, '-')}>
                      {city.name} ({city.code}) - {city.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Date Inputs - Only for single/round trip */}
          {formData.tripType !== 'multi-city' && (
            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Departure Date</label>
                <input
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              {formData.tripType === 'round-trip' && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Return Date</label>
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* Travellers and Cabin Class */}
          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Travellers</label>
              <select
                value={formData.travellers}
                onChange={(e) => handleInputChange('travellers', e.target.value)}
                style={styles.select}
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Adults</option>
                <option value="4">4 Adults</option>
                <option value="2+1">2 Adults, 1 Child</option>
                <option value="2+2">2 Adults, 2 Children</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cabin Class</label>
              <select
                value={formData.cabinClass}
                onChange={(e) => handleInputChange('cabinClass', e.target.value)}
                style={styles.select}
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button type="submit" style={styles.searchButton}>
            Search Flights ✈️
          </button>
          </form>

          {/* Search Result */}
          {searchResult && (
            <div style={styles.resultContainer}>
              {searchResult.isMultiCity ? (
                <div>
                  <p style={styles.resultText}>
                    🎉 Multi-city trip found! {searchResult.segments} flights | Starting from: <strong>{searchResult.price}</strong>
                    {searchResult.originalPrice && (
                      <span style={styles.originalPrice}> (was {searchResult.originalPrice})</span>
                    )}
                  </p>
                  {searchResult.fareType !== 'Regular' && (
                    <p style={styles.discountText}>
                      ✨ {searchResult.fareType} discount applied!
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p style={styles.resultText}>
                    🎉 Flight found! Price: <strong>{searchResult.price}</strong>
                    {searchResult.originalPrice && (
                      <span style={styles.originalPrice}> (was {searchResult.originalPrice})</span>
                    )} | Duration: <strong>{searchResult.duration}</strong>
                  </p>
                  {searchResult.fareType !== 'Regular' && (
                    <p style={styles.discountText}>
                      ✨ {searchResult.fareType} discount applied!
                    </p>
                  )}
                </div>
              )}
              <p style={styles.redirectText}>Redirecting to flight details...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #E0F6FF 75%, #F0F8FF 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  planesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  },
  
  plane: {
    position: 'absolute',
    fontSize: '1.5rem',
    animation: 'flyAcross linear infinite',
    left: '-100px'
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  
  tripTypeContainer: {
    display: 'flex',
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '4px',
    gap: '4px',
    margin: '0 5px'
  },
  
  tripTypeButton: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    color: '#6c757d',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  tripTypeButtonActive: {
    background: '#007bff',
    color: 'white',
    boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)'
  },
  
  inputRow: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    margin: '0 5px'
  },
  
  inputGroup: {
    flex: 1,
    minWidth: '150px',
    marginBottom: '5px'
  },
  
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '8px',
    textAlign: 'left'
  },
  
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '0.9rem',
    transition: 'border-color 0.3s ease',
    outline: 'none'
  },
  
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '0.9rem',
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  
  searchButton: {
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
    marginTop: '15px',
    margin: '15px 5px 0 5px'
  },
  
  resultContainer: {
    marginTop: '20px',
    padding: '15px',
    background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
    borderRadius: '12px',
    border: '1px solid #c3e6cb',
    textAlign: 'center',
    margin: '20px 5px 0 5px'
  },
  
  resultText: {
    fontSize: '0.9rem',
    color: '#155724',
    margin: '0 0 10px 0',
    fontWeight: '500'
  },
  
  redirectText: {
    fontSize: '0.8rem',
    color: '#6c757d',
    margin: 0,
    fontStyle: 'italic'
  },
  
  originalPrice: {
    fontSize: '0.8rem',
    color: '#6c757d',
    textDecoration: 'line-through',
    fontWeight: 'normal'
  },
  
  discountText: {
    fontSize: '0.8rem',
    color: '#28a745',
    fontWeight: '600',
    margin: '5px 0 0 0'
  },
  
  multiCityContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  
  multiCityTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#495057',
    margin: '0 0 10px 0',
    textAlign: 'center'
  },
  
  segmentContainer: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '15px',
    border: '1px solid #e9ecef',
    margin: '0 5px'
  },
  
  segmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  
  segmentNumber: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#007bff'
  },
  
  removeButton: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  
  addSegmentButton: {
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    alignSelf: 'center',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
  },
  
  fareTypeContainer: {
    margin: '0 5px'
  },
  
  fareTypeLabel: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '12px',
    textAlign: 'left'
  },
  
  fareTypeButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  },
  
  fareTypeButton: {
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    background: 'white',
    color: '#6c757d',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  
  fareTypeButtonActive: {
    background: '#007bff',
    color: 'white',
    borderColor: '#007bff',
    boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)'
  }
};

// Add global styles for plane animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes flyAcross {
      0% { transform: translateX(-100px); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { transform: translateX(calc(100vw + 100px)); opacity: 0; }
    }
    
    input:focus, select:focus {
      border-color: #007bff !important;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1) !important;
    }
    
    button:hover {
      transform: translateY(-2px) !important;
    }
    
    @media (max-width: 768px) {
      .input-row {
        flex-direction: column;
      }
    }
  `;
  
  if (!document.head.querySelector('style[data-home-animations]')) {
    styleSheet.setAttribute('data-home-animations', 'true');
    document.head.appendChild(styleSheet);
  }
}