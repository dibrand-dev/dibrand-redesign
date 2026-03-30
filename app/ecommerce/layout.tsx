import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "../globals.css";
import { GTMScript, GTMNoScript } from "@/components/analytics/GTM";
import Navbar from "@/components/layout/Navbar";
import LandingFooter from "@/components/LandingFooter";
import { getDictionary } from "@/lib/dictionaries";
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider";

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '600', '700', '800', '900']
});

const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: "E-Commerce de Escobar al País | Dibrand",
  description: "Creamos tiendas online de alto rendimiento. Especialistas en Tienda Nube, WooCommerce y Shopify desde Escobar.",
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
    <html lang={lang} className={`${montserrat.variable} ${lato.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <GTMScript />
      </head>
      <body className="font-lato antialiased pt-16 bg-[#F5F5F5]" suppressHydrationWarning>
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
