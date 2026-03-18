'use client';

import { useEffect } from 'react';
import { trackPortfolioView } from '@/lib/analytics';

export default function PortfolioTracker() {
  useEffect(() => {
    trackPortfolioView();
  }, []);

  return null;
}
