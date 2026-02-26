import { getDictionary } from "@/lib/dictionaries";
import ContactForm from "@/components/ContactForm";
import HeroSection from "@/components/home/HeroSection";
import WhatWeDo from "@/components/home/WhatWeDo";
import ServicesGrid from "@/components/home/ServicesGrid";
import TechStack from "@/components/home/TechStack";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import StaffAugmentationTeaser from "@/components/home/StaffAugmentationTeaser";
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
    <div className="flex min-h-screen flex-col bg-white">
      <HeroSection dict={dict.home} />

      <WhatWeDo dict={dict.home} />

      <ServicesGrid dict={dict.home} />

      <StaffAugmentationTeaser dict={dict.home} />

      <TrustedBySection brands={brands} />

      <TechStack dict={dict.home} />
      <TestimonialsSection testimonials={testimonials || []} dict={dict.home} lang={params.lang} />

      <Footer dict={dict} />
    </div>
  );
}
