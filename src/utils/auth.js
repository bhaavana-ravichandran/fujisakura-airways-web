// Frontend-only authentication state management
class AuthManager {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.listeners = [];
  }

  // Check if user is authenticated
  isLoggedIn() {
    // Check localStorage for persistent auth state
    if (typeof window !== 'undefined') {
      const authState = localStorage.getItem('fujisakura_auth');
      if (authState) {
        const { isAuthenticated, user } = JSON.parse(authState);
        this.isAuthenticated = isAuthenticated;
        this.user = user;
        return isAuthenticated;
      }
    }
    return this.isAuthenticated;
  }

  // Sign in user
  signIn(userData) {
    this.isAuthenticated = true;
    this.user = userData;
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('fujisakura_auth', JSON.stringify({
        isAuthenticated: true,
        user: userData,
        timestamp: Date.now()
      }));
    }
    
    // Notify listeners
    this.notifyListeners();
  }

  // Sign out user
  signOut() {
    this.isAuthenticated = false;
    this.user = null;
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fujisakura_auth');
    }
    
    // Notify listeners
    this.notifyListeners();
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Add listener for auth state changes
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners of auth state change
  notifyListeners() {
    this.listeners.forEach(callback => callback({
      isAuthenticated: this.isAuthenticated,
      user: this.user
    }));
  }
}

// Create singleton instance
const authManager = new AuthManager();

export default authManager;