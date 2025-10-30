# Currency Exchange Tracker

A professional React application for tracking real-time currency exchange rates, performing conversions, and viewing historical trends.

## Features

- **Real-time Exchange Rates**: Display current rates for major currencies (USD, EUR, GBP, JPY, CHF)
- **Currency Conversion Tool**: Convert amounts across multiple currencies simultaneously
- **Historical Charts**: View 30-day trends for selected currency pairs
- **Base Currency Selection**: Switch between different base currencies
- **Responsive Design**: Optimized for both mobile and desktop devices
- **Professional UI**: Clean design with trust-inspiring blue and green color palette

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Recharts (for data visualization)
- Axios (for API calls)
- Lucide React (for icons)
- Frankfurter API (free exchange rate data)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API

This application uses the [Frankfurter API](https://www.frankfurter.app/) - a free, open-source API for current and historical foreign exchange rates.

## Target Users

- Business professionals tracking international transactions
- Frequent travelers planning trips
- Anyone needing quick, reliable exchange rate information

## Deployment to Netlify

This project is configured for easy deployment to Netlify.

### Option 1: Manual Deploy via Netlify UI

1. **Build the project locally:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [Netlify](https://app.netlify.com/)
   - Drag and drop the `dist` folder to deploy

### Option 2: Deploy from GitHub

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to Netlify"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will automatically detect the build settings from `netlify.toml`

### Build Settings (Auto-configured)

The `netlify.toml` file includes:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18
- **SPA redirect rules** for client-side routing
- **Security headers** for production
- **Cache optimization** for static assets

### Environment Variables

No environment variables are required for this project as it uses the free Frankfurter API.

## Project Structure

```
currency-exchange-app/
├── public/
│   ├── favicon.svg          # App favicon
│   └── _redirects           # Netlify SPA redirect rules
├── src/
│   ├── components/          # React components
│   │   ├── CurrencyConverter.jsx
│   │   ├── CurrentRates.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Header.jsx
│   │   └── HistoricalChart.jsx
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── utils/
│   │   └── constants.js     # App constants and utilities
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── netlify.toml             # Netlify configuration
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Project dependencies
