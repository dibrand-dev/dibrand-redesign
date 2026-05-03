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
              "@type": "ProfessionalService",
              "name": "Dibrand",
              "url": "https://www.dibrand.co/",
              "logo": "https://www.dibrand.co/logo_dibrand.png",
              "image": "https://www.dibrand.co/oficina-dibrand.png",
              "description": "Agencia de tecnología y Staff Augmentation impulsada por IA, especializada en desarrollo de software, MVPs y agentes de IA para startups y empresas globales.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Escobar",
                "addressRegion": "Buenos Aires",
                "addressCountry": "AR"
              },
              "sameAs": [
                "https://www.linkedin.com/company/dibrand/",
                "https://x.com/Dibrand_ok",
                "https://www.instagram.com/dibrand.ok/",
                "https://github.com/dibrand",
                "https://clutch.co/profile/dibrand"
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "email": "sales@dibrand.co",
                  "contactType": "sales",
                  "areaServed": "Global",
                  "availableLanguage": ["Spanish", "English"]
                },
                {
                  "@type": "ContactPoint",
                  "email": "hello@dibrand.co",
                  "contactType": "general inquiry"
                }
              ],
              "knowsAbout": [
                "Artificial Intelligence",
                "Staff Augmentation",
                "Software Development",
                "Generative AI",
                "Mobile Applications",
                "UX/UI Design"
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
