'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { formatPrice, CURRENCY_CONFIG } from '../../utils/currency';

export default function BaggageSelectionPage() {
  const router = useRouter();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [seatSelection, setSeatSelection] = useState(null);
  const [selectedExtraBaggage, setSelectedExtraBaggage] = useState({});
  const [selectedSpecialBaggage, setSelectedSpecialBaggage] = useState({});
  const [totalExtraBaggagePrice, setTotalExtraBaggagePrice] = useState(0);
  const [totalSpecialBaggagePrice, setTotalSpecialBaggagePrice] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock pricing for extra baggage (per passenger) - will be filtered by cabin class
  const getAllExtraBaggageOptions = () => [
    { id: 'none', weight: '0kg', price: 0, label: 'No extra baggage' },
    { id: '5kg', weight: '+5kg', price: 1500, label: 'Extra 5kg' },
    { id: '10kg', weight: '+10kg', price: 2800, label: 'Extra 10kg', popular: true },
    { id: '15kg', weight: '+15kg', price: 4000, label: 'Extra 15kg' },
    { id: '20kg', weight: '+20kg', price: 5200, label: 'Extra 20kg' }
  ];

  // Get cabin class specific extra baggage options
  const getExtraBaggageOptions = () => {
    const cabinClass = seatSelection?.cabinClass || 'Economy';
    const allOptions = getAllExtraBaggageOptions();
    
    switch (cabinClass) {
      case 'Economy':
        return allOptions; // All options available
      case 'Premium Economy':
        return allOptions.filter(option => ['none', '5kg', '10kg', '15kg'].includes(option.id));
      case 'Business':
        return allOptions.filter(option => ['none', '5kg', '10kg'].includes(option.id));
      case 'First':
        // First Class: Only +5kg or disable extra baggage for premium experience
        return allOptions.filter(option => ['none', '5kg'].includes(option.id));
      default:
        return allOptions;
    }
  };

  // Mock special baggage options with cabin class specific rules
  const getSpecialBaggageOptions = () => {
    const cabinClass = seatSelection?.cabinClass || 'Economy';
    
    const baseOptions = [
      {
        id: 'sports',
        name: 'Sports Equipment',
        description: 'Golf clubs, tennis rackets, cricket bats, etc.',
        rules: 'Must be properly packed in protective cases',
        icon: '🏏'
      },
      {
        id: 'musical',
        name: 'Musical Instruments',
        description: 'Guitars, violins, keyboards, etc.',
        rules: 'Fragile handling, size restrictions apply',
        icon: '🎸'
      },
      {
        id: 'medical',
        name: 'Medical Equipment',
        description: 'Wheelchairs, oxygen concentrators, etc.',
        rules: 'Medical certificate required',
        price: 0,
        label: 'Free with documentation',
        icon: '🏥'
      },
      {
        id: 'fragile',
        name: 'Fragile/Oversized Items',
        description: 'Artwork, electronics, large items',
        rules: 'Special handling required, size limits apply',
        price: null,
        label: 'Approval required',
        icon: '📦'
      }
    ];

    // Apply cabin class specific pricing and rules
    return baseOptions.map(option => {
      switch (option.id) {
        case 'sports':
          switch (cabinClass) {
            case 'Economy':
              return { ...option, price: 3500 };
            case 'Premium Economy':
              return { ...option, price: 2800, label: 'Discounted rate' };
            case 'Business':
            case 'First':
              return { ...option, price: 0, label: 'Included' };
            default:
              return { ...option, price: 3500 };
          }
        case 'musical':
          switch (cabinClass) {
            case 'Economy':
              return { ...option, price: 4000 };
            case 'Premium Economy':
              return { ...option, price: 0, label: 'Included within allowance' };
            case 'Business':
            case 'First':
              return { ...option, price: 0, label: 'Included' };
            default:
              return { ...option, price: 4000 };
          }
        default:
          return option;
      }
    });
  };

  const extraBaggageOptions = getExtraBaggageOptions();
  const specialBaggageOptions = getSpecialBaggageOptions();

  // Get cabin class specific information
  const getCabinClassInfo = () => {
    const cabinClass = seatSelection?.cabinClass || 'Economy';
    
    const info = {
      'Economy': {
        extraBaggageNote: 'Extra baggage applies to check-in baggage only. Maximum total limit enforced.',
        specialBaggageNote: 'Sports and musical equipment are paid. Medical equipment is free with documentation.',
        maxExtraBaggage: '20kg'
      },
      'Premium Economy': {
        extraBaggageNote: 'Enhanced baggage allowance with higher limits than Economy class.',
        specialBaggageNote: 'Sports equipment discounted. Musical instruments included within allowance.',
        maxExtraBaggage: '15kg'
      },
      'Business': {
        extraBaggageNote: 'Premium baggage allowance with generous limits.',
        specialBaggageNote: 'Sports and musical equipment included. Premium handling available.',
        maxExtraBaggage: '10kg'
      },
      'First': {
        extraBaggageNote: 'Luxury baggage experience with highest allowances.',
        specialBaggageNote: 'All special equipment included. White-glove handling service.',
        maxExtraBaggage: '5kg'
      }
    };
    
    return info[cabinClass] || info['Economy'];
  };

  const cabinClassInfo = getCabinClassInfo();

  useEffect(() => {
    // Load data from localStorage
    const flightData = localStorage.getItem('selectedFlight');
    const passengerData = localStorage.getItem('passengerDetails');
    const seatData = localStorage.getItem('seatSelection');
    
    if (!flightData || !passengerData) {
      router.push('/home');
      return;
    }

    try {
      const flight = JSON.parse(flightData);
      const passengerDataObj = JSON.parse(passengerData);
      const seats = seatData ? JSON.parse(seatData) : null;
      
      // Handle both old and new data structures
      const passengers = passengerDataObj.passengers || passengerDataObj;
      
      setSelectedFlight(flight);
      setPassengerDetails(passengers);
      setSeatSelection(seats);
      
      // Initialize extra baggage selection (default to 'none' for each passenger)
      const initialExtraBaggage = {};
      passengers.forEach((passenger, index) => {
        const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
        initialExtraBaggage[passengerKey] = 'none';
      });
      setSelectedExtraBaggage(initialExtraBaggage);
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading baggage selection data:', error);
      router.push('/home');
    }
  }, [router]);

  useEffect(() => {
    // Calculate total extra baggage price
    let extraTotal = 0;
    Object.values(selectedExtraBaggage).forEach(baggageId => {
      const option = extraBaggageOptions.find(opt => opt.id === baggageId);
      if (option) {
        extraTotal += option.price;
      }
    });
    setTotalExtraBaggagePrice(extraTotal);
  }, [selectedExtraBaggage]);

  useEffect(() => {
    // Calculate total special baggage price
    let specialTotal = 0;
    Object.values(selectedSpecialBaggage).forEach(baggageIds => {
      baggageIds.forEach(baggageId => {
        const option = specialBaggageOptions.find(opt => opt.id === baggageId);
        if (option && option.price) {
          specialTotal += option.price;
        }
      });
    });
    setTotalSpecialBaggagePrice(specialTotal);
  }, [selectedSpecialBaggage]);

  const handleExtraBaggageChange = (passengerKey, baggageId) => {
    setSelectedExtraBaggage(prev => ({
      ...prev,
      [passengerKey]: baggageId
    }));
  };

  const handleSpecialBaggageToggle = (passengerKey, baggageId) => {
    setSelectedSpecialBaggage(prev => {
      const currentSelection = prev[passengerKey] || [];
      const isSelected = currentSelection.includes(baggageId);
      
      return {
        ...prev,
        [passengerKey]: isSelected
          ? currentSelection.filter(id => id !== baggageId)
          : [...currentSelection, baggageId]
      };
    });
  };

  const getIncludedBaggage = () => {
    const cabinClass = seatSelection?.cabinClass || 'Economy';
    const fareType = seatSelection?.fareType || seatSelection?.premiumEconomyFareType || seatSelection?.businessFareType || seatSelection?.firstClassFareType || 'base';
    
    // Mock included baggage based on cabin class and fare type
    const baggageAllowances = {
      'Economy': {
        cabin: '7kg',
        checkin: fareType === 'green' ? '25kg' : fareType === 'saver' ? '15kg' : '20kg'
      },
      'Premium Economy': {
        cabin: '10kg',
        checkin: fareType === 'lite' ? '30kg' : '35kg'
      },
      'Business': {
        cabin: fareType === 'suite' ? '15kg' : '12kg',
        checkin: fareType === 'suite' ? '50kg' : fareType === 'premium' ? '40kg' : '30kg'
      },
      'First': {
        cabin: fareType === 'suite' ? '15kg' : '10kg',
        checkin: fareType === 'suite' ? '50kg' : fareType === 'flex' ? '45kg' : '40kg'
      }
    };

    return baggageAllowances[cabinClass] || baggageAllowances['Economy'];
  };

  const handleContinueToMealSelection = () => {
    // Save baggage selection data
    const baggageSelectionData = {
      includedBaggage: getIncludedBaggage(),
      extraBaggage: selectedExtraBaggage,
      specialBaggage: selectedSpecialBaggage,
      totalExtraBaggagePrice,
      totalSpecialBaggagePrice,
      totalBaggagePrice: totalExtraBaggagePrice + totalSpecialBaggagePrice,
      baggageSummary: {
        extraBaggage: Object.entries(selectedExtraBaggage).map(([passengerKey, baggageId]) => {
          const option = extraBaggageOptions.find(opt => opt.id === baggageId);
          return {
            passenger: passengerKey.replace('_', ' '),
            option: option?.label || 'None',
            price: option?.price || 0
          };
        }),
        specialBaggage: Object.entries(selectedSpecialBaggage).map(([passengerKey, baggageIds]) => ({
          passenger: passengerKey.replace('_', ' '),
          items: baggageIds.map(id => {
            const option = specialBaggageOptions.find(opt => opt.id === id);
            return {
              name: option?.name || '',
              price: option?.price || 0
            };
          })
        }))
      }
    };
    
    localStorage.setItem('baggageSelection', JSON.stringify(baggageSelectionData));
    router.push('/meal-selection');
  };

  const handleSkipBaggageSelection = () => {
    // Save minimal baggage data
    const baggageSelectionData = {
      includedBaggage: getIncludedBaggage(),
      extraBaggage: {},
      specialBaggage: {},
      totalExtraBaggagePrice: 0,
      totalSpecialBaggagePrice: 0,
      totalBaggagePrice: 0,
      skipped: true
    };
    
    localStorage.setItem('baggageSelection', JSON.stringify(baggageSelectionData));
    router.push('/meal-selection');
  };

  if (!isLoaded) {
    return (
      <div style={styles.pageContainer}>
        <Header />
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading baggage options...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const includedBaggage = getIncludedBaggage();
  const totalBaggagePrice = totalExtraBaggagePrice + totalSpecialBaggagePrice;

  return (
    <div style={styles.pageContainer}>
      <Header />
      
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          {/* Page Header */}
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Baggage Selection</h1>
            <p style={styles.pageSubtitle}>
              Review included baggage and add extra items for {selectedFlight?.searchCriteria?.from} → {selectedFlight?.searchCriteria?.to}
            </p>
          </div>

          <div style={styles.sectionsContainer}>
            {/* Left Panel - Baggage Options */}
            <div style={styles.leftPanel}>
              
              {/* Section 1: Included Baggage */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>✅</span>
                    Included Baggage
                  </h2>
                  <div style={styles.includedBadgeContainer}>
                    <span style={styles.includedBadge}>Included as per selected fare</span>
                    <span style={styles.cabinClassBadge}>
                      {seatSelection?.cabinClass || 'Economy'} Class
                    </span>
                  </div>
                </div>
                
                <div style={styles.includedBaggageGrid}>
                  <div style={styles.baggageCard}>
                    <div style={styles.baggageIcon}>🎒</div>
                    <div style={styles.baggageDetails}>
                      <h3 style={styles.baggageTitle}>Cabin Baggage</h3>
                      <p style={styles.baggageWeight}>{includedBaggage.cabin}</p>
                      <p style={styles.baggageDescription}>Hand carry, fits in overhead bin</p>
                    </div>
                  </div>
                  
                  <div style={styles.baggageCard}>
                    <div style={styles.baggageIcon}>🧳</div>
                    <div style={styles.baggageDetails}>
                      <h3 style={styles.baggageTitle}>Check-in Baggage</h3>
                      <p style={styles.baggageWeight}>{includedBaggage.checkin}</p>
                      <p style={styles.baggageDescription}>Checked baggage, collected at destination</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Add Extra Baggage */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>➕</span>
                    Add Extra Baggage
                  </h2>
                  <p style={styles.sectionSubtitle}>Extra baggage for personal items or additional luggage</p>
                  
                  {/* Cabin class specific note */}
                  <div style={styles.cabinClassNote}>
                    <span style={styles.cabinClassNoteIcon}>ℹ️</span>
                    <span style={styles.cabinClassNoteText}>
                      {cabinClassInfo.extraBaggageNote}
                      {seatSelection?.cabinClass === 'First' && (
                        <span style={styles.premiumNote}> Limited options for premium experience.</span>
                      )}
                    </span>
                  </div>
                </div>
                
                {passengerDetails.map((passenger, index) => {
                  const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
                  const selectedBaggage = selectedExtraBaggage[passengerKey];
                  
                  return (
                    <div key={index} style={styles.passengerSection}>
                      <h3 style={styles.passengerName}>
                        {passenger.title} {passenger.firstName} {passenger.lastName}
                      </h3>
                      
                      <div style={styles.baggageOptionsGrid}>
                        {extraBaggageOptions.map((option) => (
                          <div
                            key={option.id}
                            onClick={() => handleExtraBaggageChange(passengerKey, option.id)}
                            style={{
                              ...styles.baggageOptionCard,
                              ...(selectedBaggage === option.id ? styles.selectedBaggageCard : {}),
                              ...(option.popular ? styles.popularBaggageCard : {})
                            }}
                          >
                            {option.popular && (
                              <div style={styles.popularBadge}>Most Popular</div>
                            )}
                            <div style={styles.optionHeader}>
                              <span style={styles.optionWeight}>{option.weight}</span>
                              <span style={styles.optionPrice}>
                                {option.price > 0 ? formatPrice(option.price, CURRENCY_CONFIG) : 'Free'}
                              </span>
                            </div>
                            <p style={styles.optionLabel}>{option.label}</p>
                            {selectedBaggage === option.id && (
                              <div style={styles.selectedIndicator}>
                                <span style={styles.checkmark}>✓</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section 3: Special Baggage */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>🎯</span>
                    Special Baggage
                  </h2>
                  <p style={styles.sectionSubtitle}>Optional selections for non-standard baggage types</p>
                  
                  {/* Cabin class specific note */}
                  <div style={styles.cabinClassNote}>
                    <span style={styles.cabinClassNoteIcon}>ℹ️</span>
                    <span style={styles.cabinClassNoteText}>{cabinClassInfo.specialBaggageNote}</span>
                  </div>
                </div>
                
                <div style={styles.specialBaggageGrid}>
                  {specialBaggageOptions.map((option) => (
                    <div key={option.id} style={styles.specialBaggageCard}>
                      <div style={styles.specialBaggageHeader}>
                        <span style={styles.specialBaggageIcon}>{option.icon}</span>
                        <div style={styles.specialBaggageInfo}>
                          <h3 style={styles.specialBaggageTitle}>{option.name}</h3>
                          <p style={styles.specialBaggageDescription}>{option.description}</p>
                        </div>
                        <div style={styles.specialBaggagePrice}>
                          {option.price !== null ? (
                            option.price > 0 ? formatPrice(option.price, CURRENCY_CONFIG) : (
                              <span style={styles.includedLabel}>{option.label || 'Free'}</span>
                            )
                          ) : (
                            <span style={styles.approvalRequired}>{option.label}</span>
                          )}
                        </div>
                      </div>
                      
                      <div style={styles.specialBaggageRules}>
                        <span style={styles.rulesIcon}>ℹ️</span>
                        <span style={styles.rulesText}>{option.rules}</span>
                      </div>
                      
                      {/* Simple checkbox selector for special baggage */}
                      <div style={styles.specialBaggageSelector}>
                        <div
                          onClick={() => {
                            // Toggle selection for all passengers
                            const allSelected = passengerDetails.every(passenger => {
                              const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
                              return (selectedSpecialBaggage[passengerKey] || []).includes(option.id);
                            });
                            
                            if (allSelected) {
                              // Deselect for all passengers
                              const newSelection = { ...selectedSpecialBaggage };
                              passengerDetails.forEach(passenger => {
                                const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
                                newSelection[passengerKey] = (newSelection[passengerKey] || []).filter(id => id !== option.id);
                              });
                              setSelectedSpecialBaggage(newSelection);
                            } else {
                              // Select for all passengers
                              const newSelection = { ...selectedSpecialBaggage };
                              passengerDetails.forEach(passenger => {
                                const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
                                const currentSelection = newSelection[passengerKey] || [];
                                if (!currentSelection.includes(option.id)) {
                                  newSelection[passengerKey] = [...currentSelection, option.id];
                                }
                              });
                              setSelectedSpecialBaggage(newSelection);
                            }
                          }}
                          style={{
                            ...styles.specialBaggageCheckbox,
                            ...(passengerDetails.some(passenger => {
                              const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
                              return (selectedSpecialBaggage[passengerKey] || []).includes(option.id);
                            }) ? styles.selectedSpecialBaggageCheckbox : {})
                          }}
                        >
                          {passengerDetails.some(passenger => {
                            const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
                            return (selectedSpecialBaggage[passengerKey] || []).includes(option.id);
                          }) && (
                            <span style={styles.specialBaggageCheckmark}>✓</span>
                          )}
                        </div>
                        <span 
                          style={styles.specialBaggageSelectorText}
                          onClick={() => {
                            // Toggle selection for all passengers
                            const allSelected = passengerDetails.every(passenger => {
                              const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
                              return (selectedSpecialBaggage[passengerKey] || []).includes(option.id);
                            });
                            
                            if (allSelected) {
                              // Deselect for all passengers
                              const newSelection = { ...selectedSpecialBaggage };
                              passengerDetails.forEach(passenger => {
                                const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
                                newSelection[passengerKey] = (newSelection[passengerKey] || []).filter(id => id !== option.id);
                              });
                              setSelectedSpecialBaggage(newSelection);
                            } else {
                              // Select for all passengers
                              const newSelection = { ...selectedSpecialBaggage };
                              passengerDetails.forEach(passenger => {
                                const passengerKey = `${passenger.firstName}_${passenger.lastName}`;
                                const currentSelection = newSelection[passengerKey] || [];
                                if (!currentSelection.includes(option.id)) {
                                  newSelection[passengerKey] = [...currentSelection, option.id];
                                }
                              });
                              setSelectedSpecialBaggage(newSelection);
                            }
                          }}
                        >
                          Add to booking
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Cargo Services Note */}
                <div style={styles.cargoNote}>
                  <div style={styles.cargoNoteIcon}>📦</div>
                  <div>
                    <p style={styles.cargoNoteTitle}>Parcel & Cargo Services</p>
                    <p style={styles.cargoNoteText}>
                      For parcel or cargo shipments, please contact airline cargo services.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Summary */}
            <div style={styles.rightPanel}>
              {/* Baggage Summary */}
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Baggage Summary</h3>
                
                {/* Included Baggage Summary */}
                <div style={styles.summarySection}>
                  <h4 style={styles.summarySectionTitle}>Included</h4>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Cabin Baggage</span>
                    <span style={styles.summaryValue}>{includedBaggage.cabin}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Check-in Baggage</span>
                    <span style={styles.summaryValue}>{includedBaggage.checkin}</span>
                  </div>
                </div>

                {/* Extra Baggage Summary */}
                {totalExtraBaggagePrice > 0 && (
                  <div style={styles.summarySection}>
                    <h4 style={styles.summarySectionTitle}>Extra Baggage</h4>
                    {Object.entries(selectedExtraBaggage).map(([passengerKey, baggageId]) => {
                      const option = extraBaggageOptions.find(opt => opt.id === baggageId);
                      if (!option || option.price === 0) return null;
                      
                      return (
                        <div key={passengerKey} style={styles.summaryRow}>
                          <span style={styles.summaryLabel}>
                            {passengerKey.replace('_', ' ')} - {option.weight}
                          </span>
                          <span style={styles.summaryPrice}>
                            {formatPrice(option.price, CURRENCY_CONFIG)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Special Baggage Summary */}
                {totalSpecialBaggagePrice > 0 && (
                  <div style={styles.summarySection}>
                    <h4 style={styles.summarySectionTitle}>Special Baggage</h4>
                    {Object.entries(selectedSpecialBaggage).map(([passengerKey, baggageIds]) => 
                      baggageIds.map(baggageId => {
                        const option = specialBaggageOptions.find(opt => opt.id === baggageId);
                        if (!option || !option.price) return null;
                        
                        return (
                          <div key={`${passengerKey}-${baggageId}`} style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>
                              {passengerKey.replace('_', ' ')} - {option.name}
                            </span>
                            <span style={styles.summaryPrice}>
                              {formatPrice(option.price, CURRENCY_CONFIG)}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Total */}
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total Baggage Charges</span>
                  <span style={styles.totalValue}>
                    {totalBaggagePrice > 0 ? formatPrice(totalBaggagePrice, CURRENCY_CONFIG) : formatPrice(0, CURRENCY_CONFIG)}
                  </span>
                </div>
              </div>

              {/* Back Button */}
              <div style={styles.backButtonRow}>
                <button
                  onClick={() => router.push('/seat-selection')}
                  style={styles.backButton}
                >
                  ← Back to Seat Selection
                </button>
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtons}>
                <button
                  onClick={handleSkipBaggageSelection}
                  style={styles.skipButton}
                >
                  Skip Baggage Selection
                </button>
                
                <button
                  onClick={handleContinueToMealSelection}
                  style={styles.continueButton}
                >
                  Continue to Meal Selection
                  {totalBaggagePrice > 0 && (
                    <span style={styles.buttonPrice}>
                      (+{formatPrice(totalBaggagePrice, CURRENCY_CONFIG)})
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
  
  sectionsContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '3rem',
    alignItems: 'flex-start',
  },
  
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  
  rightPanel: {
    position: 'sticky',
    top: '120px',
  },
  
  section: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  sectionHeader: {
    marginBottom: '2rem',
  },
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  
  sectionIcon: {
    fontSize: '1.3rem',
  },
  
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: '#64748b',
    margin: 0,
  },
  
  cabinClassNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    padding: '0.75rem',
    marginTop: '1rem',
  },
  
  cabinClassNoteIcon: {
    fontSize: '0.9rem',
    flexShrink: 0,
    marginTop: '0.1rem',
  },
  
  cabinClassNoteText: {
    fontSize: '0.85rem',
    color: '#1e40af',
    lineHeight: '1.4',
  },
  
  premiumNote: {
    fontWeight: '600',
    color: '#7c3aed',
  },
  
  includedBadge: {
    background: '#10b981',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  includedBadgeContainer: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  cabinClassBadge: {
    background: '#3b82f6',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  includedBaggageGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  
  baggageCard: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '2px solid #e2e8f0',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  
  baggageIcon: {
    fontSize: '2rem',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  
  baggageDetails: {
    flex: 1,
  },
  
  baggageTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
  },
  
  baggageWeight: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#3b82f6',
    margin: '0 0 0.5rem 0',
  },
  
  baggageDescription: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: 0,
  },
  
  passengerSection: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #e2e8f0',
  },
  
  passengerName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  baggageOptionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
  },
  
  baggageOptionCard: {
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    textAlign: 'center',
  },
  
  selectedBaggageCard: {
    borderColor: '#3b82f6',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
    transform: 'translateY(-2px)',
  },
  
  popularBaggageCard: {
    borderColor: '#10b981',
  },
  
  popularBadge: {
    position: 'absolute',
    top: '-16px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#10b981',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    zIndex: 10,
  },
  
  optionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  
  optionWeight: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  
  optionPrice: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#059669',
  },
  
  optionLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: 0,
  },
  
  selectedIndicator: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: '700',
  },
  
  checkmark: {
    fontSize: '0.7rem',
  },
  
  specialBaggageGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  specialBaggageCard: {
    background: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  
  specialBaggageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1rem',
  },
  
  specialBaggageIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  
  specialBaggageInfo: {
    flex: 1,
  },
  
  specialBaggageTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
  },
  
  specialBaggageDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: 0,
  },
  
  specialBaggagePrice: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#059669',
    textAlign: 'right',
  },
  
  approvalRequired: {
    color: '#f59e0b',
    fontSize: '0.85rem',
    fontStyle: 'italic',
  },
  
  includedLabel: {
    color: '#10b981',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  
  specialBaggageRules: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    background: 'rgba(59, 130, 246, 0.05)',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  
  rulesIcon: {
    fontSize: '0.9rem',
    flexShrink: 0,
    marginTop: '0.1rem',
  },
  
  rulesText: {
    fontSize: '0.8rem',
    color: '#475569',
    lineHeight: '1.4',
  },
  
  specialBaggageSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  
  specialBaggageCheckbox: {
    width: '24px',
    height: '24px',
    border: '2px solid #d1d5db',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white',
  },
  
  selectedSpecialBaggageCheckbox: {
    borderColor: '#3b82f6',
    background: '#3b82f6',
  },
  
  specialBaggageCheckmark: {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '700',
  },
  
  specialBaggageSelectorText: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
  },
  
  cargoNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '2px solid #f59e0b',
    borderRadius: '12px',
    padding: '1rem',
    marginTop: '2rem',
  },
  
  cargoNoteIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  
  cargoNoteTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#92400e',
    margin: '0 0 0.25rem 0',
  },
  
  cargoNoteText: {
    fontSize: '0.85rem',
    color: '#a16207',
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
  
  summarySection: {
    marginBottom: '1.5rem',
  },
  
  summarySectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 0.75rem 0',
  },
  
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  
  summaryLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  
  summaryValue: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  
  summaryPrice: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#059669',
  },
  
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '2px solid #e2e8f0',
    paddingTop: '1rem',
    marginTop: '1rem',
  },
  
  totalLabel: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  
  totalValue: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#059669',
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
  
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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