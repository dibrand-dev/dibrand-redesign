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

  const { data: rawBrands } = await supabase
    .from('brands')
    .select('id, name, logo_url')
    .eq('is_visible', true);

  const brands = (rawBrands || []).map((b: any) => ({
    id: b.id,
    name: b.name,
    logo_url: b.logo_url
  }));

  const { data: rawCases } = await supabase
    .from('case_studies')
    .select('id, slug, title, summary, image_url')
    .limit(4);

  const topCases = rawCases || [];

  return (
    <>
      {/* 1. Hero Section (Reinvención del Valor) */}
      <HeroSection dict={dict.home} />

      {/* 2. Sección Staffing (Strategic Talent Integration) */}
      <StaffAugmentationTeaser dict={dict.home} />

      {/* 3. Engineering Excellence (Dual Focus) */}
      <EngineeringExcellence dict={dict.home} lang={params.lang} />

      {/* 4. Selected Work (Mini-Portfolio) */}
      <SelectedWork dict={dict.home} lang={params.lang} cases={topCases} />

      {/* 5. Solutions / Services Grid */}
      <ServicesGrid dict={dict.home} />

      {/* 6. Compliance (Zero-Friction) */}
      <ComplianceSection dict={dict.home} />

      {/* 7. Brands & Tech Stack */}
      <TrustedBySection brands={brands} dict={dict.home} />
      <TechStack dict={dict.home} />

      {/* 8. Testimonials (Individual Social Proof) */}
      <TestimonialsSection testimonials={testimonials || []} dict={dict.home} lang={params.lang} />

      {/* Footer */}
      <Footer dict={dict} lang={params.lang} />
    </>
  );
}
