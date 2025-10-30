// Major currencies to display
export const MAJOR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF'];

// Currency symbols mapping
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CHF: 'Fr',
  AUD: 'A$',
  CAD: 'C$',
  CNY: '¥',
  INR: '₹',
  MXN: '$',
  NZD: 'NZ$',
  SEK: 'kr',
  SGD: 'S$',
  HKD: 'HK$',
  NOK: 'kr',
  KRW: '₩',
  TRY: '₺',
  RUB: '₽',
  BRL: 'R$',
  ZAR: 'R',
  GTQ: 'Q'
};

// Currency names mapping
export const CURRENCY_NAMES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CHF: 'Swiss Franc',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  MXN: 'Mexican Peso',
  NZD: 'New Zealand Dollar',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  NOK: 'Norwegian Krone',
  KRW: 'South Korean Won',
  TRY: 'Turkish Lira',
  RUB: 'Russian Ruble',
  BRL: 'Brazilian Real',
  ZAR: 'South African Rand',
  GTQ: 'Guatemalan Quetzal'
};

// Get currency symbol with fallback
export const getCurrencySymbol = (code) => {
  return CURRENCY_SYMBOLS[code] || code;
};

// Get currency name with fallback
export const getCurrencyName = (code) => {
  return CURRENCY_NAMES[code] || code;
};

// Format currency value
export const formatCurrency = (value, currencyCode, decimals = 2) => {
  const symbol = getCurrencySymbol(currencyCode);
  const formatted = Number(value).toFixed(decimals);
  
  // For currencies that typically don't use decimals
  if (['JPY', 'KRW'].includes(currencyCode)) {
    return `${symbol}${Number(value).toFixed(0)}`;
  }
  
  return `${symbol}${formatted}`;
};

// Format large numbers with commas
export const formatNumber = (value, decimals = 2) => {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};
