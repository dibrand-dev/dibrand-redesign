import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import { GTMScript, GTMNoScript } from "@/components/analytics/GTM";
import Navbar from "@/components/layout/Navbar";
import { getDictionary } from "@/lib/dictionaries";
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === 'es';

  return {
    metadataBase: new URL("https://www.dibrand.co"),
    title: isEs
      ? "Dibrand | Desarrollo de Software y Staff Augmentation"
      : "Dibrand | Software Development & Staff Augmentation",
    description: isEs
      ? "Dibrand es una empresa de desarrollo de software y staff augmentation que ayuda a startups a construir productos digitales de alto impacto."
      : "Dibrand is a software development and staff augmentation company helping startups build digital products.",
    alternates: {
      canonical: 'https://www.dibrand.co/',
      languages: {
        'en': 'https://www.dibrand.co/en',
        'es': 'https://www.dibrand.co/es',
      },
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "es");

  return (
    <html lang={lang} className={`${outfit.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <GTMScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "ProfessionalService",
                  "@id": "https://www.dibrand.co/#organization",
                  "name": "Dibrand",
                  "url": "https://www.dibrand.co/",
                  "logo": "https://www.dibrand.co/logo.png", 
                  "description": "Agencia global de ingeniería de software especializada en el desarrollo a medida de aplicaciones web y móviles de alta complejidad. Expertos en Software Outsourcing y Staff Augmentation desde el hub tecnológico Flytech en Escobar, Argentina.",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Belén de Escobar",
                    "addressRegion": "Buenos Aires",
                    "addressCountry": "AR",
                    "streetAddress": "Puertos del Lago"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "-34.3475",
                    "longitude": "-58.7914"
                  },
                  "memberOf": {
                    "@type": "Organization",
                    "name": "Polo Tecnológico de Escobar Flytech",
                    "url": "https://flytech.escobar.gob.ar/" 
                  },
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Servicios de Dibrand",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Desarrollo de Software a Medida",
                          "description": "Diseño y construcción de aplicaciones web y móviles personalizadas escalables."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Software Outsourcing",
                          "description": "Gestión integral de proyectos de desarrollo con equipos dedicados de ingeniería."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Staff Augmentation",
                          "description": "Integración de talento técnico senior para escalar capacidades de desarrollo internas."
                        }
                      }
                    ]
                  },
                  "sameAs": [
                    "https://www.linkedin.com/company/dibrand/",
                    "https://www.facebook.com/dibrand.ok",
                    "https://www.instagram.com/dibrand.ok/",
                    "https://x.com/Dibrand_ok",
                    "https://maps.app.goo.gl/ds8jGdsN1Cri5CTL6"
                  ]
                },
                {
                  "@type": "Organization",
                  "name": "Dibrand LLC",
                  "legalName": "Dibrand LLC",
                  "address": {
                    "@type": "PostalAddress",
                    "addressRegion": "Wyoming",
                    "addressCountry": "US"
                  },
                  "parentOrganization": {
                    "@id": "https://www.dibrand.co/#organization"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased pt-16 landing-page" suppressHydrationWarning>
        <GTMNoScript />
        <Navbar dict={dict} lang={lang} />
        <div className="flex min-h-screen flex-col bg-white">
          <RecaptchaProvider>
            {children}
          </RecaptchaProvider>
        </div>
      </body>
    </html>
  );
}
