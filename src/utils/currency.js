// Currency utility for consistent handling across the application

export const CURRENCY_CONFIG = {
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee'
};

/**
 * Format price with currency symbol
 * @param {number|string} amount - The price amount
 * @param {object} currency - Currency configuration (optional, defaults to INR)
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, currency = CURRENCY_CONFIG) => {
  const numericAmount = parseFloat(amount) || 0;
  return `${currency.symbol}${numericAmount.toLocaleString('en-IN')}`;
};

/**
 * Create standardized pricing structure
 * @param {number|string} baseAmount - Base price amount
 * @param {object} currency - Currency configuration (optional, defaults to INR)
 * @returns {object} Standardized pricing object
 */
export const createPricing = (baseAmount, currency = CURRENCY_CONFIG) => {
  const amount = parseFloat(baseAmount) || 0;
  const taxes = Math.round(amount * 0.18); // 18% tax
  const total = amount + taxes;
  
  return {
    base: {
      amount: amount,
      currency: currency.code,
      symbol: currency.symbol,
      formatted: formatPrice(amount, currency)
    },
    taxes: {
      amount: taxes,
      currency: currency.code,
      symbol: currency.symbol,
      formatted: formatPrice(taxes, currency)
    },
    total: {
      amount: total,
      currency: currency.code,
      symbol: currency.symbol,
      formatted: formatPrice(total, currency)
    },
    currency: currency
  };
};

/**
 * Get currency configuration from stored data or default
 * @param {object} storedData - Data from localStorage
 * @returns {object} Currency configuration
 */
export const getCurrencyFromData = (storedData) => {
  if (storedData && storedData.pricing && storedData.pricing.currency) {
    return storedData.pricing.currency;
  }
  return CURRENCY_CONFIG;
};

/**
 * Update flight data with standardized pricing
 * @param {object} flightData - Original flight data
 * @returns {object} Flight data with standardized pricing
 */
export const standardizeFlightPricing = (flightData) => {
  if (!flightData) return null;
  
  const basePrice = parseFloat(flightData.finalPrice || flightData.price || 0);
  const pricing = createPricing(basePrice);
  
  return {
    ...flightData,
    pricing: pricing,
    // Keep original price for backward compatibility
    finalPrice: basePrice,
    price: basePrice
  };
};