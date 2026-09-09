import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f8f9ff] via-[#eff4ff]/40 to-[#f8f9ff] py-16 lg:py-24">
      {/* Ambient subtle orbs for modern GovTech spatial depth */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#cce5ff]/30 rounded-full blur-3xl -z-10"></div>
      <div className="pointer-events-none absolute top-40 right-12 w-64 h-64 bg-[#7ffc97]/20 rounded-full blur-2xl -z-10"></div>
      
      <div className="max-w-5xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Direct Context Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#e5eeff] text-[#00142f] text-sm font-semibold mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#1aa54c] animate-pulse"></span>
          <span>Atención ciudadana unificada • Portal oficial de Escobar</span>
        </div>
        
        {/* Main Heading (Accessible, clear, humane) */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#00142f] tracking-tight max-w-3xl">
          Hola, ¿qué trámite o servicio buscás hoy?
        </h1>
        <p className="text-lg text-[#44474e] mt-4 max-w-2xl">
          Encontrá turnos, tasas tributarias, habilitaciones y asistencia en línea al instante sin intermediarios.
        </p>
        
        {/* Mega Search Bar (Semantic AEO design) */}
        <div className="w-full max-w-4xl mt-12">
          <form action="#" className="relative group flex items-center bg-white rounded-full p-2 shadow-xl shadow-[#00142f]/5 transition-all focus-within:shadow-2xl focus-within:shadow-[#9e4d97]/15" method="GET">
            <div className="flex items-center justify-center pl-6 pr-2 text-[#9e4d97]">
              <span className="material-symbols-outlined text-[32px]">search</span>
            </div>
            <input aria-label="Buscar trámites, tasas, hospitales y servicios de Escobar" className="w-full h-14 bg-transparent text-[#00142f] text-lg placeholder:text-[#74777f] focus:outline-none px-2" placeholder="Ej: Pagar tasa, Turno hospital, Licencia de conducir..." type="search" />
            <button className="bg-[#9e4d97] text-white px-8 h-14 rounded-full text-base font-semibold hover:bg-[#823d7c] transition-colors shrink-0 flex items-center gap-2 shadow-md" type="submit">
              <span>Buscar</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>
        </div>
        
        {/* Quick Action Pills */}
        <div className="w-full max-w-4xl mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm font-semibold text-[#44474e] mr-1">Frecuentes:</span>
          <Link className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#00142f] font-semibold text-sm shadow-sm hover:bg-[#dce9ff] hover:text-[#9e4d97] transition-all" href="#">
            <span className="material-symbols-outlined text-[#9e4d97] text-[18px]">calendar_month</span>
            <span>Sacar turno</span>
          </Link>
          <Link className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#00142f] font-semibold text-sm shadow-sm hover:bg-[#dce9ff] hover:text-[#9e4d97] transition-all" href="#">
            <span className="material-symbols-outlined text-[#9e4d97] text-[18px]">receipt_long</span>
            <span>Pagar tasas AMIP</span>
          </Link>
          <Link className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#00142f] font-semibold text-sm shadow-sm hover:bg-[#dce9ff] hover:text-[#9e4d97] transition-all" href="#">
            <span className="material-symbols-outlined text-[#9e4d97] text-[18px]">badge</span>
            <span>Licencias</span>
          </Link>
          <Link className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#00142f] font-semibold text-sm shadow-sm hover:bg-[#dce9ff] hover:text-[#9e4d97] transition-all" href="#">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">shield_person</span>
            <span>Ojos y oídos en alerta</span>
          </Link>
          <Link className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7ffc97] text-[#003010] font-semibold text-sm shadow-sm hover:opacity-90 transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">recycling</span>
            <span>Puntos verdes</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
