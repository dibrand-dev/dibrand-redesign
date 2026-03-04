import { getDictionary } from "@/lib/dictionaries";
import HeroSection from "@/components/home/HeroSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import TechStack from "@/components/home/TechStack";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import StaffAugmentationTeaser from "@/components/home/StaffAugmentationTeaser";
import AIAdvantage from "@/components/home/AIAdvantage";
import ComplianceSection from "@/components/home/ComplianceSection";
import SuccessCaseSection from "@/components/home/SuccessCaseSection";
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

  return (
    <>
      {/* 1. Hero Section (Reinvención del Valor) */}
      <HeroSection dict={dict.home} />

      {/* 2. Sección Staffing (Strategic Talent Integration) */}
      <StaffAugmentationTeaser dict={dict.home} />

      {/* 3. The Dibrand AI-Advantage */}
      <AIAdvantage dict={dict.home} />

      {/* 4. Social Proof (Business Results Success Case) */}
      <SuccessCaseSection dict={dict.home} lang={params.lang} />

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
