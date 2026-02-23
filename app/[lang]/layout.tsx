import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dibrand",
  description: "Technological partner for startups.",
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }]
}

import Navbar from "@/components/layout/Navbar";
import { getDictionary } from "@/lib/dictionaries";

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
    <html lang={lang} className="scroll-smooth">
      <body
        className={`${outfit.variable} font-sans antialiased pt-16`}
      >
        <Navbar dict={dict} lang={lang} />
        {children}
      </body>
    </html>
  );
}
