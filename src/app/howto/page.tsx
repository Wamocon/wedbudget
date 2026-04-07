import type { Metadata } from 'next';
import HowToPage from '@/components/howto-page';

export const metadata: Metadata = {
  title: 'How-To – WedBudget Benutzerhandbuch',
  description:
    'Alle WedBudget-Funktionen erklärt: vom Onboarding über Dashboard-Kennzahlen bis zu Export und PDF.',
};

export default function HowTo() {
  return <HowToPage />;
}
