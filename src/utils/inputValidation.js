// Basic client-side input validation utilities

// Allow only alphabets and spaces
export const handleAlphabetsOnly = (value) => {
  return value.replace(/[^a-zA-Z\s]/g, '');
};

// Allow only digits
export const handleDigitsOnly = (value) => {
  return value.replace(/[^0-9]/g, '');
};

// Limit phone number to 10 digits
export const handlePhoneInput = (value) => {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  return digitsOnly.slice(0, 10);
};

// Basic email format check
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if value is numeric and within range
export const isValidAge = (age) => {
  const numAge = parseInt(age);
  return !isNaN(numAge) && numAge >= 0 && numAge <= 100;
};

// Check password minimum length
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Check if passwords match
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};
