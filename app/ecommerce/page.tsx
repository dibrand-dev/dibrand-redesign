import { 
  ShoppingBag, 
  Settings, 
  Globe, 
  CreditCard, 
  Truck, 
  MessageSquare,
  ArrowRight
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { getDictionary } from "@/lib/dictionaries";

export default async function EcommerceLanding() {
  // Fixed to 'es' for local market Escobar
  const lang = "es";
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.03),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest mb-8">
              <Globe size={14} />
              Ecommerce Engineering & Strategy
            </div>
            <h1 className="text-5xl lg:text-8xl font-black text-black leading-[0.95] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-black via-black to-slate-400">
              De Escobar <br className="hidden lg:block" /> a todo el país.
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Diseñamos tiendas online de alto rendimiento. Tecnología de punta para marcas que buscan escalar sin límites.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://wa.me/5491165939115?text=Hola%20Dibrand!%20Me%20interesa%20crear%20mi%20tienda%20online."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-5 bg-black hover:bg-slate-800 text-white text-lg font-black rounded-full shadow-2xl transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                Consultar por WhatsApp
                <ArrowRight size={20} />
              </a>
              <a 
                href="#contact"
                className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-900 text-slate-900 text-sm font-black rounded-full hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                Elegir Plataforma
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORMS SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-6 tracking-tighter uppercase">Stack Tecnológico.</h2>
            <div className="h-1 w-24 bg-black mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Tienda Nube */}
            <div className="p-10 border border-slate-200 hover:border-black transition-all group flex flex-col h-full bg-white group hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.02)]">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-8 text-black group-hover:bg-black group-hover:text-white transition-all">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">Tienda Nube</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                Puesta en marcha profesional en tiempo récord. La solución ideal para PyMEs que buscan crecimiento acelerado.
              </p>
              <div className="mt-auto">
                <ul className="space-y-4 mb-10">
                  {['Panel intuitivo', 'Ecosistema local', 'Bajo mantenimiento'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="text-black font-black flex items-center gap-2 hover:gap-4 transition-all">
                  EMPEZAR <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* WooCommerce */}
            <div className="p-10 border-[3px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] relative flex flex-col h-full bg-white">
              <div className="absolute top-0 right-0 bg-black text-white text-[8px] font-black px-4 py-2 uppercase tracking-[0.2em]">Full Custom</div>
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-8 text-white">
                <Settings size={24} />
              </div>
              <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">WooCommerce</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                Sin comisiones por venta y con control absoluto. Ingeniería a medida para negocios que buscan diferenciarse.
              </p>
              <div className="mt-auto">
                <ul className="space-y-4 mb-10">
                  {['Cero comisiones', 'Propiedad del código', 'Escalabilidad custom'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-900">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="text-black font-black flex items-center gap-2 hover:gap-4 transition-all">
                  COTIZAR PROYECTO <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Shopify */}
            <div className="p-10 border border-slate-200 hover:border-black transition-all group flex flex-col h-full bg-white hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.02)]">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-8 text-black group-hover:bg-black group-hover:text-white transition-all">
                <Globe size={24} />
              </div>
              <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">Shopify & Enterprise</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                Infraestructura global para marcas líderes. Estabilidad total bajo picos extremos de tráfico.
              </p>
              <div className="mt-auto">
                <ul className="space-y-4 mb-10">
                  {['Seguridad nivel banco', 'Soporte 24/7 Global', 'Marketplace Apps'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="text-black font-black flex items-center gap-2 hover:gap-4 transition-all">
                  SOLUCIONES PLUS <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUE ADDED SECTION */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white border border-slate-200 flex items-center justify-center text-black shrink-0 shadow-sm">
                <CreditCard size={28} />
              </div>
              <div>
                <h4 className="text-sm font-black text-black uppercase tracking-widest mb-1">Pagos Transparentes</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Configuramos Mercado Pago y todas las pasarelas sin fricción.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white border border-slate-200 flex items-center justify-center text-black shrink-0 shadow-sm">
                <Truck size={28} />
              </div>
              <div>
                <h4 className="text-sm font-black text-black uppercase tracking-widest mb-1">Logística Inteligente</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Integración con Andreani, Correo Arg y envíos locales eficientes.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white border border-slate-200 flex items-center justify-center text-black shrink-0 shadow-sm">
                <MessageSquare size={28} />
              </div>
              <div>
                <h4 className="text-sm font-black text-black uppercase tracking-widest mb-1">Soporte Local</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Desde el HUB Escobar. Nos sentamos contigo a ver tu negocio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ZOHO CRM FORM SECTION */}
      <section id="contact" className="py-32 bg-white overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter uppercase">Comienza hoy.</h2>
              <p className="text-slate-500 text-lg uppercase tracking-[0.2em] font-black text-xs">Transforma tu comercio en una marca nacional.</p>
            </div>
            
            <div className="bg-slate-50 p-8 lg:p-16 border border-slate-200">
              <ContactForm dict={dict} isDark={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/5491165939115?text=Hola%20Dibrand!%20Me%20interesa%20crear%20mi%20tienda%20online."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <span className="absolute right-full mr-4 bg-black text-white text-[10px] font-black py-2 px-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
          Chatea con nosotros
        </span>
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 4.754a8.117 8.117 0 01-3.848-.977l-.276-.164-2.853.748.761-2.781-.18-.287a8.132 8.132 0 01-1.248-4.385c0-4.492 3.655-8.147 8.147-8.147 4.492 0 8.148 3.655 8.148 8.147 0 4.492-3.655 8.148-8.148 8.148m0-17.762C8.223 1.374 3.717 5.88 3.717 11.417c0 1.767.46 3.486 1.332 5.006l-1.414 5.163 5.282-1.385c1.55.845 3.325 1.29 5.133 1.29 5.539 0 10.046-4.507 10.046-10.047 0-5.539-4.507-10.046-10.046-10.046" />
        </svg>
      </a>
    </div>
  );
}
