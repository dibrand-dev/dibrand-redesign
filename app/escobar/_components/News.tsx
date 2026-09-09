import Link from "next/link";

export default function News() {
  return (
    <section className="w-full py-16 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#9e4d97] text-sm font-semibold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[18px]">feed</span>
              <span>Canales informativos</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#00142f] tracking-tight">Novedades y agenda</h2>
            <p className="text-base text-[#44474e] mt-1">Comunicaciones oficiales, avances de obras y rendición de cuentas.</p>
          </div>
          <Link className="group inline-flex items-center gap-2 text-base font-semibold text-[#9e4d97] hover:text-[#00142f] transition-colors" href="#">
            <span>Sala de prensa completa</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">chevron_right</span>
          </Link>
        </div>

        {/* Horizontal Distribution: 70% Compact Horizontal News Cards / 30% Dark Gov Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 70% (8 Columns in a 12-col grid): 3 Compact Horizontal News Cards */}
          <div className="lg:col-span-8 flex flex-col gap-4 justify-between">
            {/* News Card 1: Obras Públicas */}
            <article className="group flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-[#e5eeff]">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Obras de pavimentación" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeQWdWO7PrHHhZAz65_Vd2iDxdi28YxpOFT_-aD_l8HnIsJav7uQuZIWD_bkNO8MxOYkXEFxoADWbOiOHEvSy4uDPJRGEhN_13_MdyKan1qka-Osl-J__v0_r1i-BvylHMJe7h4Xqq6Cx0PjpebCcC0Drz0fWgGKCxp_PfsuhckCVeaR9IE0gl5o1pcVL5YK2Tj__IPxHjX32s4nuuI4KFFQ_7fBjh0w8L139uPo-Av3rSRg7V6HzM" />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#00142f] text-xs font-semibold uppercase">
                    Obras públicas
                  </span>
                  <span className="text-[#74777f] text-xs font-semibold">• Hace 2 días</span>
                </div>
                <h3 className="text-base font-bold text-[#00142f] group-hover:text-[#9e4d97] transition-colors line-clamp-2 leading-snug">
                  Avanza la renovación integral de la calzada y desagües pluviales sobre la Av. De Los Inmigrantes
                </h3>
                <p className="text-sm text-[#44474e] line-clamp-1 mt-1">
                  Los trabajos conectan la traza urbana con el parque industrial optimizando el tránsito pesado y de colectivos.
                </p>
              </div>
              <div className="shrink-0 hidden sm:flex items-center pr-2">
                <span className="material-symbols-outlined text-[#c4c6cf] group-hover:text-[#9e4d97] transition-colors text-[24px]">chevron_right</span>
              </div>
            </article>

            {/* News Card 2: Ambiente */}
            <article className="group flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-[#e5eeff]">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Nuevo punto de reciclaje" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUGyefzZXcmyrHOCSAVDX_njdz-qukYtg14jCbWmhqYjo3Mod5arPJL6s-Dk9CHV9fNAMvucI-XjVUlIqJN-Ob2dPR3bdXw2tjTsbzHMWcsltGBMB5pn-mB8zojOea75o01EkwxlImQ1ZjCd-NsyKPFnVpmuXrc5gysYrFLNB0rwJDBaMV54ReMIdX6vPCKhIzmPDPOnG9FnV1ZE7m86h597QBNkM1AukpDjDnJuwpuulOXoxhFNsw" />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#7ffc97] text-[#003010] text-xs font-semibold uppercase">
                    Ambiente
                  </span>
                  <span className="text-[#74777f] text-xs font-semibold">• Hace 3 días</span>
                </div>
                <h3 className="text-base font-bold text-[#00142f] group-hover:text-[#9e4d97] transition-colors line-clamp-2 leading-snug">
                  Escobar sostenible suma cinco nuevos puntos verdes inteligentes con energía solar autónoma
                </h3>
                <p className="text-sm text-[#44474e] line-clamp-1 mt-1">
                  Las estaciones permiten depositar plástico, cartón, vidrio y aparatos electrónicos en desuso las 24 horas.
                </p>
              </div>
              <div className="shrink-0 hidden sm:flex items-center pr-2">
                <span className="material-symbols-outlined text-[#c4c6cf] group-hover:text-[#9e4d97] transition-colors text-[24px]">chevron_right</span>
              </div>
            </article>

            {/* News Card 3: Salud */}
            <article className="group flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-[#e5eeff]">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Hospital interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyC_VYjIECrhlijz6CD6gTb2KqLuc-61RZaHGnR1l-CLxFnhP4VoOqZr_c-Dd9-RftGGG5FmnPD2zSGl5nWT7axp17-7nCZuUr5eqqYWQIMIPA3pHV2-w7YvbOy3R3B8gqdb_Z8WUVQCGREkndR1mH4wI46E5bMGQQvTGIex-021bvgqkCJ5_oxBIaZIE0gHvD39Sc_O8acRs2ezRZoxw3T75rcOLBlxTIOKVEXoMJYEofaG1k29-U" />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#93000a] text-xs font-semibold uppercase">
                    Salud
                  </span>
                  <span className="text-[#74777f] text-xs font-semibold">• Hace 5 días</span>
                </div>
                <h3 className="text-base font-bold text-[#00142f] group-hover:text-[#9e4d97] transition-colors line-clamp-2 leading-snug">
                  El hospital Néstor Kirchner incorporó nueva tecnología de diagnóstico por imágenes de alta resolución
                </h3>
                <p className="text-sm text-[#44474e] line-clamp-1 mt-1">
                  La nueva unidad reduce a la mitad los tiempos de entrega de estudios tomográficos complejos para pacientes locales.
                </p>
              </div>
              <div className="shrink-0 hidden sm:flex items-center pr-2">
                <span className="material-symbols-outlined text-[#c4c6cf] group-hover:text-[#9e4d97] transition-colors text-[24px]">chevron_right</span>
              </div>
            </article>
          </div>

          {/* Right 30% (4 Columns in a 12-col grid): Transparencia & Gobierno Abierto Module */}
          <div className="lg:col-span-4 bg-[#00142f] text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl">
            <div>
              {/* Institutional Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-[#cce5ff] text-[36px]">policy</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0f294a] text-[#cce5ff] text-xs font-bold uppercase tracking-wider">
                  Ley 14.828
                </span>
              </div>
              <h3 className="text-lg md:text-xl text-white tracking-tight font-bold">
                Transparencia & gobierno abierto
              </h3>
              <p className="text-sm text-[#d3e4fe] mt-1">
                Acceso cívico y auditoría ciudadana permanente sobre los actos administrativos y el gasto público municipal.
              </p>

              {/* 4 Direct GovTech Access Links */}
              <div className="mt-6 space-y-2">
                <Link className="group flex items-center justify-between p-3 rounded-xl bg-[#0f294a]/80 hover:bg-[#d3e4fe] hover:text-[#0b1c30] transition-all" href="#">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#cce5ff] group-hover:text-[#9e4d97] text-[22px]">gavel</span>
                    <span className="text-base font-semibold">Boletín oficial</span>
                  </div>
                  <span className="material-symbols-outlined text-[#d3e4fe] group-hover:text-[#0b1c30] text-[18px]">arrow_forward</span>
                </Link>
                <Link className="group flex items-center justify-between p-3 rounded-xl bg-[#0f294a]/80 hover:bg-[#d3e4fe] hover:text-[#0b1c30] transition-all" href="#">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#cce5ff] group-hover:text-[#9e4d97] text-[22px]">shopping_cart_checkout</span>
                    <span className="text-base font-semibold">Licitaciones públicas</span>
                  </div>
                  <span className="material-symbols-outlined text-[#d3e4fe] group-hover:text-[#0b1c30] text-[18px]">arrow_forward</span>
                </Link>
                <Link className="group flex items-center justify-between p-3 rounded-xl bg-[#0f294a]/80 hover:bg-[#d3e4fe] hover:text-[#0b1c30] transition-all" href="#">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#cce5ff] group-hover:text-[#9e4d97] text-[22px]">description</span>
                    <span className="text-base font-semibold">Decretos municipales</span>
                  </div>
                  <span className="material-symbols-outlined text-[#d3e4fe] group-hover:text-[#0b1c30] text-[18px]">arrow_forward</span>
                </Link>
                <Link className="group flex items-center justify-between p-3 rounded-xl bg-[#0f294a]/80 hover:bg-[#d3e4fe] hover:text-[#0b1c30] transition-all" href="#">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#cce5ff] group-hover:text-[#9e4d97] text-[22px]">database</span>
                    <span className="text-base font-semibold">Portal de datos abiertos</span>
                  </div>
                  <span className="material-symbols-outlined text-[#d3e4fe] group-hover:text-[#0b1c30] text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Direct Audit Seal */}
            <div className="mt-8 pt-4 border-t border-[#0f294a]/70 flex items-center justify-between text-[#d3e4fe] text-xs font-semibold">
              <span>Escobar transparente</span>
              <span className="text-[#cce5ff] font-bold">Datos en tiempo real</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
