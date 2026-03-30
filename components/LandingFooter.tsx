import NextImage from "next/image";
import { Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="relative bg-white pt-24 pb-12 overflow-hidden">
      {/* Línea Divisoria de Marca */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D83484] to-transparent opacity-30" />
      
      <div className="container mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 mb-20 items-start">
          
          {/* COLUMNA 1: LOGO E IDENTIDAD */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="relative w-48 h-10">
              <NextImage 
                src="/logo_dibrand.svg" 
                alt="Dibrand Official Logo" 
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs text-center md:text-left italic">
              Ingeniería de software de alta performance desde el hub tecnológico de Escobar.
            </p>
          </div>

          {/* COLUMNA 2: CONTACTO ESCOBAR */}
          <div className="flex flex-col items-center md:items-start space-y-8">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Contacto Directo</h4>
            <div className="space-y-6">
              {/* Ubicación */}
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#D83484] group-hover:bg-[#D83484] group-hover:text-white transition-all shadow-sm">
                  <MapPin size={18} />
                </div>
                <span className="text-sm font-medium text-slate-600">Escobar, Buenos Aires, Argentina.</span>
              </div>
              
              {/* WhatsApps */}
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#A3369D] group-hover:bg-[#A3369D] group-hover:text-white transition-all shadow-sm">
                  <Phone size={18} />
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <a href="https://wa.me/5491165939115" target="_blank" rel="noopener noreferrer" className="hover:text-[#D83484] transition-colors">
                    +54 9 11 6593-9115
                  </a>
                  <span className="text-slate-300 font-normal">|</span>
                  <a href="https://wa.me/5491124522696" target="_blank" rel="noopener noreferrer" className="hover:text-[#D83484] transition-colors">
                    +54 9 11 2452-2696
                  </a>
                </div>
              </div>

              {/* Email */}
              <a 
                href="mailto:hello@dibrand.co" 
                className="flex items-center gap-4 group transition-transform hover:translate-x-1"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#D83484] group-hover:bg-[#D83484] group-hover:text-white transition-all shadow-sm">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-medium text-slate-600">hello@dibrand.co</span>
              </a>
            </div>
          </div>

          {/* COLUMNA 3: SOCIAL & LEGAL */}
          <div className="flex flex-col items-center md:items-start space-y-8 h-full">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Redes Globales</h4>
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="https://www.instagram.com/dibrand.ok/" target="_blank" rel="noopener noreferrer" 
                 className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-[#D83484] hover:to-[#A3369D] transition-all shadow-lg hover:scale-110 group">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/dibrand/" target="_blank" rel="noopener noreferrer" 
                 className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-[#D83484] hover:to-[#A3369D] transition-all shadow-lg hover:scale-110 group">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                   <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* X (Twitter) */}
              <a href="https://x.com/Dibrand_ok" target="_blank" rel="noopener noreferrer" 
                 className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-[#D83484] hover:to-[#A3369D] transition-all shadow-lg hover:scale-110 group">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* CIERRE Y COPYRIGHT */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center md:text-left">
            © 2026 DIBRAND LLC. Todos los derechos reservados.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-slate-950 uppercase tracking-widest italic opacity-50">
            <span>Engineering & Strategy</span>
            <span>Digital Transformation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
