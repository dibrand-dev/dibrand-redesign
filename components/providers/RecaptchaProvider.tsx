'use client';

import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isValid = siteKey && siteKey.length > 5 && siteKey !== 'DUMMY_KEY_FOR_CONTEXT_ONLY';

  // Siempre debemos retornar el Provider para que useGoogleReCaptcha no rompa React en sus hijos.
  // Si falta la llave, pasamos una vacía para que no se vea el placeholder gritando en la consola.
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={isValid ? siteKey : ''}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
