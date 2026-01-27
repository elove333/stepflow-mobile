/**
 * Validation utilities
 */

export const validators = {
  /**
   * Validates email format
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validates password strength
   * - Minimum 8 characters
   * - At least one letter and one number
   */
  password: (password: string): boolean => {
    if (password.length < 8) {
      return false;
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
  },

  /**
   * Validates phone number format
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  /**
   * Validates non-empty string
   */
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  /**
   * Validates minimum length
   */
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  /**
   * Validates maximum length
   */
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
};

export default validators;
