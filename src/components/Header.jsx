import { TrendingUp, RefreshCw } from 'lucide-react';
import { MAJOR_CURRENCIES, getCurrencyName } from '../utils/constants';

function Header({ baseCurrency, onBaseCurrencyChange, onRefresh, lastUpdated }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Currency Exchange Tracker</h1>
              <p className="text-primary-100 text-sm">Real-time rates and conversions</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="baseCurrency" className="text-sm font-medium whitespace-nowrap">
                Base Currency:
              </label>
              <select
                id="baseCurrency"
                value={baseCurrency}
                onChange={(e) => onBaseCurrencyChange(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none cursor-pointer backdrop-blur-sm"
              >
                {MAJOR_CURRENCIES.map(currency => (
                  <option key={currency} value={currency} className="text-slate-900">
                    {currency} - {getCurrencyName(currency)}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
            
            <div className="text-xs text-primary-100">
              Updated: {formatTime(lastUpdated)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
