// Authentication utility functions for Remember Me functionality
export const authUtils = {
  // Check if there's valid remember me data
  getRememberMeData: () => {
    try {
      const rememberMeData = localStorage.getItem('rememberMe');
      if (!rememberMeData) return null;

      const parsed = JSON.parse(rememberMeData);
      const now = Date.now();

      // Check if the remember me data is still valid (within 7 days)
      if (parsed.expiration && parsed.expiration > now) {
        // Restore the token if it exists
        if (parsed.token) {
          localStorage.setItem('developerToken', parsed.token);
        }
        return parsed.user;
      } else {
        // Data has expired, remove it
        localStorage.removeItem('rememberMe');
        return null;
      }
    } catch (error) {
      console.error('Error parsing remember me data:', error);
      localStorage.removeItem('rememberMe');
      return null;
    }
  },

  // Clear remember me data (used on logout)
  clearRememberMeData: () => {
    localStorage.removeItem('rememberMe');
  },

  // Check if remember me is active
  isRememberMeActive: () => {
    const data = localStorage.getItem('rememberMe');
    if (!data) return false;

    try {
      const parsed = JSON.parse(data);
      return parsed.expiration && parsed.expiration > Date.now();
    } catch {
      return false;
    }
  }
};
