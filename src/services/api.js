import axios from 'axios';

const BASE_URL = 'https://api.frankfurter.app';

/**
 * Get latest exchange rates for a base currency
 * @param {string} base - Base currency code (e.g., 'USD')
 * @param {string[]} symbols - Array of currency codes to get rates for
 * @returns {Promise} API response with rates
 */
export const getLatestRates = async (base = 'USD', symbols = []) => {
  try {
    const params = { from: base };
    if (symbols.length > 0) {
      params.to = symbols.join(',');
    }
    const response = await axios.get(`${BASE_URL}/latest`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest rates:', error);
    throw error;
  }
};

/**
 * Get historical exchange rates for a date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} base - Base currency code
 * @param {string[]} symbols - Array of currency codes
 * @returns {Promise} API response with historical rates
 */
export const getHistoricalRates = async (startDate, endDate, base = 'USD', symbols = []) => {
  try {
    const params = { from: base };
    if (symbols.length > 0) {
      params.to = symbols.join(',');
    }
    const response = await axios.get(`${BASE_URL}/${startDate}..${endDate}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    throw error;
  }
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @returns {Promise} API response with conversion result
 */
export const convertCurrency = async (amount, from, to) => {
  try {
    const response = await axios.get(`${BASE_URL}/latest`, {
      params: { amount, from, to }
    });
    return response.data;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
};

/**
 * Get all available currencies
 * @returns {Promise} API response with currency list
 */
export const getCurrencies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/currencies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

/**
 * Helper function to format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get date 30 days ago
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getDate30DaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return formatDate(date);
};

/**
 * Get today's date
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getToday = () => {
  return formatDate(new Date());
};
