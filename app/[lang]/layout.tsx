import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import { GTMScript, GTMNoScript } from "@/components/analytics/GTM";
import Navbar from "@/components/layout/Navbar";
import { getDictionary } from "@/lib/dictionaries";

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
    title: isEs
      ? "Dibrand | Desarrollo de Software y Staff Augmentation"
      : "Dibrand | Software Development & Staff Augmentation",
    description: isEs
      ? "Dibrand es una empresa de desarrollo de software y staff augmentation que ayuda a startups a construir productos digitales de alto impacto."
      : "Dibrand is a software development and staff augmentation company helping startups build digital products.",
    alternates: {
      canonical: `https://dibrand.co/${lang}`,
      languages: {
        'en': 'https://dibrand.co/en',
        'es': 'https://dibrand.co/es',
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
              "@type": "SoftwareBusiness",
              "name": "Dibrand",
              "alternateName": "Dibrand Engineering",
              "url": "https://dibrand.co/",
              "logo": "https://dibrand.co/logo.png",
              "description": "Agencia boutique de ingeniería de software de élite. Especialistas en desarrollo de productos digitales, Staff Augmentation con el top 3% de talento de LATAM y flujos de trabajo potenciados por IA.",
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "1309 Coffen Ave STE 1200",
                  "addressLocality": "Sheridan",
                  "addressRegion": "WY",
                  "postalCode": "82801",
                  "addressCountry": "USA"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Avenida de los lagos 100, Puertos",
                  "addressLocality": "Belén de Escobar",
                  "addressRegion": "Buenos Aires",
                  "postalCode": "1625",
                  "addressCountry": "Argentina"
                }
              ],
              "knowsAbout": [
                "Software Development",
                "AI-Augmented Engineering",
                "Staff Augmentation",
                "Software Outsourcing",
                "Custom AI Workflows",
                "Strategic Architecture"
              ],
              "brand": {
                "@type": "Brand",
                "name": "Dibrand",
                "slogan": "Elite Talent Only"
              }
            })
          }}
        />
      </head>
      <body className="font-sans antialiased pt-16 landing-page" suppressHydrationWarning>
        <GTMNoScript />
        <Navbar dict={dict} lang={lang} />
        <div className="flex min-h-screen flex-col bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
