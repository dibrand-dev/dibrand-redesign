import Link from "next/link";

export default function TopTasks() {
  return (
    <section className="w-full py-16 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#006398] text-sm font-semibold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Vía directa digital</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#00142f] tracking-tight">Resolvé tus gestiones</h2>
            <p className="text-base text-[#44474e] mt-1">Trámites frecuentes y canales de autogestión sin filas ni demoras.</p>
          </div>
          <Link className="group inline-flex items-center gap-2 text-base font-semibold text-[#006398] hover:text-[#00142f] transition-colors" href="#">
            <span>Ver catálogo completo (84)</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">chevron_right</span>
          </Link>
        </div>
        
        {/* 6 Primary Task Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link className="group relative flex flex-col justify-between p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" href="#">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-xl bg-[#ffdad6]/50 text-[#ba1a1a] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[32px]">local_hospital</span>
              </div>
              <span className="p-2 rounded-full text-[#c4c6cf] group-hover:text-[#006398] group-hover:bg-[#e5eeff] transition-colors">
                <span className="material-symbols-outlined text-[22px]">arrow_outward</span>
              </span>
            </div>
            <div className="mt-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#74777f]">Atención primaria y especialidades</span>
              <h3 className="text-xl font-bold text-[#00142f] group-hover:text-[#006398] transition-colors mt-1">
                Salud y turnos médicos
              </h3>
              <p className="text-sm text-[#44474e] mt-2">
                Hospitales, CAPS y especialistas. Gestioná turnos para vos y tu familia en el sistema municipal.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#eff4ff]/50 -mx-8 -mb-8 px-8 pb-4 rounded-b-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#44474e]">SAME 107 activo</span>
              <span className="text-xs font-bold text-[#006398]">Solicitar turno →</span>
            </div>
          </Link>
          
          {/* Card 2 */}
          <Link className="group relative flex flex-col justify-between p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" href="#">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-xl bg-[#cce5ff]/50 text-[#006398] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[32px]">account_balance_wallet</span>
              </div>
              <span className="p-2 rounded-full text-[#c4c6cf] group-hover:text-[#006398] group-hover:bg-[#e5eeff] transition-colors">
                <span className="material-symbols-outlined text-[22px]">arrow_outward</span>
              </span>
            </div>
            <div className="mt-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#74777f]">Agencia municipal de ingresos</span>
              <h3 className="text-xl font-bold text-[#00142f] group-hover:text-[#006398] transition-colors mt-1">
                Tasas y vencimientos
              </h3>
              <p className="text-sm text-[#44474e] mt-2">
                AMIP, automotor, ABL e inmuebles. Consultá deuda, emití boletas digitales y aboná con débito o QR.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#eff4ff]/50 -mx-8 -mb-8 px-8 pb-4 rounded-b-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#44474e]">Descarga inmediata</span>
              <span className="text-xs font-bold text-[#006398]">Consultar boleta →</span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link className="group relative flex flex-col justify-between p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" href="#">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-xl bg-[#dce9ff] text-[#00142f] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[32px]">architecture</span>
              </div>
              <span className="p-2 rounded-full text-[#c4c6cf] group-hover:text-[#006398] group-hover:bg-[#e5eeff] transition-colors">
                <span className="material-symbols-outlined text-[22px]">arrow_outward</span>
              </span>
            </div>
            <div className="mt-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#74777f]">Desarrollo territorial y urbanismo</span>
              <h3 className="text-xl font-bold text-[#00142f] group-hover:text-[#006398] transition-colors mt-1">
                Obras particulares
              </h3>
              <p className="text-sm text-[#44474e] mt-2">
                Planos, permisos de obra y zonificación. Iniciá expedientes digitales y seguí el estado catastral.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#eff4ff]/50 -mx-8 -mb-8 px-8 pb-4 rounded-b-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#44474e]">100% Digital</span>
              <span className="text-xs font-bold text-[#006398]">Ver requisitos →</span>
            </div>
          </Link>

          {/* Card 4 */}
          <Link className="group relative flex flex-col justify-between p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" href="#">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-xl bg-[#dce9ff] text-[#00142f] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[32px]">storefront</span>
              </div>
              <span className="p-2 rounded-full text-[#c4c6cf] group-hover:text-[#006398] group-hover:bg-[#e5eeff] transition-colors">
                <span className="material-symbols-outlined text-[22px]">arrow_outward</span>
              </span>
            </div>
            <div className="mt-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#74777f]">Producción y comercio</span>
              <h3 className="text-xl font-bold text-[#00142f] group-hover:text-[#006398] transition-colors mt-1">
                Habilitaciones
              </h3>
              <p className="text-sm text-[#44474e] mt-2">
                Comercio, industrias e inspección. Tramitá tu habilitación comercial simple con régimen exprés.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#eff4ff]/50 -mx-8 -mb-8 px-8 pb-4 rounded-b-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#44474e]">Régimen PyME</span>
              <span className="text-xs font-bold text-[#006398]">Iniciar trámite →</span>
            </div>
          </Link>

          {/* Card 5 */}
          <Link className="group relative flex flex-col justify-between p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" href="#">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-xl bg-[#7ffc97] text-[#003010] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[32px]">eco</span>
              </div>
              <span className="p-2 rounded-full text-[#c4c6cf] group-hover:text-[#006398] group-hover:bg-[#e5eeff] transition-colors">
                <span className="material-symbols-outlined text-[22px]">arrow_outward</span>
              </span>
            </div>
            <div className="mt-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1aa54c]">Ambiente y comunidad</span>
              <h3 className="text-xl font-bold text-[#00142f] group-hover:text-[#006398] transition-colors mt-1">
                Escobar sostenible
              </h3>
              <p className="text-sm text-[#44474e] mt-2">
                Puntos verdes, cronograma de recolección diferenciada, compostaje y retiro de ramas y restos de poda.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#eff4ff]/50 -mx-8 -mb-8 px-8 pb-4 rounded-b-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#44474e]">Mapa geolocalizado</span>
              <span className="text-xs font-bold text-[#006398]">Ver puntos →</span>
            </div>
          </Link>

          {/* Card 6 */}
          <Link className="group relative flex flex-col justify-between p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" href="#">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-xl bg-[#0f294a] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[32px]">folder_open</span>
              </div>
              <span className="p-2 rounded-full text-[#c4c6cf] group-hover:text-[#006398] group-hover:bg-[#e5eeff] transition-colors">
                <span className="material-symbols-outlined text-[22px]">arrow_outward</span>
              </span>
            </div>
            <div className="mt-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#74777f]">Directorio general</span>
              <h3 className="text-xl font-bold text-[#00142f] group-hover:text-[#006398] transition-colors mt-1">
                Guía de trámites completa
              </h3>
              <p className="text-sm text-[#44474e] mt-2">
                Requisitos paso a paso, descargables oficiales, tasas arancelarias y turnero centralizado de todas las áreas.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#eff4ff]/50 -mx-8 -mb-8 px-8 pb-4 rounded-b-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#44474e]">Toda la comuna</span>
              <span className="text-xs font-bold text-[#006398]">Explorar guía →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
