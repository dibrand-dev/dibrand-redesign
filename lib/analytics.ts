'use client';

import { supabase } from '@/lib/supabase';

/**
 * Tracks an event to Supabase analytics_events table
 */
export async function trackEvent(name: string, type: 'page_view' | 'click' = 'click', metadata: any = {}) {
  try {
    const { error } = await supabase.from('analytics_events').insert({
      event_name: name,
      event_type: type,
      path: typeof window !== 'undefined' ? window.location.pathname : null,
      metadata: metadata,
    });

    if (error) console.error('Error tracking event:', error.message, error.details, error.hint);
  } catch (err) {
    console.error('Failed to track event:', err);
  }
}

/**
 * Specifically tracks appointment clicks
 */
export function trackAppointmentClick(label: string) {
  return trackEvent('appointment_click', 'click', { label });
}

/**
 * Specifically tracks portfolio views
 */
export function trackPortfolioView() {
  return trackEvent('portfolio_view', 'page_view');
}
