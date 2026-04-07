"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/landing-page';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      router.replace(`/plan?data=${encodeURIComponent(data)}`);
    }
  }, [router]);

  return <LandingPage />;
}
