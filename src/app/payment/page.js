'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleAlphabetsOnly, handleDigitsOnly } from '../../utils/inputValidation';
import { formatPrice, getCurrencyFromData } from '../../utils/currency';
import '../../styles/globals.css';

export default function PaymentPage() {
  const router = useRouter();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState('card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Card form state
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  
  // UPI form state
  const [upiId, setUpiId] = useState('');
  
  // Net banking state
  const [selectedBank, setSelectedBank] = useState('');
  
  // Digital wallet state
  const [selectedWallet, setSelectedWallet] = useState('');

  useEffect(() => {
    const flightData = localStorage.getItem('selectedFlight');
    const passengerData = localStorage.getItem('passengerDetails');
    
    if (!flightData || !passengerData) {
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

  const handleCardInputChange = (field, value) => {
    let processedValue = value;
    
    if (field === 'cardNumber') {
      processedValue = handleDigitsOnly(value).slice(0, 16);
    } else if (field === 'cardholderName') {
      processedValue = handleAlphabetsOnly(value);
    } else if (field === 'expiryDate') {
      let digits = value.replace(/\D/g, '');
      if (digits.length >= 2) {
        digits = digits.slice(0, 2) + '/' + digits.slice(2, 4);
      }
      processedValue = digits;
    } else if (field === 'cvv') {
      processedValue = handleDigitsOnly(value).slice(0, 3);
    }
    
    setCardForm(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  const handleProceedToPay = () => {
    if (!termsAccepted) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }
    setShowToast(true);
  };

  const handleToastClose = () => {
    setShowToast(false);
    sessionStorage.removeItem('bookingSaved');
    sessionStorage.removeItem('currentBookingId');
    sessionStorage.removeItem('currentPnr');
    router.push('/booking-confirmation');
  };

  const formatCityName = (cityCode) => {
    if (!cityCode) return '';
    return cityCode.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const calculateTotalPrice = () => {
    if (!selectedFlight) return 0;
    
    // Use standardized pricing if available
    if (selectedFlight.pricing && selectedFlight.pricing.total) {
      return selectedFlight.pricing.total.amount;
    }
    
    // Fallback to legacy calculation
    const basePrice = parseFloat(selectedFlight.finalPrice) || 0;
    const taxes = Math.round(basePrice * 0.18);
    return basePrice + taxes;
  };

  const getFormattedPrice = (amount) => {
    const currency = getCurrencyFromData(selectedFlight);
    return formatPrice(amount, currency);
  };

  const getPriceBreakdown = () => {
    if (selectedFlight.pricing) {
      return {
        base: selectedFlight.pricing.base,
        taxes: selectedFlight.pricing.taxes,
        total: selectedFlight.pricing.total
      };
    }
    
    // Fallback for legacy data
    const basePrice = parseFloat(selectedFlight.finalPrice) || 0;
    const taxes = Math.round(basePrice * 0.18);
    const total = basePrice + taxes;
    const currency = getCurrencyFromData(selectedFlight);
    
    return {
      base: { amount: basePrice, formatted: formatPrice(basePrice, currency) },
      taxes: { amount: taxes, formatted: formatPrice(taxes, currency) },
      total: { amount: total, formatted: formatPrice(total, currency) }
    };
  };

  const banks = [
    'Select Bank',
    'HDFC Bank',
    'ICICI Bank',
    'State Bank of India',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda'
  ];

  const wallets = [
    { name: 'Paytm', icon: '💳' },
    { name: 'PhonePe', icon: '📱' },
    { name: 'Google Pay', icon: '🔵' },
    { name: 'Amazon Pay', icon: '🛒' }
  ];

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
      <Header />
      
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <h1 style={styles.pageTitle}>Complete Your Payment</h1>
          
          <div style={styles.paymentContainer}>
            {/* Payment Summary */}
            <div style={styles.summarySection}>
              <Card style={styles.summaryCard}>
                <CardHeader>
                  <CardTitle style={styles.summaryTitle}>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Flight Route Card */}
                  <div style={styles.flightRouteCard}>
                    <div style={styles.routeHeader}>
                      <div style={styles.routeInfo}>
                        <span style={styles.route}>
                          {formatCityName(selectedFlight.searchCriteria?.from)} → {formatCityName(selectedFlight.searchCriteria?.to)}
                        </span>
                        <span style={styles.airline}>
                          {selectedFlight.airline} - {selectedFlight.flightNumber}
                        </span>
                      </div>
                      <div style={styles.flightIcon}>✈️</div>
                    </div>
                    
                    <div style={styles.flightDetails}>
                      <div style={styles.flightTime}>
                        <span style={styles.timeLabel}>Departure</span>
                        <span style={styles.timeValue}>{selectedFlight.departureTime || '10:30 AM'}</span>
                      </div>
                      <div style={styles.flightDuration}>
                        <span style={styles.durationLine}></span>
                        <span style={styles.durationText}>{selectedFlight.duration || '2h 30m'}</span>
                      </div>
                      <div style={styles.flightTime}>
                        <span style={styles.timeLabel}>Arrival</span>
                        <span style={styles.timeValue}>{selectedFlight.arrivalTime || '1:00 PM'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Passengers Section - Dynamic based on count */}
                  <div style={{
                    ...styles.passengersSection,
                    minHeight: `${Math.max(120, passengerDetails.length * 60)}px`
                  }}>
                    <div style={styles.passengerHeader}>
                      <span style={styles.passengerTitle}>
                        {passengerDetails.length} Passenger{passengerDetails.length > 1 ? 's' : ''}
                      </span>
                      <span style={styles.passengerIcon}>👥</span>
                    </div>
                    
                    {/* Passenger Count Breakdown */}
                    <div style={styles.passengerBreakdown}>
                      <div style={styles.breakdownItem}>
                        <span style={styles.breakdownLabel}>Adults:</span>
                        <span style={styles.breakdownCount}>
                          {passengerDetails.filter(p => parseInt(p.age) >= 12).length}
                        </span>
                      </div>
                      <div style={styles.breakdownItem}>
                        <span style={styles.breakdownLabel}>Children:</span>
                        <span style={styles.breakdownCount}>
                          {passengerDetails.filter(p => parseInt(p.age) < 12).length}
                        </span>
                      </div>
                    </div>
                    
                    <div style={styles.passengerList}>
                      {passengerDetails.map((passenger, index) => (
                        <div key={index} style={styles.passengerItem}>
                          <div style={styles.passengerAvatar}>
                            {passenger.title === 'Mr' ? '👨' : passenger.title === 'Ms' || passenger.title === 'Mrs' ? '👩' : '🧒'}
                          </div>
                          <div style={styles.passengerInfo}>
                            <span style={styles.passengerName}>
                              {passenger.title} {passenger.firstName} {passenger.lastName}
                            </span>
                            <span style={styles.passengerAge}>
                              Age: {passenger.age} • {parseInt(passenger.age) >= 12 ? 'Adult' : 'Child'} • {passenger.title === 'Mr' ? 'Male' : passenger.title === 'Ms' || passenger.title === 'Mrs' ? 'Female' : 'Child'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Enhanced Price Breakdown */}
                  <div style={styles.priceBreakdown}>
                    <div style={styles.priceHeader}>
                      <span style={styles.priceTitle}>Price Breakdown</span>
                      <span style={styles.priceIcon}>💰</span>
                    </div>
                    
                    <div style={styles.priceDetails}>
                      <div style={styles.priceRow}>
                        <span style={styles.priceLabel}>Base Fare ({passengerDetails.length} passenger{passengerDetails.length > 1 ? 's' : ''})</span>
                        <span style={styles.priceValue}>{getPriceBreakdown().base.formatted}</span>
                      </div>
                      <div style={styles.priceRow}>
                        <span style={styles.priceLabel}>Taxes & Fees</span>
                        <span style={styles.priceValue}>{getPriceBreakdown().taxes.formatted}</span>
                      </div>
                      <div style={styles.serviceFeeRow}>
                        <span style={styles.priceLabel}>Service Fee</span>
                        <span style={styles.serviceFee}>Included</span>
                      </div>
                    </div>
                    
                    <div style={styles.totalRow}>
                      <span style={styles.totalLabel}>Total Amount</span>
                      <span style={styles.totalAmount}>{getPriceBreakdown().total.formatted}</span>
                    </div>
                  </div>
                  
                  {/* Booking Benefits */}
                  <div style={styles.benefitsSection}>
                    <div style={styles.benefitItem}>
                      <span style={styles.benefitIcon}>✅</span>
                      <span style={styles.benefitText}>Free Cancellation within 24 hours</span>
                    </div>
                    <div style={styles.benefitItem}>
                      <span style={styles.benefitIcon}>✅</span>
                      <span style={styles.benefitText}>Instant Booking Confirmation</span>
                    </div>
                    <div style={styles.benefitItem}>
                      <span style={styles.benefitIcon}>✅</span>
                      <span style={styles.benefitText}>24/7 Customer Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <div style={styles.paymentSection}>
              <Card style={styles.paymentCard}>
                <CardHeader>
                  <CardTitle style={styles.paymentTitle}>Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Payment Method Tabs */}
                  <div style={styles.paymentTabs}>
                    <button
                      onClick={() => setActivePaymentMethod('card')}
                      style={{
                        ...styles.paymentTab,
                        ...(activePaymentMethod === 'card' ? styles.activeTab : {})
                      }}
                    >
                      Credit / Debit Card
                    </button>
                    <button
                      onClick={() => setActivePaymentMethod('upi')}
                      style={{
                        ...styles.paymentTab,
                        ...(activePaymentMethod === 'upi' ? styles.activeTab : {})
                      }}
                    >
                      UPI
                    </button>
                    <button
                      onClick={() => setActivePaymentMethod('netbanking')}
                      style={{
                        ...styles.paymentTab,
                        ...(activePaymentMethod === 'netbanking' ? styles.activeTab : {})
                      }}
                    >
                      Net Banking
                    </button>
                    <button
                      onClick={() => setActivePaymentMethod('wallet')}
                      style={{
                        ...styles.paymentTab,
                        ...(activePaymentMethod === 'wallet' ? styles.activeTab : {})
                      }}
                    >
                      Digital Wallets
                    </button>
                  </div>

                  {/* Spacer between payment methods and forms */}
                  <div style={styles.paymentSpacer}></div>

                  {/* Card Payment Form */}
                  {activePaymentMethod === 'card' && (
                    <div style={styles.paymentForm}>
                      <div style={styles.demoNotice}>
                        <span style={styles.demoIcon}>ℹ️</span>
                        This is a demo payment form
                      </div>
                      
                      <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardForm.cardNumber}
                            onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                            maxLength={16}
                            style={styles.input}
                          />
                        </div>
                        
                        <div style={styles.formGroup}>
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input
                            id="cardholderName"
                            placeholder="John Doe"
                            value={cardForm.cardholderName}
                            onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                            style={styles.input}
                          />
                        </div>
                        
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={cardForm.expiryDate}
                              onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                              maxLength={5}
                              style={styles.input}
                            />
                          </div>
                          
                          <div style={styles.formGroup}>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              type="password"
                              value={cardForm.cvv}
                              onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                              maxLength={3}
                              style={styles.input}
                            />
                          </div>
                        </div>
                        
                        <div style={styles.checkboxGroup}>
                          <input
                            type="checkbox"
                            id="saveCard"
                            checked={cardForm.saveCard}
                            onChange={(e) => setCardForm(prev => ({ ...prev, saveCard: e.target.checked }))}
                            style={styles.checkbox}
                          />
                          <Label htmlFor="saveCard" style={styles.checkboxLabel}>
                            Save card for future payments
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Payment */}
                  {activePaymentMethod === 'upi' && (
                    <div style={styles.paymentForm}>
                      <div style={styles.demoNotice}>
                        <span style={styles.demoIcon}>ℹ️</span>
                        UPI payment will be available in future
                      </div>
                      
                      <div style={styles.formGroup}>
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          style={styles.input}
                        />
                        <span style={styles.helperText}>Enter your UPI ID (e.g., 9876543210@paytm)</span>
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {activePaymentMethod === 'netbanking' && (
                    <div style={styles.paymentForm}>
                      <div style={styles.demoNotice}>
                        <span style={styles.demoIcon}>ℹ️</span>
                        Net banking integration coming soon
                      </div>
                      
                      <div style={styles.formGroup}>
                        <Label htmlFor="bankSelect">Select Your Bank</Label>
                        <select
                          id="bankSelect"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          style={styles.select}
                        >
                          {banks.map((bank, index) => (
                            <option key={index} value={bank} disabled={index === 0}>
                              {bank}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <Button disabled style={styles.disabledButton}>
                        Pay via Net Banking
                      </Button>
                    </div>
                  )}

                  {/* Digital Wallets */}
                  {activePaymentMethod === 'wallet' && (
                    <div style={styles.paymentForm}>
                      <div style={styles.demoNotice}>
                        <span style={styles.demoIcon}>ℹ️</span>
                        Wallet payments will be enabled later
                      </div>
                      
                      <div style={styles.walletGrid}>
                        {wallets.map((wallet, index) => (
                          <div
                            key={index}
                            onClick={() => setSelectedWallet(wallet.name)}
                            style={{
                              ...styles.walletOption,
                              ...(selectedWallet === wallet.name ? styles.selectedWallet : {})
                            }}
                          >
                            <span style={styles.walletIcon}>{wallet.icon}</span>
                            <span style={styles.walletName}>{wallet.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Security & Terms */}
                  <div style={styles.securitySection}>
                    <div style={styles.securityBadge}>
                      <span style={styles.lockIcon}>🔒</span>
                      <span>Your payment is secure</span>
                    </div>
                    
                    <div style={styles.termsSection}>
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        style={styles.checkbox}
                      />
                      <Label htmlFor="terms" style={styles.termsLabel}>
                        I accept the <a href="#" style={styles.link}>Terms & Conditions</a> and <a href="#" style={styles.link}>Privacy Policy</a>
                      </Label>
                    </div>
                    
                    <Button
                      onClick={handleProceedToPay}
                      disabled={!termsAccepted}
                      style={{
                        ...styles.proceedButton,
                        ...(termsAccepted ? {} : styles.disabledButton)
                      }}
                    >
                      Proceed to Pay {getFormattedPrice(calculateTotalPrice())}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Modal */}
      {showToast && (
        <div style={styles.toastOverlay} onClick={handleToastClose}>
          <div style={styles.toastModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.toastContent}>
              <div style={styles.toastIcon}>ℹ️</div>
              <h3 style={styles.toastTitle}>Demo Payment</h3>
              <p style={styles.toastMessage}>
                Payment integration will be implemented in a later phase.
              </p>
              <Button onClick={handleToastClose} style={styles.toastButton}>
                OK
              </Button>
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
  },
  
  main: {
    flex: 1,
    paddingTop: '80px',
    paddingBottom: '80px',
  },
  
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  
  loadingContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#2c3e50'
  },
  
  paymentContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '3rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem',
    }
  },
  
  summarySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  summaryCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.5rem',
  },
  
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  
  flightRouteCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    color: 'white',
  },
  
  routeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  
  routeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  route: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'white',
  },
  
  airline: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  
  flightIcon: {
    fontSize: '2rem',
    opacity: 0.8,
  },
  
  flightDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '1rem',
  },
  
  flightTime: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  
  timeLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  timeValue: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'white',
  },
  
  flightDuration: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
    margin: '0 1rem',
  },
  
  durationLine: {
    width: '100%',
    height: '2px',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '1px',
  },
  
  durationText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  
  passengersSection: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    color: 'white',
    transition: 'min-height 0.3s ease',
  },
  
  passengerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  
  passengerTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'white',
  },
  
  passengerIcon: {
    fontSize: '1.5rem',
    opacity: 0.8,
  },
  
  passengerBreakdown: {
    display: 'flex',
    justifyContent: 'space-around',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  
  breakdownItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  
  breakdownLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  
  breakdownCount: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
  },
  
  passengerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  
  passengerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '0.75rem',
  },
  
  passengerAvatar: {
    fontSize: '1.5rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
  },
  
  passengerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  
  passengerName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
  },
  
  passengerAge: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  priceBreakdown: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    color: 'white',
  },
  
  priceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  
  priceTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'white',
  },
  
  priceIcon: {
    fontSize: '1.5rem',
    opacity: 0.8,
  },
  
  priceDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  
  priceLabel: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  
  priceValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
  },
  
  serviceFeeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  
  serviceFee: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#90EE90',
  },
  
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '2px solid rgba(255, 255, 255, 0.3)',
  },
  
  totalLabel: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'white',
  },
  
  totalAmount: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'white',
  },
  
  benefitsSection: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  benefitIcon: {
    fontSize: '1.2rem',
  },
  
  benefitText: {
    fontSize: '0.95rem',
    color: '#2d3748',
    fontWeight: '500',
  },
  
  paymentSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  paymentCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.5rem',
  },
  
  paymentTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  
  paymentTabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
    marginTop: '1rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '0.75rem',
    }
  },
  
  paymentSpacer: {
    height: '2rem',
    marginBottom: '1.5rem',
  },
  
  paymentTab: {
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    background: 'white',
    color: '#4a5568',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  
  activeTab: {
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    border: '2px solid #007bff',
  },
  
  paymentForm: {
    marginBottom: '2.5rem',
  },
  
  demoNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.25rem',
    background: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '8px',
    marginBottom: '2rem',
    fontSize: '0.95rem',
    color: '#856404',
  },
  
  demoIcon: {
    fontSize: '1.2rem',
  },
  
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  
  input: {
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  
  select: {
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '1rem',
    background: 'white',
    cursor: 'pointer',
  },
  
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  checkbox: {
    width: '1.2rem',
    height: '1.2rem',
    cursor: 'pointer',
  },
  
  checkboxLabel: {
    fontSize: '0.95rem',
    color: '#4a5568',
    cursor: 'pointer',
  },
  
  helperText: {
    fontSize: '0.875rem',
    color: '#718096',
    fontStyle: 'italic',
  },
  
  walletGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },
  
  walletOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '2rem',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  selectedWallet: {
    border: '2px solid #007bff',
    background: '#f0f8ff',
  },
  
  walletIcon: {
    fontSize: '2rem',
  },
  
  walletName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  
  disabledButton: {
    background: '#e2e8f0',
    color: '#a0aec0',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  
  securitySection: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '2.5rem',
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '1.25rem',
    background: '#f0fff4',
    border: '1px solid #9ae6b4',
    borderRadius: '8px',
    color: '#276749',
    fontSize: '1rem',
    fontWeight: '600',
  },
  
  lockIcon: {
    fontSize: '1.2rem',
  },
  
  termsSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  
  termsLabel: {
    fontSize: '0.95rem',
    color: '#4a5568',
    lineHeight: '1.5',
    cursor: 'pointer',
  },
  
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '600',
  },
  
  proceedButton: {
    width: '100%',
    padding: '1.25rem 2rem',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
    marginTop: '1rem',
  },
  
  toastOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  
  toastModal: {
    background: 'white',
    borderRadius: '16px',
    padding: '0',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  
  toastContent: {
    padding: '2rem',
    textAlign: 'center',
  },
  
  toastIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  
  toastTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  
  toastMessage: {
    fontSize: '1rem',
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  
  toastButton: {
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};