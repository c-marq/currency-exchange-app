import { useState, useEffect } from 'react';
import { ArrowRightLeft, Loader2, AlertCircle } from 'lucide-react';
import { getLatestRates } from '../services/api';
import { MAJOR_CURRENCIES, getCurrencySymbol, getCurrencyName, formatNumber } from '../utils/constants';

function CurrencyConverter({ baseCurrency, refreshKey }) {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState(baseCurrency);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFromCurrency(baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const targetCurrencies = MAJOR_CURRENCIES.filter(c => c !== fromCurrency);
        const data = await getLatestRates(fromCurrency, targetCurrencies);
        setRates(data.rates || {});
      } catch (err) {
        setError('Failed to fetch conversion rates.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, refreshKey]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSwap = () => {
    // Swap to the first available currency in rates
    const firstCurrency = Object.keys(rates)[0];
    if (firstCurrency) {
      setFromCurrency(firstCurrency);
    }
  };

  const numericAmount = parseFloat(amount) || 0;

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Currency Converter</h2>
      
      <div className="space-y-4">
        {/* Input Section */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="convertAmount" className="block text-sm font-medium text-slate-700 mb-2">
                Amount
              </label>
              <input
                type="text"
                id="convertAmount"
                name="convertAmount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="input-field w-full"
              />
            </div>
            <div className="w-32">
              <label htmlFor="fromCurrency" className="block text-sm font-medium text-slate-700 mb-2">
                Currency
              </label>
              <select
                id="fromCurrency"
                name="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="select-field w-full"
              >
                {MAJOR_CURRENCIES.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 bg-primary-100 hover:bg-primary-200 rounded-full transition-colors"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-5 h-5 text-primary-700" />
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-2">
          <div className="block text-sm font-medium text-slate-700 mb-2">
            Converted to:
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(rates).map(([currency, rate]) => {
                const convertedAmount = numericAmount * rate;
                
                return (
                  <div 
                    key={currency}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {getCurrencySymbol(currency)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{currency}</div>
                        <div className="text-xs text-slate-600">{getCurrencyName(currency)}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-slate-800">
                        {getCurrencySymbol(currency)}{formatNumber(convertedAmount)}
                      </div>
                      <div className="text-xs text-slate-600">
                        Rate: {formatNumber(rate, 4)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CurrencyConverter;
