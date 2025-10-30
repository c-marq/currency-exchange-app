import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';
import { getLatestRates } from '../services/api';
import { MAJOR_CURRENCIES, getCurrencySymbol, getCurrencyName, formatNumber } from '../utils/constants';

function CurrentRates({ baseCurrency, refreshKey }) {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get currencies to display (exclude the base currency)
        const targetCurrencies = MAJOR_CURRENCIES.filter(c => c !== baseCurrency);
        const data = await getLatestRates(baseCurrency, targetCurrencies);
        setRates(data.rates || {});
      } catch (err) {
        setError('Failed to fetch exchange rates. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency, refreshKey]);

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Current Exchange Rates</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Current Exchange Rates</h2>
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Current Exchange Rates</h2>
        <div className="text-sm text-slate-600">
          1 {baseCurrency} =
        </div>
      </div>
      
      <div className="space-y-3">
        {Object.entries(rates).map(([currency, rate]) => {
          const change = Math.random() * 2 - 1; // Simulated change percentage
          const isPositive = change >= 0;
          
          return (
            <div 
              key={currency}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {getCurrencySymbol(currency)}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{currency}</div>
                  <div className="text-sm text-slate-600">{getCurrencyName(currency)}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-slate-800">
                  {formatNumber(rate, 4)}
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(change).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {Object.keys(rates).length === 0 && (
        <div className="text-center py-8 text-slate-600">
          No exchange rates available
        </div>
      )}
    </div>
  );
}

export default CurrentRates;
