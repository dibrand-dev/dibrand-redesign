import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import { GTMScript, GTMNoScript } from "@/components/analytics/GTM";
import Navbar from "@/components/layout/Navbar";
import LandingFooter from "@/components/LandingFooter";
import { getDictionary } from "@/lib/dictionaries";
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dibrand.co"),
  title: "E-Commerce de Escobar al País | Dibrand",
  description: "Creamos tiendas online de alto rendimiento. Especialistas en Tienda Nube, WooCommerce y Shopify desde Escobar.",
  alternates: {
    canonical: 'https://www.dibrand.co/',
  },
};

export default async function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default to 'es' for this specific landing/market focus
  const lang = "es";
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className={`${outfit.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <GTMScript />
      </head>
      <body className="font-sans antialiased pt-16 bg-[#F5F5F5]" suppressHydrationWarning>
        <GTMNoScript />
        <Navbar dict={dict} lang={lang} />
        <div className="flex min-h-screen flex-col">
          <RecaptchaProvider>
            {children}
          </RecaptchaProvider>
        </div>
        <LandingFooter />
      </body>
    </html>
  );
}
