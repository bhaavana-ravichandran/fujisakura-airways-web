'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice, getCurrencyFromData, CURRENCY_CONFIG } from '../../utils/currency';
import '../../styles/globals.css';

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      const parsedBookings = JSON.parse(storedBookings);
      const sortedBookings = parsedBookings.sort((a, b) => 
        new Date(b.bookingDate) - new Date(a.bookingDate)
      );
      setBookings(sortedBookings);
      setFilteredBookings(sortedBookings);
    }
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === activeFilter));
    }
  }, [activeFilter, bookings]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleCancelBooking = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    const updatedBookings = bookings.map(booking => 
      booking.bookingId === bookingToCancel 
        ? { ...booking, status: 'Cancelled' }
        : booking
    );
    
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    setShowCancelModal(false);
    setBookingToCancel(null);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const toggleExpandBooking = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return '#3b82f6';
      case 'Completed':
        return '#6b7280';
      case 'Cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div style={styles.container}>
      <Header />
      
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <h1 style={styles.pageTitle}>My Bookings</h1>

          {/* Back Button */}
          <div style={styles.backButtonContainer}>
            <BackButton customPath="/home" label="Back to Home" />
          </div>

          <div style={styles.filterContainer}>
            {['All', 'Upcoming', 'Completed', 'Cancelled'].map((filter) => (
              <Button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                style={{
                  ...styles.filterButton,
                  ...(activeFilter === filter ? styles.filterButtonActive : {}),
                }}
              >
                {filter}
              </Button>
            ))}
          </div>

          {filteredBookings.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✈️</div>
              <h2 style={styles.emptyTitle}>
                {activeFilter === 'All' 
                  ? 'You have no bookings yet.' 
                  : `You have no ${activeFilter.toLowerCase()} bookings.`}
              </h2>
              <p style={styles.emptyText}>
                Start your journey by booking a flight!
              </p>
              <Button
                onClick={() => router.push('/home')}
                style={styles.bookNowButton}
              >
                Book a Flight
              </Button>
            </div>
          ) : (
            <div style={styles.bookingsGrid}>
              {filteredBookings.map((booking) => (
                <Card 
                  key={booking.bookingId}
                  style={styles.bookingCard}
                >
                  <CardHeader style={styles.cardHeader}>
                    <div style={styles.cardHeaderTop}>
                      <CardTitle style={styles.cardTitle}>
                        {booking.flight.from} → {booking.flight.to}
                      </CardTitle>
                      <span 
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(booking.status)
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent style={styles.cardContent}>
                    <div style={styles.detailsGrid}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Booking ID:</span>
                        <span style={styles.detailValue}>{booking.bookingId}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>PNR:</span>
                        <span style={styles.detailValue}>{booking.pnr}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Airline:</span>
                        <span style={styles.detailValue}>{booking.flight.airline}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Flight Number:</span>
                        <span style={styles.detailValue}>{booking.flight.flightNumber}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Passengers:</span>
                        <span style={styles.detailValue}>{booking.passengers.length}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Booking Date:</span>
                        <span style={styles.detailValue}>{formatDate(booking.bookingDate)}</span>
                      </div>
                    </div>

                    <div style={styles.priceContainer}>
                      <span style={styles.priceLabel}>Total Price:</span>
                      <span style={styles.priceValue}>
                        {booking.flight.pricing 
                          ? booking.flight.pricing.total.formatted 
                          : formatPrice(booking.flight.price, CURRENCY_CONFIG)
                        }
                      </span>
                    </div>

                    {expandedBooking === booking.bookingId && (
                      <div style={styles.passengerDetails}>
                        <h3 style={styles.passengerTitle}>Passenger Details</h3>
                        {booking.passengers.map((passenger, index) => (
                          <div key={index} style={styles.passengerCard}>
                            <h4 style={styles.passengerName}>
                              Passenger {index + 1}: {passenger.firstName} {passenger.lastName}
                            </h4>
                            <div style={styles.passengerInfo}>
                              <span><strong>Gender:</strong> {passenger.gender}</span>
                              <span><strong>Age:</strong> {passenger.age}</span>
                              {passenger.email && <span><strong>Email:</strong> {passenger.email}</span>}
                              {passenger.phone && <span><strong>Phone:</strong> {passenger.phone}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={styles.buttonContainer}>
                      <Button
                        onClick={() => toggleExpandBooking(booking.bookingId)}
                        style={styles.viewDetailsButton}
                      >
                        {expandedBooking === booking.bookingId ? 'Hide Details' : 'View Details'}
                      </Button>
                      
                      {booking.status === 'Upcoming' && (
                        <Button
                          onClick={() => handleCancelBooking(booking.bookingId)}
                          style={styles.cancelButton}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {showCancelModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Cancel Booking</h2>
            <p style={styles.modalText}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div style={styles.modalButtons}>
              <Button
                onClick={() => setShowCancelModal(false)}
                style={styles.modalCancelButton}
              >
                No, Keep Booking
              </Button>
              <Button
                onClick={confirmCancelBooking}
                style={styles.modalConfirmButton}
              >
                Yes, Cancel Booking
              </Button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div style={styles.toast}>
          <span style={styles.toastIcon}>✓</span>
          Booking cancelled successfully
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
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
  
  backButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  
  filterContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  
  filterButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    background: 'white',
    color: '#4a5568',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  filterButtonActive: {
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    border: '2px solid #007bff',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  
  emptyText: {
    fontSize: '1rem',
    color: '#718096',
    marginBottom: '2rem',
  },
  
  bookNowButton: {
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  
  bookingCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  
  cardHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  
  cardHeaderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  
  cardContent: {
    padding: '1.5rem',
  },
  
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
  },
  
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  
  detailLabel: {
    fontSize: '0.875rem',
    color: '#718096',
    fontWeight: '500',
  },
  
  detailValue: {
    fontSize: '1rem',
    color: '#2d3748',
    fontWeight: '600',
  },
  
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: '#f7fafc',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  
  priceLabel: {
    fontSize: '1rem',
    color: '#4a5568',
    fontWeight: '600',
  },
  
  priceValue: {
    fontSize: '1.5rem',
    color: '#007bff',
    fontWeight: '700',
  },
  
  passengerDetails: {
    marginTop: '1rem',
    padding: '1rem',
    background: '#f7fafc',
    borderRadius: '8px',
  },
  
  passengerTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  
  passengerCard: {
    background: 'white',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '0.75rem',
  },
  
  passengerName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  
  passengerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: '#4a5568',
  },
  
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  
  viewDetailsButton: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px',
    background: '#f7fafc',
    color: '#2d3748',
    border: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px',
    background: '#fee',
    color: '#c53030',
    border: '1px solid #fc8181',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  modalOverlay: {
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
  
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  
  modalText: {
    fontSize: '1rem',
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  
  modalButtons: {
    display: 'flex',
    gap: '1rem',
  },
  
  modalCancelButton: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px',
    background: '#f7fafc',
    color: '#2d3748',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  modalConfirmButton: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px',
    background: '#e53e3e',
    color: 'white',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  toast: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    background: '#48bb78',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    zIndex: 1001,
    animation: 'slideIn 0.3s ease',
  },
  
  toastIcon: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
};
