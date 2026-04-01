import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import Calculator from './Calculator';
import { loadFromUrl, loadFromLocal, getDefaultData } from './storage';
import { LanguageProvider } from './LanguageContext';
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    // 1. Check URL first for shared data link
    const urlData = loadFromUrl();
    if (urlData) {
      setAppData(urlData);
      setCurrentPage('calculator');
      // Clean up the long URL string in the address bar silently
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleStart = (action, loadedData = null) => {
    if (action === 'new') {
      setAppData(getDefaultData());
    } else if (action === 'continue') {
      setAppData(loadFromLocal() || getDefaultData());
    } else if (action === 'import' && loadedData) {
      setAppData(loadedData);
    }
    setCurrentPage('calculator');
  };

  return (
    <LanguageProvider>
      <>
        {currentPage === 'landing' ? (
          <LandingPage onStart={handleStart} />
        ) : (
          <Calculator
            initialData={appData}
            onBack={() => setCurrentPage('landing')}
          />
        )}
      </>
    </LanguageProvider>
  );
}
