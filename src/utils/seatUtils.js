// Economy fare types configuration
export const ECONOMY_FARE_TYPES = {
  SAVER: {
    id: 'saver',
    name: 'Economy Saver',
    description: 'Lowest fare, limited flexibility',
    priceMultiplier: 0.8, // 20% discount on seat prices
    icon: '💰',
    color: '#059669'
  },
  BASE: {
    id: 'base',
    name: 'Economy Base',
    description: 'Standard fare with balanced benefits',
    priceMultiplier: 1.0, // Standard pricing
    icon: '✈️',
    color: '#3b82f6'
  },
  GREEN: {
    id: 'green',
    name: 'Economy Green',
    description: 'Eco-friendly option with added flexibility',
    priceMultiplier: 1.2, // 20% premium on seat prices
    icon: '🌱',
    color: '#10b981'
  }
};

// Premium Economy fare types configuration
export const PREMIUM_ECONOMY_FARE_TYPES = {
  LITE: {
    id: 'lite',
    name: 'Premium Economy Lite',
    description: 'Entry-level Premium Economy with essential upgrades',
    priceMultiplier: 1.3, // 30% premium over Economy
    icon: '✈️',
    color: '#059669',
    flexibility: 'Limited',
    baggage: {
      cabin: {
        weight: '10kg',
        included: true,
        description: 'Premium cabin baggage'
      },
      checkin: {
        included: '30kg',
        description: '30kg check-in baggage included'
      }
    }
  },
  STANDARD: {
    id: 'standard',
    name: 'Premium Economy Standard',
    description: 'Balanced option with added comfort',
    priceMultiplier: 1.5, // 50% premium over Economy
    icon: '⭐',
    color: '#3b82f6',
    flexibility: 'Standard',
    recommended: true,
    baggage: {
      cabin: {
        weight: '10kg',
        included: true,
        description: 'Premium cabin baggage with priority'
      },
      checkin: {
        included: '35kg',
        description: '35kg check-in baggage included'
      }
    }
  },
  FLEX: {
    id: 'flex',
    name: 'Premium Economy Flex',
    description: 'Maximum flexibility within Premium Economy',
    priceMultiplier: 1.7, // 70% premium over Economy
    icon: '🔄',
    color: '#8b5cf6',
    flexibility: 'Maximum',
    baggage: {
      cabin: {
        weight: '10kg',
        included: true,
        description: 'Premium cabin baggage with priority'
      },
      checkin: {
        included: '35kg',
        description: '35kg check-in baggage included',
        modifications: 'Free baggage modifications'
      }
    }
  }
};

// Business Class fare types configuration
export const BUSINESS_FARE_TYPES = {
  FLEX: {
    id: 'flex',
    name: 'Business Flex',
    description: 'Standard business class with flexibility',
    seatIncluded: true, // Most seats included
    premiumSeatCharge: 5000, // Premium seats cost extra
    icon: '💼',
    color: '#8b5cf6',
    baggage: {
      cabin: {
        weight: '10kg',
        included: true,
        description: 'Premium cabin baggage'
      },
      checkin: {
        included: '30kg',
        description: '30kg check-in baggage included',
        upgrades: [
          { weight: '40kg', price: 3000, popular: false },
          { weight: '50kg', price: 5000, popular: true }
        ]
      }
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Business Premium',
    description: 'Enhanced business experience',
    seatIncluded: true, // All seats included
    premiumSeatCharge: 0, // No extra charge for premium seats
    icon: '⭐',
    color: '#f59e0b',
    baggage: {
      cabin: {
        weight: '12kg',
        included: true,
        description: 'Premium cabin baggage with priority'
      },
      checkin: {
        included: '40kg',
        description: '40kg check-in baggage included',
        upgrades: [
          { weight: '50kg', price: 2500, popular: true },
          { weight: '60kg', price: 4000, popular: false }
        ]
      }
    }
  },
  SUITE: {
    id: 'suite',
    name: 'Business Suite',
    description: 'Ultimate luxury business experience',
    seatIncluded: true, // All seats included
    premiumSeatCharge: 0, // No extra charge
    suiteAccess: true, // Special suite features
    icon: '👑',
    color: '#dc2626',
    baggage: {
      cabin: {
        weight: '15kg',
        included: true,
        description: 'Luxury cabin baggage with concierge service'
      },
      checkin: {
        included: '50kg',
        description: '50kg check-in baggage included',
        upgrades: [
          { weight: '60kg', price: 2000, popular: false },
          { weight: '70kg', price: 3500, popular: true }
        ]
      }
    }
  }
};

// First Class fare types configuration
export const FIRST_CLASS_FARE_TYPES = {
  STANDARD: {
    id: 'standard',
    name: 'First Class Standard',
    description: 'Premium first-class experience',
    seatIncluded: true,
    seatTypes: ['standard'], // Only standard first-class seats
    cancellation: 'Paid',
    dateChange: 'Paid',
    meals: 'Standard gourmet meals',
    icon: '✈️',
    color: '#8b5cf6',
    baggage: {
      cabin: {
        weight: '10kg',
        included: true,
        description: 'Premium cabin baggage'
      },
      checkin: {
        included: '40kg',
        description: '40kg check-in baggage included'
      }
    }
  },
  FLEX: {
    id: 'flex',
    name: 'First Class Flex',
    description: 'Enhanced flexibility and premium experience',
    seatIncluded: true,
    seatTypes: ['standard'], // Any first-class seat
    cancellation: 'Free before departure',
    dateChange: 'Free',
    meals: 'Premium meals with special requests',
    icon: '⭐',
    color: '#f59e0b',
    baggage: {
      cabin: {
        weight: '10kg',
        included: true,
        description: 'Premium cabin baggage with priority'
      },
      checkin: {
        included: '45kg',
        description: '45kg check-in baggage included'
      }
    }
  },
  SUITE: {
    id: 'suite',
    name: 'First Class Suite',
    description: 'Ultimate luxury with private suite experience',
    seatIncluded: true,
    seatTypes: ['standard', 'suite'], // Access to suite seats
    cancellation: 'Free anytime',
    dateChange: 'Free',
    meals: 'À la carte luxury dining',
    suiteAccess: true,
    icon: '👑',
    color: '#dc2626',
    baggage: {
      cabin: {
        weight: '15kg',
        included: true,
        description: 'Luxury cabin baggage with concierge service'
      },
      checkin: {
        included: '50kg',
        description: '50kg check-in baggage included'
      }
    }
  }
};

// Seat map generation and pricing utilities

export const SEAT_TYPES = {
  WINDOW: 'window',
  MIDDLE: 'middle',
  AISLE: 'aisle',
  PREMIUM: 'premium',
  EMERGENCY: 'emergency',
  // Premium Economy specific types
  PREMIUM_ECONOMY_STANDARD: 'premium_economy_standard',
  PREMIUM_ECONOMY_EXTRA_LEGROOM: 'premium_economy_extra_legroom',
  // Business Class specific types
  STANDARD_BIZ: 'standard_business',
  LIE_FLAT: 'lie_flat',
  EXTRA_PRIVACY: 'extra_privacy',
  SUITE: 'suite',
  // First Class specific types
  FIRST_STANDARD: 'first_standard',
  FIRST_SUITE: 'first_suite'
};

export const SEAT_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  SELECTED: 'selected',
  BLOCKED: 'blocked'
};

export const CABIN_CLASSES = {
  ECONOMY: 'Economy',
  PREMIUM_ECONOMY: 'Premium Economy',
  BUSINESS: 'Business',
  FIRST: 'First'
};

// Mock seat pricing (in INR)
export const SEAT_PRICING = {
  [CABIN_CLASSES.ECONOMY]: {
    [SEAT_TYPES.WINDOW]: 500,
    [SEAT_TYPES.MIDDLE]: 0,
    [SEAT_TYPES.AISLE]: 300,
    [SEAT_TYPES.PREMIUM]: 800,
    [SEAT_TYPES.EMERGENCY]: 1000
  },
  [CABIN_CLASSES.PREMIUM_ECONOMY]: {
    [SEAT_TYPES.PREMIUM_ECONOMY_STANDARD]: 200, // Small fee for standard Premium Economy seats
    [SEAT_TYPES.PREMIUM_ECONOMY_EXTRA_LEGROOM]: 800 // Premium for extra legroom
  },
  [CABIN_CLASSES.BUSINESS]: {
    [SEAT_TYPES.STANDARD_BIZ]: 0, // Usually included in Business fare
    [SEAT_TYPES.LIE_FLAT]: 0, // Usually included
    [SEAT_TYPES.EXTRA_PRIVACY]: 5000, // Premium charge for extra privacy
    [SEAT_TYPES.SUITE]: 8000 // Premium charge for suite access
  },
  [CABIN_CLASSES.FIRST]: {
    [SEAT_TYPES.FIRST_STANDARD]: 0, // Included in First Class fare
    [SEAT_TYPES.FIRST_SUITE]: 0 // Included based on fare type
  }
};

// Aircraft configurations
export const AIRCRAFT_CONFIGS = {
  [CABIN_CLASSES.ECONOMY]: {
    name: 'Boeing 737-800 Economy',
    rows: 30,
    seatsPerRow: 6,
    layout: ['A', 'B', 'C', 'AISLE', 'D', 'E', 'F'],
    emergencyRows: [12, 13],
    premiumRows: [1, 2, 3],
    blockedSeats: ['1A', '1F', '30A', '30F'] // Mock blocked seats
  },
  [CABIN_CLASSES.PREMIUM_ECONOMY]: {
    name: 'Boeing 787 Premium Economy',
    rows: 20,
    seatsPerRow: 7,
    layout: ['A', 'B', 'AISLE', 'C', 'D', 'E', 'AISLE', 'F', 'G'], // 2-3-2 layout
    emergencyRows: [],
    premiumRows: [1, 2, 3], // Front rows
    extraLegroomRows: [1, 2, 12, 13], // Front rows and exit rows
    blockedSeats: ['1A', '1G'], // Mock blocked seats
    seatSpacing: 'comfortable' // Better than Economy, less than Business
  },
  [CABIN_CLASSES.BUSINESS]: {
    name: 'Boeing 787 Business Class',
    rows: 12,
    seatsPerRow: 4,
    layout: ['A', 'AISLE', 'D', 'AISLE_WIDE', 'G', 'AISLE', 'K'], // 1-2-1 configuration
    premiumRows: [1, 2], // Bulkhead rows with extra privacy
    suiteRows: [1], // Row 1 has suite access
    blockedSeats: ['3A', '8K'], // Mock blocked seats
    seatSpacing: 'generous' // Extra spacing for business class
  },
  [CABIN_CLASSES.FIRST]: {
    name: 'Airbus A380 First Class',
    rows: 8,
    seatsPerRow: 2,
    layout: ['A', 'AISLE_WIDE', 'F'], // 1-1 layout (A and F seats only)
    emergencyRows: [],
    premiumRows: [1, 2, 3, 4, 5, 6, 7, 8], // All rows are premium
    suiteRows: [1, 2], // Front rows have suite access
    blockedSeats: [], // No blocked seats in First Class
    seatSpacing: 'luxury', // Maximum spacing for First Class
    premiumExperience: true
  }
};

// Generate mock occupied seats (simulate real booking data)
const generateOccupiedSeats = (totalSeats, occupancyRate = 0.6) => {
  const occupiedSeats = new Set();
  const targetOccupied = Math.floor(totalSeats * occupancyRate);
  
  while (occupiedSeats.size < targetOccupied) {
    const randomSeat = Math.floor(Math.random() * totalSeats);
    occupiedSeats.add(randomSeat);
  }
  
  return occupiedSeats;
};

// Determine seat type based on position
const getSeatType = (rowIndex, seatIndex, config) => {
  const { layout, emergencyRows, premiumRows, suiteRows } = config;
  const rowNumber = rowIndex + 1;
  const seatLetter = layout[seatIndex];
  
  if (seatLetter === 'AISLE' || seatLetter === 'AISLE_WIDE') return null;
  
  // First Class specific logic
  if (config.name.includes('First Class')) {
    // Suite rows (front rows typically)
    if (suiteRows && suiteRows.includes(rowNumber)) {
      return SEAT_TYPES.FIRST_SUITE;
    }
    
    // All other First Class seats are standard
    return SEAT_TYPES.FIRST_STANDARD;
  }
  
  // Premium Economy specific logic
  if (config.name.includes('Premium Economy')) {
    // Extra legroom rows
    if (config.extraLegroomRows && config.extraLegroomRows.includes(rowNumber)) {
      return SEAT_TYPES.PREMIUM_ECONOMY_EXTRA_LEGROOM;
    }
    
    // All other Premium Economy seats are standard
    return SEAT_TYPES.PREMIUM_ECONOMY_STANDARD;
  }
  
  // Business Class specific logic
  if (config.name.includes('Business')) {
    // Suite rows (row 1 typically)
    if (suiteRows && suiteRows.includes(rowNumber)) {
      return SEAT_TYPES.SUITE;
    }
    
    // Premium rows (bulkhead with extra privacy)
    if (premiumRows && premiumRows.includes(rowNumber)) {
      return SEAT_TYPES.EXTRA_PRIVACY;
    }
    
    // Standard business class seats (lie-flat)
    return SEAT_TYPES.LIE_FLAT;
  }
  
  // Economy Class logic (existing)
  // Emergency exit rows
  if (emergencyRows && emergencyRows.includes(rowNumber)) {
    return SEAT_TYPES.EMERGENCY;
  }
  
  // Premium rows (front of cabin)
  if (premiumRows && premiumRows.includes(rowNumber)) {
    return SEAT_TYPES.PREMIUM;
  }
  
  // Window seats (A and F in the layout ['A', 'B', 'C', 'AISLE', 'D', 'E', 'F'])
  if (seatLetter === 'A' || seatLetter === 'F') {
    return SEAT_TYPES.WINDOW;
  }
  
  // Aisle seats (C and D - next to the aisle)
  if (seatLetter === 'C' || seatLetter === 'D') {
    return SEAT_TYPES.AISLE;
  }
  
  // Middle seats (B and E)
  return SEAT_TYPES.MIDDLE;
};

// Generate seat map for a specific cabin class
export const generateSeatMap = (cabinClass) => {
  const config = AIRCRAFT_CONFIGS[cabinClass];
  if (!config) return null;
  
  const { rows, layout, blockedSeats } = config;
  const seatMap = {
    cabinClass,
    config,
    rows: []
  };
  
  // Calculate total seats for occupancy simulation
  const seatsPerRow = layout.filter(seat => seat !== 'AISLE' && seat !== 'AISLE_WIDE').length;
  const totalSeats = rows * seatsPerRow;
  const occupiedSeatIndices = generateOccupiedSeats(totalSeats, 0.65);
  
  let seatCounter = 0;
  
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const rowNumber = rowIndex + 1;
    const rowData = {
      rowNumber,
      seats: []
    };
    
    for (let seatIndex = 0; seatIndex < layout.length; seatIndex++) {
      const seatLetter = layout[seatIndex];
      
      if (seatLetter === 'AISLE') {
        rowData.seats.push({ type: 'aisle' });
        continue;
      }
      
      if (seatLetter === 'AISLE_WIDE') {
        rowData.seats.push({ type: 'aisle_wide' });
        continue;
      }
      
      const seatId = `${rowNumber}${seatLetter}`;
      const seatType = getSeatType(rowIndex, seatIndex, config);
      
      // Determine seat status
      let status = SEAT_STATUS.AVAILABLE;
      
      if (blockedSeats && blockedSeats.includes(seatId)) {
        status = SEAT_STATUS.BLOCKED;
      } else if (occupiedSeatIndices.has(seatCounter)) {
        status = SEAT_STATUS.OCCUPIED;
      }
      
      rowData.seats.push({
        id: seatId,
        letter: seatLetter, // This is correct - using the actual letter from layout
        type: seatType,
        status,
        price: SEAT_PRICING[cabinClass][seatType] || 0
      });
      
      seatCounter++;
    }
    
    seatMap.rows.push(rowData);
  }
  
  return seatMap;
};

// Calculate seat price based on type, cabin class, and fare type
export const calculateSeatPrice = (seatType, cabinClass, fareTypeMultiplier = 1.0, businessFareType = null, firstClassFareType = null, premiumEconomyFareType = null) => {
  const basePrice = SEAT_PRICING[cabinClass]?.[seatType] || 0;
  
  // First Class fare-based pricing
  if (cabinClass === CABIN_CLASSES.FIRST && firstClassFareType) {
    const fareConfig = FIRST_CLASS_FARE_TYPES[firstClassFareType.toUpperCase()];
    if (fareConfig) {
      // Suite seats - only available for Suite fare type
      if (seatType === SEAT_TYPES.FIRST_SUITE) {
        return fareConfig.suiteAccess ? 0 : null; // null means unavailable
      }
      // All First Class seats are included in the fare
      return 0;
    }
  }
  
  // Business Class fare-based pricing
  if (cabinClass === CABIN_CLASSES.BUSINESS && businessFareType) {
    const fareConfig = BUSINESS_FARE_TYPES[businessFareType.toUpperCase()];
    if (fareConfig) {
      // Suite seats
      if (seatType === SEAT_TYPES.SUITE) {
        return fareConfig.suiteAccess ? 0 : basePrice;
      }
      // Extra privacy seats
      if (seatType === SEAT_TYPES.EXTRA_PRIVACY) {
        return fareConfig.premiumSeatCharge || 0;
      }
      // Standard business seats are usually included
      return 0;
    }
  }
  
  // Premium Economy fare-based pricing
  if (cabinClass === CABIN_CLASSES.PREMIUM_ECONOMY && premiumEconomyFareType) {
    const fareConfig = PREMIUM_ECONOMY_FARE_TYPES[premiumEconomyFareType.toUpperCase()];
    if (fareConfig) {
      // Apply fare type multiplier to base seat price
      return Math.round(basePrice * fareConfig.priceMultiplier);
    }
  }
  
  // Economy Class fare-based pricing (existing logic)
  if (cabinClass === CABIN_CLASSES.ECONOMY) {
    return Math.round(basePrice * fareTypeMultiplier);
  }
  
  return basePrice;
};

// Get seat type display name
export const getSeatTypeDisplayName = (seatType) => {
  const displayNames = {
    [SEAT_TYPES.WINDOW]: 'Window',
    [SEAT_TYPES.MIDDLE]: 'Middle',
    [SEAT_TYPES.AISLE]: 'Aisle',
    [SEAT_TYPES.PREMIUM]: 'Premium',
    [SEAT_TYPES.EMERGENCY]: 'Emergency Exit',
    [SEAT_TYPES.PREMIUM_ECONOMY_STANDARD]: 'Premium Economy',
    [SEAT_TYPES.PREMIUM_ECONOMY_EXTRA_LEGROOM]: 'Extra Legroom',
    [SEAT_TYPES.STANDARD_BIZ]: 'Standard Business',
    [SEAT_TYPES.LIE_FLAT]: 'Lie-Flat',
    [SEAT_TYPES.EXTRA_PRIVACY]: 'Extra Privacy',
    [SEAT_TYPES.SUITE]: 'Business Suite',
    [SEAT_TYPES.FIRST_STANDARD]: 'First Class',
    [SEAT_TYPES.FIRST_SUITE]: 'First Class Suite'
  };
  
  return displayNames[seatType] || seatType;
};

// Get seat status color
export const getSeatStatusColor = (status, isSelected = false) => {
  if (isSelected) return '#3b82f6'; // Blue for selected
  
  const colors = {
    [SEAT_STATUS.AVAILABLE]: '#10b981',   // Green for available
    [SEAT_STATUS.OCCUPIED]: '#6b7280',    // Dark Grey for occupied
    [SEAT_STATUS.BLOCKED]: '#ef4444',     // Red for unavailable/blocked
    [SEAT_STATUS.SELECTED]: '#3b82f6'     // Blue for selected
  };
  
  return colors[status] || '#e5e7eb';
};

// Validate seat selection for passengers
export const validateSeatSelection = (selectedSeats, passengers) => {
  const errors = [];
  
  // Handle both old array format and new object format
  const passengerList = Array.isArray(passengers) ? passengers : (passengers?.passengers || []);
  
  if (Object.keys(selectedSeats).length !== passengerList.length) {
    errors.push('Please select seats for all passengers');
  }
  
  // Check for duplicate seats
  const seatIds = Object.values(selectedSeats).map(seat => seat.id);
  const uniqueSeatIds = new Set(seatIds);
  
  if (seatIds.length !== uniqueSeatIds.size) {
    errors.push('Duplicate seats selected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get seat recommendations for keeping passengers together
export const getSeatRecommendations = (seatMap, passengerCount) => {
  const recommendations = [];
  
  for (const row of seatMap.rows) {
    const availableSeats = row.seats.filter(seat => 
      seat.id && seat.status === SEAT_STATUS.AVAILABLE
    );
    
    // Look for consecutive available seats
    for (let i = 0; i <= availableSeats.length - passengerCount; i++) {
      const consecutiveSeats = [];
      let consecutive = true;
      
      for (let j = 0; j < passengerCount; j++) {
        const currentSeat = availableSeats[i + j];
        if (!currentSeat) {
          consecutive = false;
          break;
        }
        consecutiveSeats.push(currentSeat);
      }
      
      if (consecutive && consecutiveSeats.length === passengerCount) {
        recommendations.push({
          rowNumber: row.rowNumber,
          seats: consecutiveSeats,
          totalPrice: consecutiveSeats.reduce((sum, seat) => sum + seat.price, 0)
        });
      }
    }
  }
  
  // Sort by total price (cheapest first)
  return recommendations.sort((a, b) => a.totalPrice - b.totalPrice);
};