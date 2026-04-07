'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Calculator from '@/components/calculator';
import OnboardingSurvey from '@/components/onboarding-survey';
import { getDefaultData } from '@/lib/domain';
import { loadFromLocal, loadFromUrl, saveToLocal } from '@/lib/storage';
import type { PlanningData } from '@/lib/types';

interface PlanClientProps {
  isFresh: boolean;
  mode: 'basics' | 'dashboard';
}

export default function PlanClient({ isFresh, mode }: PlanClientProps) {
  const router = useRouter();
  const [onboardingResult, setOnboardingResult] = useState<PlanningData | null>(null);
  const [incomingData, setIncomingData] = useState<PlanningData | null>(null);

  const initialTab: 'basics' | 'dashboard' = onboardingResult ? 'basics' : mode;

  useEffect(() => {
    const fromUrl = loadFromUrl();
    if (fromUrl) {
      queueMicrotask(() => setIncomingData(fromUrl));
      return;
    }

    const fromLocal = loadFromLocal();
    if (fromLocal) {
      queueMicrotask(() => setIncomingData(fromLocal));
      return;
    }

    if (isFresh) {
      queueMicrotask(() => setIncomingData(getDefaultData()));
      return;
    }

    queueMicrotask(() => setIncomingData(getDefaultData()));
  }, [isFresh]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const hadTransientParams =
      url.searchParams.has('data') ||
      url.searchParams.has('fresh') ||
      url.searchParams.has('mode');

    if (!hadTransientParams) return;

    url.searchParams.delete('data');
    url.searchParams.delete('fresh');
    url.searchParams.delete('mode');

    const remaining = url.searchParams.toString();
    window.history.replaceState({}, document.title, `${url.pathname}${remaining ? `?${remaining}` : ''}`);
  }, []);

  if (!incomingData) {
    return null;
  }

  if (isFresh && !onboardingResult) {
    return (
      <OnboardingSurvey
        initialData={incomingData}
        onBack={() => router.push('/')}
        onComplete={(nextData) => {
          const { version, ...withoutVersion } = nextData;
          void version;
          saveToLocal(withoutVersion);
          setOnboardingResult(nextData);
        }}
      />
    );
  }

  const calculatorData = onboardingResult ?? incomingData;

  return (
    <Calculator
      initialData={calculatorData}
      initialTab={initialTab}
      onBack={() => router.push('/')}
    />
  );
}
