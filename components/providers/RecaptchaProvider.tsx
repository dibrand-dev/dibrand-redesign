'use client';

import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isValid = siteKey && siteKey.length > 5 && siteKey !== 'DUMMY_KEY_FOR_CONTEXT_ONLY';

  // IMPORTANTE: Siempre debemos retornar el Provider para que useGoogleReCaptcha no rompa React en sus hijos.
  // Sin el Provider en el árbol, el hook useGoogleReCaptcha() lanza una excepción fatal que rompe el Render (SSR).
  // Usamos 'DUMMY_KEY' como fallback para asegurar que el prop no sea vacío, lo cual a veces causa errores estructurales.
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={isValid ? siteKey : 'DUMMY_KEY'}
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
