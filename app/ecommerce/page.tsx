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
    <div className="flex flex-col min-h-screen font-lato bg-[#F5F5F5]">
      {/* 1. HERO SECTION - PREMIUM RECONSTRUCTION */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 flex items-center">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* COLUMNA IZQUIERDA: CONTENIDO Y JERARQUÍA */}
            <div className="flex flex-col space-y-10 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/80 border border-[#D83484]/20 rounded-full w-fit shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D83484] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D83484]"></span>
                </span>
                <span className="text-[10px] font-montserrat font-bold text-[#A3369D] uppercase tracking-widest">Digital Hub Escobar</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-7xl font-montserrat font-bold text-slate-900 leading-[1.1] tracking-tight">
                  Llevamos tu comercio de <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D83484] to-[#A3369D]">
                    Escobar a todo el país.
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
                  Creamos tiendas online de alta performance optimizadas para convertir visitas en ventas recurrentes. Tecnología de punta con soporte humano local.
                </p>
              </div>
              
              <div className="pt-4">
                <a 
                  href="https://wa.me/5491165939115?text=Hola%20Dibrand!%20Vengo%20del%20diario%20y%20quiero%20consultar%20por%20mi%20tienda%20online."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white text-base font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 group"
                >
                  Consultar por WhatsApp
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* COLUMNA DERECHA: IMAGEN 16:9 REFINADA */}
            <div className="relative">
              <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl border-4 border-white ring-1 ring-[#A3369D]/10">
                <NextImage 
                  src="/ecommerce-hero.png"
                  alt="Dibrand Ecommerce Escobar"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#A3369D]/10 to-transparent pointer-events-none" />
              </div>
              {/* Elemento Decorativo Tech */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center hidden lg:flex">
                <ShoppingBag size={48} className="text-[#D83484]" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PLATFORMS SECTION - REDESIÑADA CON MÁS AIRE */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="max-w-3xl mb-24">
            <h2 className="text-3xl lg:text-5xl font-montserrat font-bold text-slate-900 mb-6">Expertos en las plataformas líderes del mercado.</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#D83484] to-[#A3369D] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Tienda Nube */}
            <div className="p-12 rounded-3xl bg-[#F5F5F5] border border-slate-100 hover:shadow-xl transition-all group border-t-4 border-t-[#D83484]">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D83484] to-[#A3369D] flex items-center justify-center mb-8 text-white rounded-xl shadow-md">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-slate-900 mb-4 tracking-tight">Tienda Nube</h3>
              <p className="text-gray-600 mb-10 leading-relaxed">
                Puesta en marcha profesional y soporte local especializado para escalar rápido.
              </p>
              <a href="#contact" className="text-[#D83484] font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Comenzar <ArrowRight size={16} />
              </a>
            </div>

            {/* WooCommerce */}
            <div className="p-12 rounded-3xl bg-white shadow-2xl relative flex flex-col h-full border-b-4 border-b-[#A3369D] transition-transform hover:-translate-y-2">
              <div className="absolute top-4 right-6 bg-[#A3369D]/10 text-[#A3369D] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Personalizado</div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#A3369D] to-[#D83484] flex items-center justify-center mb-8 text-white rounded-xl shadow-md">
                <Settings size={28} />
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-slate-900 mb-4 tracking-tight">WooCommerce</h3>
              <p className="text-gray-600 mb-10 leading-relaxed">
                Control total del código y cero comisiones para marcas con requerimientos específicos.
              </p>
              <a href="#contact" className="text-[#A3369D] font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Consultar <ArrowRight size={16} />
              </a>
            </div>

            {/* Shopify */}
            <div className="p-12 rounded-3xl bg-[#F5F5F5] border border-slate-100 hover:shadow-xl transition-all group border-t-4 border-t-[#A3369D]">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D83484] to-[#A3369D] flex items-center justify-center mb-8 text-white rounded-xl shadow-md">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-slate-900 mb-4 tracking-tight">Shopify</h3>
              <p className="text-gray-600 mb-10 leading-relaxed">
                Infraestructura global para marcas internacionales con gran volumen de ventas.
              </p>
              <a href="#contact" className="text-[#D83484] font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Solicitar Plus <ArrowRight size={16} />
              </a>
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
