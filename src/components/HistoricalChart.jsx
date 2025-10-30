import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, AlertCircle, Calendar } from 'lucide-react';
import { getHistoricalRates, getDate30DaysAgo, getToday } from '../services/api';
import { MAJOR_CURRENCIES, getCurrencyName } from '../utils/constants';

function HistoricalChart({ baseCurrency, refreshKey }) {
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [datePreset, setDatePreset] = useState('30');

  useEffect(() => {
    // Set default selected currency to first available that's not the base
    const defaultCurrency = MAJOR_CURRENCIES.find(c => c !== baseCurrency) || 'EUR';
    setSelectedCurrency(defaultCurrency);
  }, [baseCurrency]);

  // Calculate date range based on preset or custom dates
  const getDateRangeFromPreset = (preset) => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch(preset) {
      case '7':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '365':
        startDate.setDate(endDate.getDate() - 365);
        break;
      case 'custom':
        return null; // Will use custom dates
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let startDate, endDate;
        
        if (datePreset === 'custom') {
          if (!customStartDate || !customEndDate) {
            setError('Please select both start and end dates.');
            setLoading(false);
            return;
          }
          startDate = customStartDate;
          endDate = customEndDate;
          
          // Validate date range
          if (new Date(startDate) > new Date(endDate)) {
            setError('Start date must be before end date.');
            setLoading(false);
            return;
          }
        } else {
          const dates = getDateRangeFromPreset(datePreset);
          startDate = dates.start;
          endDate = dates.end;
        }
        
        setDateRange({ start: startDate, end: endDate });
        
        const data = await getHistoricalRates(
          startDate,
          endDate,
          baseCurrency,
          [selectedCurrency]
        );
        
        // Transform data for recharts
        const formattedData = Object.entries(data.rates || {}).map(([date, rates]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: date,
          rate: rates[selectedCurrency] || 0,
        }));
        
        setChartData(formattedData);
      } catch (err) {
        setError('Failed to fetch historical data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [baseCurrency, selectedCurrency, refreshKey, datePreset, customStartDate, customEndDate]);

  const availableCurrencies = MAJOR_CURRENCIES.filter(c => c !== baseCurrency);

  // Calculate statistics
  const rates = chartData.map(d => d.rate);
  const minRate = rates.length > 0 ? Math.min(...rates) : 0;
  const maxRate = rates.length > 0 ? Math.max(...rates) : 0;
  const avgRate = rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
  const change = rates.length > 1 ? ((rates[rates.length - 1] - rates[0]) / rates[0]) * 100 : 0;
  
  // Calculate number of days in range
  const daysDiff = dateRange.start && dateRange.end 
    ? Math.ceil((new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="card">
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Historical Trends</h2>
            <p className="text-sm text-slate-600 mt-1">
              {dateRange.start && dateRange.end && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
                  <span className="text-slate-400">({daysDiff} days)</span>
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="chartCurrency" className="text-sm font-medium text-slate-700 whitespace-nowrap">
              Compare to:
            </label>
            <select
              id="chartCurrency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="select-field"
            >
              {availableCurrencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency} - {getCurrencyName(currency)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Date Range Controls */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="datePreset" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Time Period:
              </label>
              <select
                id="datePreset"
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
                className="select-field"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            {datePreset === 'custom' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <label htmlFor="startDate" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    From:
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    max={getToday()}
                    className="input-field"
                  />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <label htmlFor="endDate" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    To:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    max={getToday()}
                    className="input-field"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-xs text-slate-600 mb-1">Current Rate</div>
              <div className="text-lg font-bold text-slate-800">
                {rates[rates.length - 1]?.toFixed(4) || 'N/A'}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-xs text-slate-600 mb-1">Period Change</div>
              <div className={`text-lg font-bold ${change >= 0 ? 'text-success-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)}%
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-xs text-slate-600 mb-1">Highest</div>
              <div className="text-lg font-bold text-slate-800">
                {maxRate.toFixed(4)}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-xs text-slate-600 mb-1">Lowest</div>
              <div className="text-lg font-bold text-slate-800">
                {minRate.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => value.toFixed(4)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value) => [value.toFixed(4), `${baseCurrency} to ${selectedCurrency}`]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '14px' }}
                  formatter={() => `1 ${baseCurrency} = ${selectedCurrency}`}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default HistoricalChart;
