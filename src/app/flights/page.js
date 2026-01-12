'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function FlightsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({});

  useEffect(() => {
    setIsLoaded(true);
    
    // Read query parameters
    const criteria = {
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      fareType: searchParams.get('fareType') || 'Regular',
      cabin: searchParams.get('cabin') || 'economy',
      tripType: searchParams.get('tripType') || 'round-trip',
      travellers: searchParams.get('travellers') || '1',
      departureDate: searchParams.get('departureDate') || '',
      returnDate: searchParams.get('returnDate') || ''
    };
    
    console.log('Search criteria:', criteria); // Debug log
    
    setSearchCriteria(criteria);
    
    // Filter and process flights
    const flights = getFilteredFlights(criteria);
    console.log('Filtered flights:', flights); // Debug log
    
    // If no flights found, show default flights
    if (flights.length === 0) {
      const defaultFlights = mockFlightsData.slice(0, 3).map(flight => ({
        ...flight,
        finalPrice: calculateFinalPrice(flight.basePrice, criteria.fareType),
        appliedFareType: criteria.fareType
      }));
      setFilteredFlights(defaultFlights);
    } else {
      setFilteredFlights(flights);
    }
  }, [searchParams]);

  // Enhanced mock flight data with basePrice and availableFor
  const mockFlightsData = [
    // New York City to London
    {
      id: 1,
      airline: 'Fujisakura Airways',
      flightNumber: 'FA 101',
      departure: '08:30 AM',
      arrival: '04:45 PM',
      duration: '7h 15m',
      basePrice: 650,
      stops: 'Non-stop',
      aircraft: 'Boeing 787',
      route: ['new-york-city', 'london'],
      availableFor: ['Regular', 'Student', 'Armed Forces', 'Senior Citizen']
    },
    {
      id: 2,
      airline: 'Sky Connect',
      flightNumber: 'SC 205',
      departure: '02:15 PM',
      arrival: '11:30 PM',
      duration: '8h 15m',
      basePrice: 580,
      stops: '1 Stop',
      aircraft: 'Airbus A350',
      route: ['new-york-city', 'london'],
      availableFor: ['Regular', 'Student', 'Senior Citizen']
    },
    {
      id: 3,
      airline: 'Global Wings',
      flightNumber: 'GW 789',
      departure: '11:45 PM',
      arrival: '08:20 AM+1',
      duration: '7h 35m',
      basePrice: 720,
      stops: 'Non-stop',
      aircraft: 'Boeing 777',
      route: ['new-york-city', 'london'],
      availableFor: ['Regular', 'Armed Forces']
    },
    // London to Paris
    {
      id: 4,
      airline: 'Fujisakura Airways',
      flightNumber: 'FA 203',
      departure: '10:15 AM',
      arrival: '11:35 AM',
      duration: '1h 20m',
      basePrice: 180,
      stops: 'Non-stop',
      aircraft: 'Boeing 737',
      route: ['london', 'paris'],
      availableFor: ['Regular', 'Student', 'Armed Forces', 'Senior Citizen']
    },
    // Mumbai to Dubai
    {
      id: 5,
      airline: 'Emirates Connect',
      flightNumber: 'EC 445',
      departure: '06:45 AM',
      arrival: '10:20 AM',
      duration: '3h 35m',
      basePrice: 280,
      stops: 'Non-stop',
      aircraft: 'Airbus A380',
      route: ['mumbai', 'dubai'],
      availableFor: ['Regular', 'Student', 'Senior Citizen']
    },
    {
      id: 6,
      airline: 'Fujisakura Airways',
      flightNumber: 'FA 567',
      departure: '02:30 PM',
      arrival: '06:15 PM',
      duration: '3h 45m',
      basePrice: 320,
      stops: 'Non-stop',
      aircraft: 'Boeing 787',
      route: ['mumbai', 'dubai'],
      availableFor: ['Regular', 'Student', 'Armed Forces', 'Senior Citizen']
    },
    // New Delhi to Mumbai
    {
      id: 7,
      airline: 'Air India Express',
      flightNumber: 'AI 891',
      departure: '09:30 AM',
      arrival: '11:45 AM',
      duration: '2h 15m',
      basePrice: 120,
      stops: 'Non-stop',
      aircraft: 'Boeing 737',
      route: ['new-delhi', 'mumbai'],
      availableFor: ['Regular', 'Student', 'Armed Forces', 'Senior Citizen']
    },
    {
      id: 8,
      airline: 'Fujisakura Airways',
      flightNumber: 'FA 234',
      departure: '06:15 AM',
      arrival: '08:30 AM',
      duration: '2h 15m',
      basePrice: 140,
      stops: 'Non-stop',
      aircraft: 'Airbus A320',
      route: ['new-delhi', 'mumbai'],
      availableFor: ['Regular', 'Student', 'Senior Citizen']
    },
    // Tokyo to Singapore
    {
      id: 9,
      airline: 'Fujisakura Airways',
      flightNumber: 'FA 888',
      departure: '11:00 AM',
      arrival: '06:15 PM',
      duration: '7h 15m',
      basePrice: 420,
      stops: 'Non-stop',
      aircraft: 'Boeing 787',
      route: ['tokyo', 'singapore'],
      availableFor: ['Regular', 'Student', 'Armed Forces', 'Senior Citizen']
    },
    // Sydney to Melbourne (default route)
    {
      id: 10,
      airline: 'Fujisakura Airways',
      flightNumber: 'FA 999',
      departure: '08:00 AM',
      arrival: '09:35 AM',
      duration: '1h 35m',
      basePrice: 150,
      stops: 'Non-stop',
      aircraft: 'Boeing 737',
      route: ['sydney', 'melbourne'],
      availableFor: ['Regular', 'Student', 'Armed Forces', 'Senior Citizen']
    }
  ];

  // Function to calculate fare-based pricing
  const calculateFinalPrice = (basePrice, fareType) => {
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

  // Function to filter flights based on search criteria
  const getFilteredFlights = (criteria) => {
    let flights = mockFlightsData;
    
    // Filter by route
    if (criteria.from && criteria.to) {
      flights = flights.filter(flight => 
        flight.route.includes(criteria.from) && flight.route.includes(criteria.to)
      );
      
      // If no flights found for specific route, show some default flights
      if (flights.length === 0) {
        console.log(`No flights found for route: ${criteria.from} -> ${criteria.to}`);
        // Show first 3 flights as default
        flights = mockFlightsData.slice(0, 3);
      }
    }
    
    // Filter by fare eligibility
    let fareFilteredFlights = flights.filter(flight => 
      flight.availableFor.includes(criteria.fareType)
    );
    
    // If no flights match the selected fare type, fallback to Regular fare flights
    if (fareFilteredFlights.length === 0 && criteria.fareType !== 'Regular') {
      console.log(`No flights available for fare type: ${criteria.fareType}, falling back to Regular`);
      fareFilteredFlights = flights.filter(flight => 
        flight.availableFor.includes('Regular')
      );
    }
    
    // If still no flights, show all flights
    if (fareFilteredFlights.length === 0) {
      fareFilteredFlights = flights;
    }
    
    // Calculate final prices
    return fareFilteredFlights.map(flight => ({
      ...flight,
      finalPrice: calculateFinalPrice(flight.basePrice, criteria.fareType),
      appliedFareType: criteria.fareType
    }));
  };

  const handleBackToHome = () => {
    router.push('/home');
  };

  const formatCityName = (cityCode) => {
    return cityCode.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main Content Container */}
      <div style={styles.container}>
        {/* Background Planes */}
        <div style={styles.planesContainer}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.plane,
                top: `${15 + (i * 15)}%`,
                animationDelay: `${i * 3}s`,
                animationDuration: `${15 + (i * 2)}s`,
                opacity: 0.2
              }}
            >
              ✈️
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{
          ...styles.contentContainer,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out'
        }}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Flight Results</h1>
          {searchCriteria.from && searchCriteria.to && (
            <p style={styles.subtitle}>
              {formatCityName(searchCriteria.from)} → {formatCityName(searchCriteria.to)} 
              {searchCriteria.fareType !== 'Regular' && (
                <span style={styles.fareTypeIndicator}> • {searchCriteria.fareType} Fare</span>
              )}
            </p>
          )}
          
          <button onClick={handleBackToHome} style={styles.backButton}>
            ← Back to Search
          </button>
        </div>

        {/* Flight Results */}
        <div style={styles.flightsContainer}>
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <div key={flight.id} style={styles.flightCard}>
                <div style={styles.flightHeader}>
                  <div style={styles.airlineInfo}>
                    <h3 style={styles.airlineName}>{flight.airline}</h3>
                    <p style={styles.flightNumber}>{flight.flightNumber} • {flight.aircraft}</p>
                  </div>
                  <div style={styles.priceContainer}>
                    <span style={styles.price}>${flight.finalPrice}</span>
                    {flight.appliedFareType !== 'Regular' && (
                      <span style={styles.originalPrice}>${flight.basePrice}</span>
                    )}
                    <span style={styles.perPerson}>per person</span>
                    {flight.appliedFareType !== 'Regular' && (
                      <span style={styles.discountLabel}>{flight.appliedFareType} Discount Applied</span>
                    )}
                  </div>
                </div>

                <div style={styles.flightDetails}>
                  <div style={styles.timeInfo}>
                    <div style={styles.timeBlock}>
                      <span style={styles.time}>{flight.departure}</span>
                      <span style={styles.timeLabel}>Departure</span>
                    </div>
                    
                    <div style={styles.flightPath}>
                      <div style={styles.pathLine}></div>
                      <div style={styles.pathPlane}>✈️</div>
                      <div style={styles.pathInfo}>
                        <span style={styles.duration}>{flight.duration}</span>
                        <span style={styles.stops}>{flight.stops}</span>
                      </div>
                    </div>
                    
                    <div style={styles.timeBlock}>
                      <span style={styles.time}>{flight.arrival}</span>
                      <span style={styles.timeLabel}>Arrival</span>
                    </div>
                  </div>

                  <button style={styles.selectButton}>
                    Select Flight
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noFlightsContainer}>
              <p style={styles.noFlightsText}>
                No flights found for the selected route and criteria.
              </p>
              <p style={styles.noFlightsSubtext}>
                Please try different search parameters or contact our support team.
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            💡 <strong>Tip:</strong> Prices include taxes and fees. 
            {searchCriteria.fareType !== 'Regular' && (
              <span> Special {searchCriteria.fareType} discount has been applied to eligible flights.</span>
            )}
          </p>
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
    paddingTop: '100px', // Account for fixed header
    paddingBottom: '80px', // Account for footer
    position: 'relative',
    overflow: 'hidden'
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
    fontSize: '1.2rem',
    animation: 'flyAcross linear infinite',
    left: '-100px'
  },
  
  contentContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2
  },
  
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '300',
    color: '#2c3e50',
    marginBottom: '10px',
    letterSpacing: '0.5px'
  },
  
  subtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    marginBottom: '20px',
    fontWeight: '300'
  },
  
  fareTypeIndicator: {
    color: '#007bff',
    fontWeight: '600'
  },
  
  backButton: {
    background: 'linear-gradient(135deg, #6c757d, #495057)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(108, 117, 125, 0.3)'
  },
  
  flightsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '20px'
  },
  
  flightCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  
  flightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  
  airlineInfo: {
    flex: 1
  },
  
  airlineName: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 5px 0'
  },
  
  flightNumber: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: 0
  },
  
  priceContainer: {
    textAlign: 'right'
  },
  
  price: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#007bff',
    display: 'block'
  },
  
  originalPrice: {
    fontSize: '1rem',
    color: '#6c757d',
    textDecoration: 'line-through',
    display: 'block',
    marginTop: '2px'
  },
  
  perPerson: {
    fontSize: '0.8rem',
    color: '#6c757d'
  },
  
  discountLabel: {
    fontSize: '0.7rem',
    color: '#28a745',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginTop: '2px'
  },
  
  flightDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  
  timeInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '15px'
  },
  
  timeBlock: {
    textAlign: 'center',
    flex: '0 0 auto'
  },
  
  time: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#2c3e50',
    display: 'block'
  },
  
  timeLabel: {
    fontSize: '0.8rem',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  flightPath: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: '200px',
    margin: '0 20px'
  },
  
  pathLine: {
    height: '2px',
    background: 'linear-gradient(90deg, #007bff, #0056b3)',
    flex: 1,
    borderRadius: '1px'
  },
  
  pathPlane: {
    fontSize: '1.2rem',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    padding: '2px 6px',
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  
  pathInfo: {
    position: 'absolute',
    top: '25px',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    whiteSpace: 'nowrap'
  },
  
  duration: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2c3e50',
    display: 'block'
  },
  
  stops: {
    fontSize: '0.8rem',
    color: '#6c757d'
  },
  
  selectButton: {
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
    alignSelf: 'flex-end'
  },
  
  noFlightsContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  noFlightsText: {
    fontSize: '1.2rem',
    color: '#495057',
    fontWeight: '600',
    marginBottom: '10px'
  },
  
  noFlightsSubtext: {
    fontSize: '1rem',
    color: '#6c757d',
    margin: 0
  },
  
  infoBox: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  infoText: {
    fontSize: '0.95rem',
    color: '#495057',
    margin: 0,
    lineHeight: '1.5'
  }
};

// Add global styles for plane animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes flyAcross {
      0% { transform: translateX(-100px); opacity: 0; }
      10% { opacity: 0.4; }
      90% { opacity: 0.4; }
      100% { transform: translateX(calc(100vw + 100px)); opacity: 0; }
    }
    
    @media (max-width: 768px) {
      .flight-header {
        flex-direction: column;
        text-align: center;
      }
      
      .time-info {
        flex-direction: column;
        gap: 20px;
      }
      
      .flight-path {
        order: 2;
        margin: 10px 0;
      }
    }
  `;
  
  if (!document.head.querySelector('style[data-flights-animations]')) {
    styleSheet.setAttribute('data-flights-animations', 'true');
    document.head.appendChild(styleSheet);
  }
}