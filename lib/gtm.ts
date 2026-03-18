import { ArrowUpRight } from 'lucide-react';
import { supabase } from './supabase';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function pushDataLayer(event: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
}

/** CTA appointment click — main conversion event */
export async function trackAppointmentClick(buttonText: string) {
  pushDataLayer({
    event: 'cta_appointment_click',
    button_text: buttonText,
  });

  // Track in DB
  await supabase.from('analytics_events').insert({
    event_type: 'click',
    event_name: 'appointment_click',
    path: typeof window !== 'undefined' ? window.location.pathname : null,
    metadata: { button_text: buttonText }
  });
}

/** Successful contact form submission */
export async function trackContactFormSuccess() {
  pushDataLayer({
    event: 'form_submit_success',
    form_id: 'contact_form',
  });

  await supabase.from('analytics_events').insert({
    event_type: 'form_submit',
    event_name: 'contact_form_success',
    path: typeof window !== 'undefined' ? window.location.pathname : null,
  });
}

/** Successful job application form submission */
export async function trackJoinUsFormSuccess() {
  pushDataLayer({
    event: 'form_submit_success',
    form_id: 'join_us_form',
  });

  await supabase.from('analytics_events').insert({
    event_type: 'form_submit',
    event_name: 'join_us_form_success',
    path: typeof window !== 'undefined' ? window.location.pathname : null,
  });
}
