import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f8f9ff] via-[#eff4ff]/40 to-[#f8f9ff] py-16 lg:py-24">
      {/* Ambient subtle orbs for modern GovTech spatial depth */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#cce5ff]/30 rounded-full blur-3xl -z-10"></div>
      <div className="pointer-events-none absolute top-40 right-12 w-64 h-64 bg-[#7ffc97]/20 rounded-full blur-2xl -z-10"></div>
      
      <div className="max-w-5xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Main Heading (Accessible, clear, humane) */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#00142f] tracking-tight max-w-3xl">
          Hola, ¿qué trámite o servicio buscás hoy?
        </h1>
        <p className="text-lg text-[#44474e] mt-4 max-w-2xl">
          Encontrá turnos, tasas tributarias, habilitaciones y asistencia en línea al instante sin intermediarios.
        </p>
        
        {/* Mega Search Bar (Semantic AEO design) */}
        <div className="w-full max-w-4xl mt-12">
          <form action="#" className="relative group flex items-center bg-white rounded-full p-1.5 sm:p-2 shadow-xl shadow-[#00142f]/5 transition-all focus-within:shadow-2xl focus-within:shadow-[#006398]/15" method="GET">
            <div className="flex items-center justify-center pl-3 sm:pl-6 pr-1 sm:pr-2 text-[#006398]">
              <span className="material-symbols-outlined text-[24px] sm:text-[32px]">search</span>
            </div>
            <input aria-label="Buscar trámites, tasas, hospitales y servicios de Escobar" className="w-full h-12 sm:h-14 bg-transparent text-[#00142f] text-base sm:text-lg placeholder:text-[#74777f] focus:outline-none px-1 sm:px-2 min-w-0" placeholder="Ej: Pagar tasa..." type="search" />
            <button className="bg-[#006398] text-white px-4 sm:px-8 h-12 sm:h-14 rounded-full text-sm sm:text-base font-semibold hover:bg-[#004a74] transition-colors shrink-0 flex items-center gap-1 sm:gap-2 shadow-md group-focus-within:bg-[#004a74]" type="submit">
              <span className="hidden sm:inline">Buscar</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
              </svg>
            </button>
          </form>
        </div>
        
        {/* Quick Action Pills */}
        <div className="w-full max-w-4xl mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm font-semibold text-[#44474e] mr-1">Frecuentes:</span>
          <Link className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#00142f] font-semibold text-sm shadow-sm hover:bg-[#dce9ff] hover:text-[#006398] transition-all" href="#">
            <span className="material-symbols-outlined text-[#006398] text-[18px]">calendar_month</span>
            <span>Sacar turno</span>
          </Link>
          <Link className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#00142f] font-semibold text-sm shadow-sm hover:bg-[#dce9ff] hover:text-[#006398] transition-all" href="#">
            <span className="material-symbols-outlined text-[#006398] text-[18px]">receipt_long</span>
            <span>Pagar tasas AMIP</span>
          </Link>
          <Link className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#00142f] font-semibold text-sm shadow-sm hover:bg-[#dce9ff] hover:text-[#006398] transition-all" href="#">
            <span className="material-symbols-outlined text-[#006398] text-[18px]">badge</span>
            <span>Licencias</span>
          </Link>
          <Link className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#00142f] font-semibold text-sm shadow-sm hover:bg-[#dce9ff] hover:text-[#006398] transition-all" href="#">
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
