'use client';

import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Si no hay llave, entregamos el Provider de todas formas con una llave vacía
  // para que useGoogleReCaptcha() no rompa el contexto de React,
  // pero omitimos configuraciones que pudieran forzar la carga.
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey || 'DUMMY_KEY_TO_PREVENT_CRASH'}
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
