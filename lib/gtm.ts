/**
 * GTM dataLayer utility
 * Use this to push events to Google Tag Manager from anywhere in the app.
 */

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
export function trackAppointmentClick(buttonText: string) {
  pushDataLayer({
    event: 'cta_appointment_click',
    button_text: buttonText,
  });
}

/** Successful contact form submission */
export function trackContactFormSuccess() {
  pushDataLayer({
    event: 'form_submit_success',
    form_id: 'contact_form',
  });
}

/** Successful job application form submission */
export function trackJoinUsFormSuccess() {
  pushDataLayer({
    event: 'form_submit_success',
    form_id: 'join_us_form',
  });
}
