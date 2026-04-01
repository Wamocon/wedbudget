'use client';

import { useEffect, useState } from 'react';
import LandingPage from '@/components/landing-page';
import Calculator from '@/components/calculator';
import { loadFromUrl } from '@/lib/storage';
import { getDefaultData } from '@/lib/domain';
import type { PlanningData } from '@/lib/types';

type Page = 'landing' | 'calculator';

// Lazy initializers run client-side only after hydration
function getInitialData(): PlanningData {
  if (typeof window === 'undefined') return getDefaultData();
  return loadFromUrl() ?? getDefaultData();
}

function getInitialPage(): Page {
  if (typeof window === 'undefined') return 'landing';
  return new URLSearchParams(window.location.search).has('data') ? 'calculator' : 'landing';
}

export default function AppShell() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const [appData, setAppData] = useState<PlanningData>(getInitialData);

  // Clean up the URL after loading URL-shared data — no state mutation here
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('data')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleStart = (data?: PlanningData) => {
    if (data) setAppData(data);
    else setAppData(getDefaultData());
    setPage('calculator');
  };

  const handleBack = () => {
    setPage('landing');
  };

  if (page === 'calculator') {
    return <Calculator initialData={appData} onBack={handleBack} />;
  }

  return <LandingPage onStart={handleStart} />;
}
