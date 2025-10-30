import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import Header from './components/Header';
import CurrentRates from './components/CurrentRates';
import CurrencyConverter from './components/CurrencyConverter';
import HistoricalChart from './components/HistoricalChart';
import { MAJOR_CURRENCIES } from './utils/constants';

function App() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setLastUpdated(new Date());
  };

  const handleBaseCurrencyChange = (newBase) => {
    setBaseCurrency(newBase);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header 
        baseCurrency={baseCurrency}
        onBaseCurrencyChange={handleBaseCurrencyChange}
        onRefresh={handleRefresh}
        lastUpdated={lastUpdated}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Current Rates Card */}
          <CurrentRates 
            baseCurrency={baseCurrency}
            refreshKey={refreshKey}
          />
          
          {/* Currency Converter Card */}
          <CurrencyConverter 
            baseCurrency={baseCurrency}
            refreshKey={refreshKey}
          />
        </div>
        
        {/* Historical Chart Card */}
        <HistoricalChart 
          baseCurrency={baseCurrency}
          refreshKey={refreshKey}
        />
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          <p>
            Data provided by{' '}
            <a 
              href="https://www.frankfurter.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Frankfurter API
            </a>
            {' '}• Exchange rates updated daily
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
