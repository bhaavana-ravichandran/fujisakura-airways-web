'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice, getCurrencyFromData } from '../../utils/currency';
import '../../styles/globals.css';

export default function PreviewPage() {
  const router = useRouter();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [specialAssistanceSelection, setSpecialAssistanceSelection] = useState(null);
  const [seatSelection, setSeatSelection] = useState(null);
  const [baggageSelection, setBaggageSelection] = useState(null);
  const [mealSelection, setMealSelection] = useState(null);
  const [insuranceSelection, setInsuranceSelection] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const flightData = localStorage.getItem('selectedFlight');
    const passengerData = localStorage.getItem('passengerDetails');
    const seatData = localStorage.getItem('seatSelection');
    const baggageData = localStorage.getItem('baggageSelection');
    const mealData = localStorage.getItem('mealSelection');
    const insuranceData = localStorage.getItem('insuranceSelection');
    
    if (!flightData || !passengerData) {
      router.push('/home');
      return;
    }

    try {
      setSelectedFlight(JSON.parse(flightData));
      
      // Handle both old and new data structures for passenger details
      const passengerDataObj = JSON.parse(passengerData);
      const passengers = passengerDataObj.passengers || passengerDataObj;
      const specialAssistance = passengerDataObj.specialAssistance || null;
      
      setPassengerDetails(passengers);
      setSpecialAssistanceSelection(specialAssistance);
      
      // Load other selections if available
      if (seatData) setSeatSelection(JSON.parse(seatData));
      if (baggageData) setBaggageSelection(JSON.parse(baggageData));
      if (mealData) setMealSelection(JSON.parse(mealData));
      if (insuranceData) setInsuranceSelection(JSON.parse(insuranceData));
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error parsing data:', error);
      router.push('/home');
    }
  }, [router]);

  // Helper function to get readable assistance labels
  const getAssistanceLabel = (assistanceId) => {
    const labels = {
      serviceAnimal: 'Service Animal',
      visuallyImpaired: 'Visually Impaired Assistance',
      hearingImpaired: 'Hearing Impaired Assistance',
      mobilityAssistance: 'Mobility Assistance (Wheelchair)',
      medicalEquipment: 'Medical Equipment Assistance',
      elderlyAssistance: 'Elderly Passenger Assistance'
    };
    return labels[assistanceId] || assistanceId;
  };

  // Helper function to get formatted fare type name
  const getFormattedFareType = (seatSelection) => {
    const fareType = seatSelection?.fareType || 
                    seatSelection?.selectedFareType || 
                    seatSelection?.businessFareType || 
                    seatSelection?.firstClassFareType || 
                    seatSelection?.premiumEconomyFareType || 
                    'Standard';
    
    // Format fare type for display
    const cabinClass = seatSelection?.cabinClass || '';
    
    if (cabinClass === 'Economy') {
      const fareTypeMap = {
        'saver': 'Economy Saver',
        'base': 'Economy Base', 
        'green': 'Economy Green'
      };
      return fareTypeMap[fareType] || `Economy ${fareType}`;
    } else if (cabinClass === 'Premium Economy') {
      const fareTypeMap = {
        'lite': 'Premium Economy Lite',
        'standard': 'Premium Economy Standard',
        'flex': 'Premium Economy Flex'
      };
      return fareTypeMap[fareType] || `Premium Economy ${fareType}`;
    } else if (cabinClass === 'Business') {
      const fareTypeMap = {
        'flex': 'Business Flex',
        'premium': 'Business Premium',
        'suite': 'Business Suite'
      };
      return fareTypeMap[fareType] || `Business ${fareType}`;
    } else if (cabinClass === 'First') {
      const fareTypeMap = {
        'standard': 'First Class Standard',
        'flex': 'First Class Flex',
        'suite': 'First Class Suite'
      };
      return fareTypeMap[fareType] || `First Class ${fareType}`;
    }
    
    return fareType;
  };

  const formatCityName = (cityCode) => {
    if (!cityCode) return '';
    return cityCode.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getFormattedPrice = (amount) => {
    return formatPrice(amount, { symbol: '₹', position: 'before' });
  };

  const calculateTotalPrice = () => {
    let total = selectedFlight?.pricing?.total?.amount || selectedFlight?.finalPrice || 0;
    
    // Add seat charges
    if (seatSelection?.seatSummary) {
      seatSelection.seatSummary.forEach(seat => {
        total += seat.price || 0;
      });
    }
    
    // Add baggage charges
    if (baggageSelection?.baggageSummary?.extraBaggage) {
      baggageSelection.baggageSummary.extraBaggage.forEach(item => {
        total += item.price || 0;
      });
    }
    
    // Add meal charges
    if (mealSelection?.mealSummary) {
      Object.values(mealSelection.mealSummary).forEach(meal => {
        total += meal.price || 0;
      });
    }
    
    // Add insurance
    if (insuranceSelection?.selected && insuranceSelection?.price) {
      total += insuranceSelection.price;
    }
    
    return total;
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
        <div style={styles.contentCard}>
          {/* Page Header */}
          <div style={styles.pageHeader}>
            <h1 style={styles.title}>Review Your Booking</h1>
            <p style={styles.subtitle}>Please review all details before proceeding to payment</p>
          </div>

          {/* A. Flight Summary */}
          <Card style={styles.sectionCard}>
            <CardHeader style={styles.cardHeader}>
              <div style={styles.sectionHeaderWithEdit}>
                <CardTitle style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>✈️</span>
                  Flight Details
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              <div style={styles.flightSummaryGrid}>
                <div style={styles.flightDetail}>
                  <span style={styles.detailLabel}>Route</span>
                  <span style={styles.detailValue}>
                    {formatCityName(selectedFlight.searchCriteria?.from)} → {formatCityName(selectedFlight.searchCriteria?.to)}
                  </span>
                </div>
                <div style={styles.flightDetail}>
                  <span style={styles.detailLabel}>Travel Date</span>
                  <span style={styles.detailValue}>
                    {selectedFlight.searchCriteria?.departureDate || 'Not specified'}
                  </span>
                </div>
                <div style={styles.flightDetail}>
                  <span style={styles.detailLabel}>Flight</span>
                  <span style={styles.detailValue}>
                    {selectedFlight.airline} - {selectedFlight.flightNumber}
                  </span>
                </div>
                <div style={styles.flightDetail}>
                  <span style={styles.detailLabel}>Departure</span>
                  <span style={styles.detailValue}>
                    {selectedFlight.departureTime || '10:30 AM'}
                  </span>
                </div>
                <div style={styles.flightDetail}>
                  <span style={styles.detailLabel}>Arrival</span>
                  <span style={styles.detailValue}>
                    {selectedFlight.arrivalTime || '1:00 PM'}
                  </span>
                </div>
                <div style={styles.flightDetail}>
                  <span style={styles.detailLabel}>Duration</span>
                  <span style={styles.detailValue}>
                    {selectedFlight.duration || '2h 30m'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* B. Passenger Details */}
          <Card style={styles.sectionCard}>
            <CardHeader style={styles.cardHeader}>
              <div style={styles.sectionHeaderWithEdit}>
                <CardTitle style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>👥</span>
                  Passenger Details ({passengerDetails.length} Passenger{passengerDetails.length > 1 ? 's' : ''})
                </CardTitle>
                <Button 
                  onClick={() => router.push('/passenger-details')}
                  style={styles.editButton}
                >
                  Edit Passengers
                </Button>
              </div>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              {passengerDetails.map((passenger, index) => (
                <div key={index} style={styles.passengerCard}>
                  <div style={styles.passengerHeader}>
                    <span style={styles.passengerIcon}>
                      {passenger.title === 'Mr' ? '👨' : passenger.title === 'Ms' || passenger.title === 'Mrs' ? '👩' : '🧒'}
                    </span>
                    <span style={styles.passengerName}>
                      Passenger {index + 1}: {passenger.title} {passenger.firstName} {passenger.lastName}
                    </span>
                  </div>
                  <div style={styles.passengerDetails}>
                    <span style={styles.passengerInfo}>Age: {passenger.age}</span>
                    <span style={styles.passengerInfo}>Gender: {passenger.gender}</span>
                    {index === 0 && passenger.email && (
                      <span style={styles.passengerInfo}>Email: {passenger.email}</span>
                    )}
                    {index === 0 && passenger.phone && (
                      <span style={styles.passengerInfo}>Phone: {passenger.phone}</span>
                    )}
                  </div>
                  
                  {/* Special Assistance */}
                  <div style={styles.assistanceSection}>
                    <span style={styles.assistanceLabel}>Special Assistance:</span>
                    {specialAssistanceSelection && specialAssistanceSelection[index] ? (
                      <div style={styles.assistanceList}>
                        {Object.entries(specialAssistanceSelection[index])
                          .filter(([_, isSelected]) => isSelected)
                          .map(([assistanceId, _]) => (
                            <span key={assistanceId} style={styles.assistanceTag}>
                              {getAssistanceLabel(assistanceId)}
                            </span>
                          ))}
                        {Object.entries(specialAssistanceSelection[index])
                          .filter(([_, isSelected]) => isSelected).length === 0 && (
                          <span style={styles.noAssistance}>No special assistance requested</span>
                        )}
                      </div>
                    ) : (
                      <span style={styles.noAssistance}>No special assistance requested</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* C. Seat Selection Summary */}
          {seatSelection && (
            <Card style={styles.sectionCard}>
              <CardHeader style={styles.cardHeader}>
                <div style={styles.sectionHeaderWithEdit}>
                  <CardTitle style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>💺</span>
                    Seat Selection
                  </CardTitle>
                  <Button 
                    onClick={() => router.push('/seat-selection')}
                    style={styles.editButton}
                  >
                    Edit Seats
                  </Button>
                </div>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                <div style={styles.selectionSummary}>
                  <div style={styles.summaryDetail}>
                    <span style={styles.detailLabel}>Cabin Class:</span>
                    <span style={styles.detailValue}>{seatSelection.cabinClass}</span>
                  </div>
                  {(seatSelection?.fareType || seatSelection?.selectedFareType || seatSelection?.businessFareType || seatSelection?.firstClassFareType || seatSelection?.premiumEconomyFareType) && (
                    <div style={styles.summaryDetail}>
                      <span style={styles.detailLabel}>Fare Type:</span>
                      <span style={styles.detailValue}>
                        {seatSelection?.fareType || 
                         seatSelection?.selectedFareType || 
                         seatSelection?.businessFareType || 
                         seatSelection?.firstClassFareType || 
                         seatSelection?.premiumEconomyFareType || 
                         'Standard'}
                      </span>
                    </div>
                  )}
                </div>
                
                {seatSelection.seatSummary && seatSelection.seatSummary.length > 0 && (
                  <div style={styles.itemsList}>
                    {seatSelection.seatSummary.map((seatInfo, index) => (
                      <div key={index} style={styles.itemRow}>
                        <span style={styles.itemPassenger}>{seatInfo.passenger}</span>
                        <span style={styles.itemDetail}>Seat {seatInfo.seat}</span>
                        <span style={styles.itemPrice}>
                          {seatInfo.price > 0 ? `+${getFormattedPrice(seatInfo.price)}` : 'Free'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* D. Baggage Summary */}
          {baggageSelection && (
            <Card style={styles.sectionCard}>
              <CardHeader style={styles.cardHeader}>
                <div style={styles.sectionHeaderWithEdit}>
                  <CardTitle style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>🧳</span>
                    Baggage Selection
                  </CardTitle>
                  <Button 
                    onClick={() => router.push('/baggage-selection')}
                    style={styles.editButton}
                  >
                    Edit Baggage
                  </Button>
                </div>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                <div style={styles.selectionSummary}>
                  <div style={styles.summaryDetail}>
                    <span style={styles.detailLabel}>Included Baggage:</span>
                    <span style={styles.detailValue}>
                      {baggageSelection.includedBaggage?.cabin} cabin + {baggageSelection.includedBaggage?.checkin} check-in
                    </span>
                  </div>
                </div>
                
                {baggageSelection.baggageSummary?.extraBaggage && 
                 baggageSelection.baggageSummary.extraBaggage.some(item => item.price > 0) && (
                  <div style={styles.itemsList}>
                    <h4 style={styles.subsectionTitle}>Extra Baggage:</h4>
                    {baggageSelection.baggageSummary.extraBaggage
                      .filter(item => item.price > 0)
                      .map((item, index) => (
                        <div key={index} style={styles.itemRow}>
                          <span style={styles.itemPassenger}>{item.passenger}</span>
                          <span style={styles.itemDetail}>{item.option}</span>
                          <span style={styles.itemPrice}>{getFormattedPrice(item.price)}</span>
                        </div>
                      ))}
                  </div>
                )}
                
                {baggageSelection.baggageSummary?.specialBaggage && 
                 baggageSelection.baggageSummary.specialBaggage.some(passenger => passenger.items.length > 0) && (
                  <div style={styles.itemsList}>
                    <h4 style={styles.subsectionTitle}>Special Baggage:</h4>
                    {baggageSelection.baggageSummary.specialBaggage
                      .filter(passenger => passenger.items.length > 0)
                      .map((passenger, index) => (
                        <div key={index}>
                          {passenger.items.map((item, itemIndex) => (
                            <div key={itemIndex} style={styles.itemRow}>
                              <span style={styles.itemPassenger}>{passenger.passenger}</span>
                              <span style={styles.itemDetail}>{item.name}</span>
                              <span style={styles.itemPrice}>
                                {item.price > 0 ? getFormattedPrice(item.price) : 'Free'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* E. Meal Selection Summary */}
          {mealSelection && !mealSelection.skipped && (
            <Card style={styles.sectionCard}>
              <CardHeader style={styles.cardHeader}>
                <div style={styles.sectionHeaderWithEdit}>
                  <CardTitle style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>🍽️</span>
                    Meal Selection
                  </CardTitle>
                  <Button 
                    onClick={() => router.push('/meal-selection')}
                    style={styles.editButton}
                  >
                    Edit Meals
                  </Button>
                </div>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                <div style={styles.selectionSummary}>
                  <div style={styles.summaryDetail}>
                    <span style={styles.detailLabel}>Cabin Class:</span>
                    <span style={styles.detailValue}>
                      {mealSelection.mealConfig?.cabinClass} - {mealSelection.mealConfig?.fareType?.charAt(0).toUpperCase() + mealSelection.mealConfig?.fareType?.slice(1)}
                    </span>
                  </div>
                </div>
                
                {mealSelection.mealSummary && (
                  <div style={styles.itemsList}>
                    {Object.entries(mealSelection.mealSummary).map(([passengerKey, meal]) => (
                      <div key={passengerKey} style={styles.itemRow}>
                        <span style={styles.itemPassenger}>{passengerKey}</span>
                        <span style={styles.itemDetail}>
                          {meal.name}
                          {meal.baseType && (
                            <span style={styles.mealTag}>{meal.baseType}</span>
                          )}
                        </span>
                        <span style={styles.itemPrice}>
                          {meal.price > 0 ? getFormattedPrice(meal.price) : 'Included'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* F. Insurance Summary */}
          <Card style={styles.sectionCard}>
            <CardHeader style={styles.cardHeader}>
              <div style={styles.sectionHeaderWithEdit}>
                <CardTitle style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>🛡️</span>
                  Travel Insurance
                </CardTitle>
                <Button 
                  onClick={() => router.push('/travel-insurance')}
                  style={styles.editButton}
                >
                  Edit Insurance
                </Button>
              </div>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              {insuranceSelection?.selected ? (
                <div style={styles.selectionSummary}>
                  <div style={styles.summaryDetail}>
                    <span style={styles.detailLabel}>Coverage:</span>
                    <span style={styles.detailValue}>Travel Insurance Protection</span>
                  </div>
                  <div style={styles.summaryDetail}>
                    <span style={styles.detailLabel}>Cost:</span>
                    <span style={styles.detailValue}>
                      {getFormattedPrice(insuranceSelection.price || 499)} per traveler
                    </span>
                  </div>
                </div>
              ) : (
                <div style={styles.noSelection}>
                  <span style={styles.noSelectionText}>No travel insurance selected</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* G. Price Breakdown */}
          <Card style={styles.priceCard}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>💰</span>
                Price Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              <div style={styles.priceBreakdown}>
                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>Base Fare</span>
                  <span style={styles.priceValue}>
                    {selectedFlight.pricing 
                      ? selectedFlight.pricing.total.formatted 
                      : getFormattedPrice(selectedFlight.finalPrice || 0)
                    }
                  </span>
                </div>
                
                {seatSelection?.seatSummary && seatSelection.seatSummary.some(seat => seat.price > 0) && (
                  <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Seats</span>
                    <span style={styles.priceValue}>
                      +{getFormattedPrice(seatSelection.seatSummary.reduce((total, seat) => total + (seat.price || 0), 0))}
                    </span>
                  </div>
                )}
                
                {baggageSelection?.baggageSummary?.extraBaggage && 
                 baggageSelection.baggageSummary.extraBaggage.some(item => item.price > 0) && (
                  <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Extra Baggage</span>
                    <span style={styles.priceValue}>
                      +{getFormattedPrice(baggageSelection.baggageSummary.extraBaggage.reduce((total, item) => total + (item.price || 0), 0))}
                    </span>
                  </div>
                )}
                
                {mealSelection?.mealSummary && Object.values(mealSelection.mealSummary).some(meal => meal.price > 0) && (
                  <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Meals</span>
                    <span style={styles.priceValue}>
                      +{getFormattedPrice(Object.values(mealSelection.mealSummary).reduce((total, meal) => total + (meal.price || 0), 0))}
                    </span>
                  </div>
                )}
                
                {insuranceSelection?.selected && insuranceSelection?.price && (
                  <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Travel Insurance</span>
                    <span style={styles.priceValue}>
                      +{getFormattedPrice(insuranceSelection.price * passengerDetails.length)}
                    </span>
                  </div>
                )}
                
                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>Taxes & Fees</span>
                  <span style={styles.priceValue}>Included</span>
                </div>
                
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total Payable</span>
                  <span style={styles.totalValue}>
                    {getFormattedPrice(calculateTotalPrice())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <Button
              onClick={() => router.push('/travel-insurance')}
              style={styles.backButton}
            >
              ← Back to Insurance
            </Button>
            <Button
              onClick={() => router.push('/payment')}
              style={styles.proceedButton}
            >
              Proceed to Payment →
            </Button>
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
  
  contentCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  
  pageHeader: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  
  title: {
    fontSize: '2.2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  
  subtitle: {
    fontSize: '1rem',
    color: '#6c757d'
  },
  
  sectionCard: {
    marginBottom: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
  },
  
  priceCard: {
    marginBottom: '20px',
    border: '2px solid #007bff',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0, 123, 255, 0.15)'
  },
  
  cardHeader: {
    padding: '16px',
    borderBottom: '1px solid #f1f5f9'
  },
  
  cardContent: {
    padding: '16px'
  },
  
  sectionHeaderWithEdit: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  sectionIcon: {
    fontSize: '1.1rem'
  },
  
  editButton: {
    background: 'white',
    color: '#007bff',
    border: '1px solid #007bff',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  flightSummaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px'
  },
  
  flightDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  
  detailLabel: {
    fontSize: '0.8rem',
    color: '#6c757d',
    fontWeight: '500'
  },
  
  detailValue: {
    fontSize: '0.9rem',
    color: '#2c3e50',
    fontWeight: '600'
  },
  
  passengerCard: {
    background: '#f8f9fa',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px'
  },
  
  passengerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  
  passengerIcon: {
    fontSize: '1.3rem'
  },
  
  passengerName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2c3e50'
  },
  
  passengerDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '8px'
  },
  
  passengerInfo: {
    fontSize: '0.8rem',
    color: '#495057'
  },
  
  assistanceSection: {
    marginTop: '8px'
  },
  
  assistanceLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '4px',
    display: 'block'
  },
  
  assistanceList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  
  assistanceTag: {
    background: '#e3f2fd',
    color: '#1976d2',
    padding: '3px 6px',
    borderRadius: '10px',
    fontSize: '0.7rem',
    fontWeight: '500'
  },
  
  noAssistance: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  
  selectionSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px'
  },
  
  summaryDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  itemsList: {
    marginTop: '12px'
  },
  
  subsectionTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #f1f5f9'
  },
  
  itemPassenger: {
    fontSize: '0.8rem',
    color: '#6c757d',
    fontWeight: '500',
    minWidth: '100px'
  },
  
  itemDetail: {
    fontSize: '0.8rem',
    color: '#374151',
    flex: 1,
    marginLeft: '12px'
  },
  
  itemPrice: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#059669'
  },
  
  mealTag: {
    background: '#f3f4f6',
    color: '#374151',
    padding: '2px 5px',
    borderRadius: '6px',
    fontSize: '0.7rem',
    marginLeft: '6px'
  },
  
  noSelection: {
    textAlign: 'center',
    padding: '16px'
  },
  
  noSelectionText: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  
  priceBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0'
  },
  
  priceLabel: {
    fontSize: '0.9rem',
    color: '#374151'
  },
  
  priceValue: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#059669'
  },
  
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderTop: '2px solid #e5e7eb',
    marginTop: '8px'
  },
  
  totalLabel: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#2c3e50'
  },
  
  totalValue: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#059669'
  },
  
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    marginTop: '24px'
  },
  
  backButton: {
    background: 'white',
    color: '#6c757d',
    border: '2px solid #e5e7eb',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: 1
  },
  
  proceedButton: {
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
    flex: 2
  }
};