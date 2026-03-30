'use client';

import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // IMPORTANTE: Siempre debemos retornar el Provider para que useGoogleReCaptcha no rompa React en producción.
  // Si falta la llave, GoogleReCaptchaProvider internamente manejará el error de llave inválida,
  // pero mantendrá vivo el contexto de React para que el formulario pueda seguir operando.
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey || 'DUMMY_KEY_FOR_CONTEXT_ONLY'}
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
