import { 
  ShoppingBag, 
  Settings, 
  Globe, 
  CreditCard, 
  Truck, 
  MessageSquare,
  ArrowRight
} from "lucide-react";
import NextImage from "next/image";
import ContactForm from "@/components/ContactForm";
import { getDictionary } from "@/lib/dictionaries";

export default async function EcommerceLanding() {
  // Fixed to 'es' for local market Escobar
  const lang = "es";
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen font-lato">
      {/* 1. HERO SECTION - OFFICIAL BRANDING */}
      <section className="relative bg-[#F5F5F5] overflow-hidden lg:min-h-[85vh] flex items-center">
        <div className="container mx-auto px-6 py-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* LADO IZQUIERDO: CONTENIDO */}
            <div className="lg:col-span-6 z-10 order-2 lg:order-1">
              <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-8 rounded-full shadow-lg shadow-magenta-500/20">
                Impulsando la Transformación Digital
              </div>
              <h1 className="text-5xl lg:text-7xl font-montserrat font-black leading-[1] tracking-tight mb-8">
                Potenciamos el <br /> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D83484] to-[#A3369D]">
                  comercio de Escobar.
                </span> 
              </h1>
              <h2 className="text-2xl lg:text-3xl font-montserrat font-semibold text-slate-800 mb-8 leading-tight">
                Tiendas online que definen el futuro de tu negocio.
              </h2>
              <p className="text-lg lg:text-xl text-slate-600 mb-12 max-w-xl leading-relaxed">
                Expertos en <span className="font-bold text-[#A3369D]">Tienda Nube, WooCommerce y Shopify.</span> Integramos soluciones innovadoras para escalar tu comercio local a nivel nacional.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <a 
                  href="https://wa.me/5491165939115?text=Hola%20Dibrand!%20Vengo%20del%20diario%20y%20quiero%20consultar%20por%20mi%20tienda%20online."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#D83484] to-[#A3369D] hover:scale-[1.02] text-white text-sm font-bold rounded-full transition-all shadow-xl shadow-[#D83484]/30 flex items-center justify-center gap-4 uppercase tracking-widest"
                >
                  Consultar por WhatsApp
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>

            {/* LADO DERECHO: IMAGEN 16:9 */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-video lg:aspect-[4/5] xl:aspect-video overflow-hidden rounded-3xl shadow-2xl group border-4 border-white">
                <NextImage 
                  src="/ecommerce-hero.png"
                  alt="Dibrand Ecommerce Escobar"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#A3369D]/30 to-transparent pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PLATFORMS SECTION - OFFICIAL BRANDING */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-montserrat font-black text-slate-900 mb-6 tracking-tight">Ecosistema Tecnológico.</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#D83484] to-[#A3369D] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Tienda Nube */}
            <div className="p-10 rounded-3xl bg-[#F5F5F5] border border-slate-100 hover:shadow-2xl transition-all group flex flex-col h-full border-t-4 border-t-[#D83484]">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D83484] to-[#A3369D] flex items-center justify-center mb-8 text-white rounded-2xl shadow-lg">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-slate-900 mb-4 tracking-tight">Tienda Nube</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                La solución ágil para PyMEs con visión. Puesta en marcha profesional y soporte local especializado.
              </p>
              <div className="mt-auto">
                <ul className="space-y-4 mb-10">
                  {['Panel Administrativo', 'Integración Mercado Pago', 'Soporte Escobar'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                      <div className="w-1.5 h-1.5 bg-[#D83484] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="text-[#D83484] font-bold flex items-center gap-2 hover:gap-4 transition-all">
                  Comenzar <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* WooCommerce */}
            <div className="p-10 rounded-3xl bg-white shadow-2xl relative flex flex-col h-full border-b-4 border-b-[#A3369D] scale-105 z-10 transition-transform hover:scale-[1.08]">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white text-[10px] font-black px-6 py-2 rounded-bl-3xl uppercase tracking-widest">A Medida</div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#A3369D] to-[#D83484] flex items-center justify-center mb-8 text-white rounded-2xl shadow-lg">
                <Settings size={28} />
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-slate-900 mb-4 tracking-tight">WooCommerce</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Ingeniería robusta y personalización extrema. Sin comisiones y con control absoluto del código.
              </p>
              <div className="mt-auto">
                <ul className="space-y-4 mb-10">
                  {['Cero Comisiones', 'Estructura SEO Avanzada', 'Personalización Total'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <div className="w-1.5 h-1.5 bg-[#A3369D] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="text-[#A3369D] font-bold flex items-center gap-2 hover:gap-4 transition-all">
                  Consultar Proyecto <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Shopify */}
            <div className="p-10 rounded-3xl bg-[#F5F5F5] border border-slate-100 hover:shadow-2xl transition-all group flex flex-col h-full border-t-4 border-t-[#A3369D]">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D83484] to-[#A3369D] flex items-center justify-center mb-8 text-white rounded-2xl shadow-lg">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-slate-900 mb-4 tracking-tight">Shopify Enterprise</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Infraestructura global para marcas de gran volumen. Escalabilidad masiva para lanzamientos mundiales.
              </p>
              <div className="mt-auto">
                <ul className="space-y-4 mb-10">
                  {['Seguridad Superior', 'Soporte 24/7 Global', 'Marketplace Robusto'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                      <div className="w-1.5 h-1.5 bg-[#A3369D] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="text-[#D83484] font-bold flex items-center gap-2 hover:gap-4 transition-all">
                  Solicitar Plus <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUE ADDED SECTION - BRAND ACCENTS */}
      <section className="py-24 bg-[#F5F5F5]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white flex items-center justify-center text-[#D83484] shrink-0 rounded-2xl shadow-md">
                <CreditCard size={28} />
              </div>
              <div>
                <h4 className="text-sm font-montserrat font-bold text-slate-900 uppercase tracking-widest mb-1">Pagos Digitales</h4>
                <p className="text-sm text-slate-500 leading-relaxed italic">Mercado Pago y Pasarelas Internacionales Integradas.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white flex items-center justify-center text-[#A3369D] shrink-0 rounded-2xl shadow-md">
                <Truck size={28} />
              </div>
              <div>
                <h4 className="text-sm font-montserrat font-bold text-slate-900 uppercase tracking-widest mb-1">Logística</h4>
                <p className="text-sm text-slate-500 leading-relaxed italic">Despachos Inteligentes para Alcance Nacional.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white flex items-center justify-center text-[#D83484] shrink-0 rounded-2xl shadow-md">
                <MessageSquare size={28} />
              </div>
              <div>
                <h4 className="text-sm font-montserrat font-bold text-slate-900 uppercase tracking-widest mb-1">Experiencia Local</h4>
                <p className="text-sm text-slate-500 leading-relaxed italic">Soporte Técnico Humano desde Escobar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ZOHO CRM FORM SECTION - BRAND COLORS */}
      <section id="contact" className="py-32 bg-white relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-montserrat font-black mb-4 tracking-tight">Tu transformación comienza aquí.</h2>
              <p className="text-[#A3369D] text-lg font-bold">Agenda una consultoría técnica gratuita.</p>
            </div>
            
            <div className="bg-[#F5F5F5] p-8 lg:p-16 rounded-[40px] shadow-inner border border-slate-100">
              <ContactForm dict={dict} isDark={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/5491165939115?text=Hola%20Dibrand!%20Vengo%20del%20diario%20y%20quiero%20consultar%20por%20mi%20tienda%20online."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-black py-2 px-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
          Consultoría Exclusiva
        </span>
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 4.754a8.117 8.117 0 01-3.848-.977l-.276-.164-2.853.748.761-2.781-.18-.287a8.132 8.132 0 01-1.248-4.385c0-4.492 3.655-8.147 8.147-8.147 4.492 0 8.148 3.655 8.148 8.147 0 4.492-3.655 8.148-8.148 8.148m0-17.762C8.223 1.374 3.717 5.88 3.717 11.417c0 1.767.46 3.486 1.332 5.006l-1.414 5.163 5.282-1.385c1.55.845 3.325 1.29 5.133 1.29 5.539 0 10.046-4.507 10.046-10.047 0-5.539-4.507-10.046-10.046-10.046" />
        </svg>
      </a>
    </div>
  );
}
