"use client";

import { useState } from "react";
import Link from "next/link";

const localityData: Record<string, { name: string, address: string, phone: string }> = {
  belen: {
    name: 'Unidad de gestión comunitaria Belén centro',
    address: 'Alberdi 503 esquina Tapia de Cruz, Belén de Escobar',
    phone: 'Atención directa: (0348) 443-0500'
  },
  garin: {
    name: 'Unidad de gestión comunitaria N° 2 Garín',
    address: 'Boulevard Presidente Perón 210, Garín',
    phone: 'Atención directa: (0348) 447-1040'
  },
  maschwitz: {
    name: 'Unidad de gestión comunitaria N° 3 Maschwitz',
    address: 'El Dorado 1900 esquina Entre Ríos, Ing. Maschwitz',
    phone: 'Atención directa: (0348) 444-1234'
  },
  matheu: {
    name: 'Unidad de gestión comunitaria N° 4 Matheu',
    address: 'Canesi 290 entre Nazarre y Moreno, Matheu',
    phone: 'Atención directa: (0348) 446-0812'
  },
  savio: {
    name: 'Unidad de gestión comunitaria N° 5 Maq. Savio',
    address: 'Beliera y Ruta 26, Maquinista Savio',
    phone: 'Atención directa: (0348) 448-2211'
  },
  lomaverde: {
    name: 'Unidad de gestión comunitaria N° 6 Loma verde',
    address: 'Calle Los Cerros y Colectora Este, Loma Verde',
    phone: 'Atención directa: (0348) 449-3300'
  }
};

const localities = [
  { id: 'belen', label: 'Belén de Escobar' },
  { id: 'garin', label: 'Garín' },
  { id: 'maschwitz', label: 'Ing. Maschwitz' },
  { id: 'matheu', label: 'Matheu' },
  { id: 'savio', label: 'Maq. Savio' },
  { id: 'lomaverde', label: 'Loma verde' },
];

export default function Discover() {
  const [activeLocality, setActiveLocality] = useState('belen');
  const activeData = localityData[activeLocality];

  return (
    <section className="w-full py-16 bg-[#eff4ff]/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[#006398] text-sm font-semibold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span>Descentralización y proximidad</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#00142f] tracking-tight">Descubrí Escobar</h2>
          <p className="text-base text-[#44474e] mt-1">
            Seleccioná tu localidad para enterarte de operativos móviles, obras y servicios cercanos.
          </p>
        </div>

        {/* Split Layout (50/50 Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Locality Selector + Dynamic UGC Info Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="text-base font-semibold text-[#00142f] block mb-3">Elegí tu localidad:</span>
              {/* Interactive Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {localities.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocality(loc.id)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all shadow-sm flex items-center justify-between ${
                      activeLocality === loc.id
                        ? "bg-[#00142f] text-white"
                        : "bg-white text-[#00142f] hover:bg-[#e5eeff]"
                    }`}
                    type="button"
                  >
                    <span>{loc.label}</span>
                    {activeLocality === loc.id && (
                      <span className="w-2 h-2 rounded-full bg-[#5bb8fe]"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* UGC Detailed Box */}
            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded bg-[#cce5ff] text-[#011c2d] text-xs font-bold uppercase tracking-wider">
                    UGC N° 1 y sede territorial
                  </span>
                  <span className="text-xs text-[#1aa54c] flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#1aa54c]"></span> Abierto hoy
                  </span>
                </div>
                <h3 className="text-lg md:text-xl text-[#00142f] mt-4 font-bold">
                  {activeData.name}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-[#44474e]">
                  <p className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#006398] text-[20px] shrink-0">pin_drop</span>
                    <span>{activeData.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006398] text-[20px] shrink-0">schedule</span>
                    <span>Lunes a viernes de 07:30 a 15:00 hs</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006398] text-[20px] shrink-0">phone_in_talk</span>
                    <span>{activeData.phone}</span>
                  </p>
                </div>

                {/* Services list at UGC */}
                <div className="mt-6 pt-4 bg-[#eff4ff] rounded-xl p-4">
                  <span className="text-xs font-bold text-[#00142f] block mb-2">Servicios presenciales en esta sede:</span>
                  <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                    <span className="bg-white px-2 py-1 rounded text-[#0b1c30]">Atención vecinal</span>
                    <span className="bg-white px-2 py-1 rounded text-[#0b1c30]">Pago de tasas</span>
                    <span className="bg-white px-2 py-1 rounded text-[#0b1c30]">Iniciación reclamos 147</span>
                    <span className="bg-white px-2 py-1 rounded text-[#0b1c30]">SUBE y ANSES</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link className="flex-1 bg-[#006398] text-white text-center py-2.5 rounded-lg text-base font-semibold hover:bg-[#004a74] transition-colors shadow-sm" href="#">
                  Pedir turno UGC
                </Link>
                <Link className="flex items-center justify-center p-2.5 rounded-lg bg-[#e5eeff] text-[#00142f] hover:bg-[#dce9ff] transition-colors" href="#" title="Ver en mapa">
                  <span className="material-symbols-outlined text-[20px]">map</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Community Impact Program Cards (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 overflow-hidden">
            <div className="p-4 border-b border-[#c4c6cf]/20 bg-[#eff4ff]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006398] text-[22px]">explore</span>
                <div>
                  <h3 className="text-base text-[#00142f] font-bold leading-tight">Mapa territorial y puntos de cercanía</h3>
                  <span className="text-xs text-[#44474e]">Belén de Escobar • Cobertura en tiempo real</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button className="px-2.5 py-1 rounded-full bg-[#00142f] text-white text-xs font-semibold shrink-0 shadow-sm" type="button">Todas</button>
                <button className="px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#44474e] hover:bg-[#dce9ff] hover:text-[#00142f] transition-colors text-xs font-semibold shrink-0" type="button">UGC</button>
                <button className="px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#44474e] hover:bg-[#dce9ff] hover:text-[#00142f] transition-colors text-xs font-semibold shrink-0" type="button">Salud y CAPS</button>
                <button className="px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#44474e] hover:bg-[#dce9ff] hover:text-[#00142f] transition-colors text-xs font-semibold shrink-0" type="button">Puntos verdes</button>
                <button className="px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#44474e] hover:bg-[#dce9ff] hover:text-[#00142f] transition-colors text-xs font-semibold shrink-0" type="button">Seguridad</button>
              </div>
            </div>

            <div className="relative w-full h-[380px] bg-[#eef4fc] overflow-hidden select-none">
              <svg className="w-full h-full object-cover" viewBox="0 0 700 380" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="map-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#d3e4fe" strokeWidth="0.7" strokeOpacity="0.6"></path>
                  </pattern>
                </defs>
                <rect width="700" height="380" fill="#eff5fd"></rect>
                <rect width="700" height="380" fill="url(#map-grid)"></rect>
                <path d="M 380 0 C 400 90 460 170 550 240 C 620 290 680 340 700 360 L 700 0 Z" fill="#d9e9fd" fillOpacity="0.4"></path>
                <path d="M 160 210 Q 230 190 280 240 Q 320 280 290 320 Q 220 340 180 300 Z" fill="#d4f5dc" fillOpacity="0.6" stroke="#7ffc97" strokeWidth="1.5"></path>
                <text x="210" y="270" fill="#005320" fontSize="11" fontWeight="600" fontFamily="sans-serif">Parque Papa Francisco</text>
                <path d="M 330 120 H 410 V 170 H 330 Z" fill="#d4f5dc" fillOpacity="0.7" stroke="#7ffc97" strokeWidth="1.5"></path>
                <text x="340" y="150" fill="#005320" fontSize="10" fontWeight="600" fontFamily="sans-serif">Plaza San Martín</text>
                <path d="M 0 60 Q 300 120 700 90" stroke="#ffffff" strokeWidth="22" strokeLinecap="round"></path>
                <path d="M 0 60 Q 300 120 700 90" stroke="#cadbf5" strokeWidth="14" strokeLinecap="round"></path>
                <path d="M 0 60 Q 300 120 700 90" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6"></path>
                <text x="20" y="50" fill="#475569" fontSize="10" fontWeight="700" fontFamily="sans-serif">Panamericana (Ramal Campana - RN 9)</text>
                <path d="M 80 0 L 620 380" stroke="#334155" strokeWidth="3" strokeDasharray="8 4"></path>
                <text x="520" y="340" fill="#334155" fontSize="9" fontWeight="700" fontFamily="sans-serif">FFCC Mitre (Retiro - Zárate)</text>
                <path d="M 0 240 C 200 220 400 200 700 180" stroke="#ffffff" strokeWidth="14" strokeLinecap="round"></path>
                <path d="M 0 240 C 200 220 400 200 700 180" stroke="#cadbf5" strokeWidth="8" strokeLinecap="round"></path>
                <text x="40" y="225" fill="#006398" fontSize="10" fontWeight="700" fontFamily="sans-serif">Av. 25 de Mayo</text>
                <path d="M 200 380 L 450 0" stroke="#ffffff" strokeWidth="12" strokeLinecap="round"></path>
                <path d="M 200 380 L 450 0" stroke="#cadbf5" strokeWidth="6" strokeLinecap="round"></path>
                <text x="240" y="370" fill="#006398" fontSize="10" fontWeight="700" fontFamily="sans-serif">Tapia de Cruz</text>
                <path d="M 320 380 L 520 0" stroke="#ffffff" strokeWidth="10" strokeLinecap="round"></path>
                <path d="M 320 380 L 520 0" stroke="#cadbf5" strokeWidth="5" strokeLinecap="round"></path>
                <text x="470" y="30" fill="#006398" fontSize="9" fontWeight="700" fontFamily="sans-serif">Ruta Prov. 25</text>
                <path d="M 100 140 L 580 280" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round"></path>
                <path d="M 50 320 L 600 210" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round"></path>
                <path d="M 370 380 L 600 140" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round"></path>
                
                <g className="cursor-pointer group/pin" transform="translate(285, 175)">
                  <circle cx="0" cy="0" r="16" fill="#006398" fillOpacity="0.2" className="animate-pulse"></circle>
                  <circle cx="0" cy="0" r="10" fill="#00142f" stroke="#ffffff" strokeWidth="2.5"></circle>
                  <circle cx="0" cy="0" r="4" fill="#5bb8fe"></circle>
                  <rect x="-75" y="-38" width="150" height="24" rx="6" fill="#00142f" fillOpacity="0.95"></rect>
                  <text x="0" y="-22" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">UGC N° 1 Belén centro</text>
                  <polygon points="-5,-14 5,-14 0,-9" fill="#00142f" fillOpacity="0.95"></polygon>
                </g>
                <g className="cursor-pointer group/pin" transform="translate(490, 140)">
                  <circle cx="0" cy="0" r="16" fill="#ba1a1a" fillOpacity="0.2" className="animate-pulse"></circle>
                  <circle cx="0" cy="0" r="10" fill="#ba1a1a" stroke="#ffffff" strokeWidth="2.5"></circle>
                  <circle cx="0" cy="0" r="4" fill="#ffffff"></circle>
                  <rect x="-70" y="-38" width="140" height="24" rx="6" fill="#213145" fillOpacity="0.95"></rect>
                  <text x="0" y="-22" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">Hospital Prov. Erill</text>
                  <polygon points="-5,-14 5,-14 0,-9" fill="#213145" fillOpacity="0.95"></polygon>
                </g>
                <g className="cursor-pointer group/pin" transform="translate(370, 125)">
                  <circle cx="0" cy="0" r="9" fill="#d97706" stroke="#ffffff" strokeWidth="2"></circle>
                  <circle cx="0" cy="0" r="3.5" fill="#ffffff"></circle>
                  <rect x="-65" y="-34" width="130" height="22" rx="5" fill="#213145" fillOpacity="0.95"></rect>
                  <text x="0" y="-19" fill="#ffffff" fontSize="9" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">Palacio municipal</text>
                  <polygon points="-4,-12 4,-12 0,-8" fill="#213145" fillOpacity="0.95"></polygon>
                </g>
                <g className="cursor-pointer group/pin" transform="translate(430, 245)">
                  <circle cx="0" cy="0" r="10" fill="#1aa54c" stroke="#ffffff" strokeWidth="2"></circle>
                  <circle cx="0" cy="0" r="4" fill="#ffffff"></circle>
                  <rect x="-75" y="-36" width="150" height="22" rx="5" fill="#003010" fillOpacity="0.95"></rect>
                  <text x="0" y="-21" fill="#ffffff" fontSize="9" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">Punto verde estación</text>
                  <polygon points="-4,-14 4,-14 0,-10" fill="#003010" fillOpacity="0.95"></polygon>
                </g>
                <g className="cursor-pointer group/pin" transform="translate(150, 110)">
                  <circle cx="0" cy="0" r="9" fill="#006398" stroke="#ffffff" strokeWidth="2"></circle>
                  <circle cx="0" cy="0" r="3.5" fill="#ffffff"></circle>
                  <rect x="-70" y="-34" width="140" height="22" rx="5" fill="#213145" fillOpacity="0.95"></rect>
                  <text x="0" y="-19" fill="#ffffff" fontSize="9" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">Posta seguridad RN9</text>
                  <polygon points="-4,-12 4,-12 0,-8" fill="#213145" fillOpacity="0.95"></polygon>
                </g>
              </svg>

              <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-[#c4c6cf]/30">
                <button className="w-8 h-8 flex items-center justify-center rounded text-[#00142f] hover:bg-[#e5eeff] transition-colors" title="Acercar mapa" type="button"><span className="material-symbols-outlined text-[18px]">add</span></button>
                <button className="w-8 h-8 flex items-center justify-center rounded text-[#00142f] hover:bg-[#e5eeff] transition-colors" title="Alejar mapa" type="button"><span className="material-symbols-outlined text-[18px]">remove</span></button>
                <button className="w-8 h-8 flex items-center justify-center rounded text-[#00142f] hover:bg-[#e5eeff] transition-colors" title="Centrar sede actual" type="button"><span className="material-symbols-outlined text-[18px]">my_location</span></button>
              </div>
              <div className="absolute bottom-3 left-3 bg-[#00142f]/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-[11px] flex items-center gap-3 shadow-md border border-[#0f294a]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5bb8fe]"></span><span className="font-medium">UGC activa</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f87171]"></span><span className="font-medium">Hospital / CAPS</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7ffc97]"></span><span className="font-medium">Punto verde</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span><span className="font-medium">Cívico</span></div>
              </div>
            </div>

            <div className="p-4 bg-[#eff4ff]/30 border-t border-[#c4c6cf]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00142f] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">location_city</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#00142f] font-bold leading-none">UGC N° 1 Belén centro</span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-[#cce5ff] text-[#011c2d] font-bold uppercase">Sede activa</span>
                  </div>
                  <p className="text-sm text-[#44474e] mt-1">Alberdi 503 esq. Tapia de Cruz • Lu a Vi 07:30 a 15:00 hs</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-[#00142f] border border-[#c4c6cf]/40 hover:bg-[#e5eeff] text-sm font-semibold transition-colors shadow-sm" href="https://maps.google.com/?q=Alberdi+503+Belen+de+Escobar" rel="noopener" target="_blank">
                  <span className="material-symbols-outlined text-[#006398] text-[18px]">directions</span>
                  <span>Cómo llegar</span>
                </Link>
                <Link className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#006398] text-white hover:bg-[#004a74] text-sm font-semibold transition-colors shadow-sm" href="#">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>Turno rápido</span>
                </Link>
              </div>
            </div>
            
            <div className="px-4 py-2.5 bg-[#eff4ff]/70 border-t border-[#c4c6cf]/20 flex flex-wrap items-center justify-between text-xs text-[#44474e] font-medium">
              <span>Red distrital en Belén: <strong>4 UGCs</strong> • <strong>6 Centros de salud</strong> • <strong>8 Puntos verdes</strong> • <strong>12 Postas de seguridad</strong></span>
              <Link className="text-[#006398] hover:underline font-bold inline-flex items-center gap-0.5" href="#">
                <span>Ver visor GIS completo</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
