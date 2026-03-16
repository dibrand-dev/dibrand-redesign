// 0. Force dynamic rendering for randomness and real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getDictionary } from "@/lib/dictionaries";
import HeroSection from "@/components/home/HeroSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import TechStack from "@/components/home/TechStack";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import StaffAugmentationTeaser from "@/components/home/StaffAugmentationTeaser";
import EngineeringExcellence from "@/components/home/EngineeringExcellence";
import SelectedWork from "@/components/home/SelectedWork";
import ComplianceSection from "@/components/home/ComplianceSection";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/layout/Footer";

export default async function Home(props: { params: Promise<{ lang: "en" | "es" }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  // 1. Fetch Testimonials
  const { data: rawTestimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: true });

  const testimonials = (rawTestimonials || []).map((t: any) => ({
    id: t.id,
    name: t.author_name,
    role_es: t.role_es,
    role_en: t.role_en,
    company: t.client_name,
    content_es: t.content_es,
    content_en: t.content_en,
    avatar_url: t.client_logo_url
  }));

  // 2. Fetch Brands
  const { data: rawBrands } = await supabase
    .from('brands')
    .select('id, name, logo_url')
    .eq('is_visible', true);

  const brands = (rawBrands || []).map((b: any) => ({
    id: b.id,
    name: b.name,
    logo_url: b.logo_url
  }));

  // 3. Featured Cases Engine (PRIORITY ORDER)
  const { data: rawCases } = await supabase
    .from('case_studies')
    .select('id, slug, title, title_es, title_en, summary, summary_es, summary_en, main_image_url:image_url, client_name, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .limit(8);

  const topCases = rawCases && rawCases.length > 0
    ? rawCases.map((c: any) => ({
        ...c,
        title: params.lang === 'en' ? (c.title_en || c.title) : (c.title_es || c.title),
        summary: params.lang === 'en' ? (c.summary_en || c.summary) : (c.summary_es || c.summary)
      }))
    : [];

  // 4. JSON-LD Organization
  // 4. JSON-LD Organization (Extended Authority)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dibrand",
    "url": "https://dibrand.co",
    "foundingDate": "2017",
    "description": params.lang === 'es'
      ? "Boutique de ingeniería de software y staff augmentation especializada en startups y productos digitales de alto rendimiento."
      : "Software engineering boutique and staff augmentation specialized in startups and high-performance digital products.",
    "logo": "https://dibrand.co/logo.png",
    "sameAs": [
      "https://www.linkedin.com/company/dibrand/",
      "https://github.com/dibrand",
      "https://twitter.com/dibrand",
      "https://clutch.co/profile/dibrand"
    ],
    "knowsAbout": [
      "Software Engineering",
      "IT Staff Augmentation",
      "MVP Development",
      "Web & Mobile Applications",
      "Fintech & Web3 Solutions"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "sales",
      "email": "hola@dibrand.co"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        {/* 1. Hero Section (Reinvención del Valor) */}
        <HeroSection dict={dict.home} />

        {/* 2. Sección Staffing (Strategic Talent Integration) */}
        <StaffAugmentationTeaser dict={dict.home} lang={params.lang} />

        {/* 3. Engineering Excellence (Dual Focus) */}
        <EngineeringExcellence dict={dict.home} lang={params.lang} />

        {/* 4. Selected Work (Dynamic Portfolio Engine) */}
        <SelectedWork dict={dict.home} lang={params.lang} cases={topCases} />

        {/* 5. Solutions / Services Grid */}
        <ServicesGrid dict={dict.home} lang={params.lang} />

        {/* 6. Compliance (Zero-Friction) */}
        <ComplianceSection dict={dict.home} />

        {/* 7. Brands & Tech Stack */}
        <TrustedBySection brands={brands || []} dict={dict.home} />
        <TechStack dict={dict.home} />

        {/* 8. Testimonials (Individual Social Proof) */}
        <TestimonialsSection testimonials={testimonials || []} dict={dict.home} lang={params.lang} />
      </main>

      {/* Footer */}
      <Footer dict={dict} lang={params.lang} />
    </>
  );
}
