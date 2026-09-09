import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#00142f] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-10 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-4">
            <span className="text-[#d3e4fe]">Accesibilidad:</span>
            <div className="flex items-center gap-2">
              <button aria-label="Alto contraste" className="px-2 py-0.5 rounded bg-[#0f294a] text-white hover:bg-[#d3e4fe] hover:text-[#0b1c30] transition-colors flex items-center gap-1" type="button">
                <span className="material-symbols-outlined text-[14px]">contrast</span>
                <span className="hidden sm:inline">Contraste</span>
              </button>
              <button aria-label="Disminuir tamaño de fuente" className="px-2 py-0.5 rounded bg-[#0f294a] text-white hover:bg-[#d3e4fe] hover:text-[#0b1c30] transition-colors font-bold" type="button">A-</button>
              <button aria-label="Aumentar tamaño de fuente" className="px-2 py-0.5 rounded bg-[#0f294a] text-white hover:bg-[#d3e4fe] hover:text-[#0b1c30] transition-colors font-bold" type="button">A+</button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link className="text-[#d3e4fe] hover:text-white transition-colors flex items-center gap-1" href="#">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Intranet municipal</span>
            </Link>
            <Link className="bg-[#0f294a] text-white px-3 py-1 rounded hover:bg-[#d3e4fe] hover:text-[#0b1c30] transition-colors flex items-center gap-1 text-sm font-semibold" href="#">
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Atención 147</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Nav */}
      <div className="bg-white">
        <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <img alt="Logo Escobar" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1UlSPefOWKKovPsmFrPIgA4bESWRpLK8hwR5CtqQTLUUSNysNBKD0-VmJRejv257b19WnEzAPxQFrOVS6MuUSbVCLwYkpEAMTSKDbU5ILmEociB0jLDFYYK3fCB1vwaPtyik3H3H6tLFBSJBBQFJ6cRBSClJ2wjLCXVHX1Ls9uPmazgOmKoW42mR1yFmqigkEl0dSHLu5VcyYCd5xoGdhblP2KxwwsEJV2scJgB_Q0zjHg8WwYw47Ru3Gv1djVgQOPfpGHYtFkv" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#00142f] leading-tight tracking-tight">Municipio de Escobar</span>
              <span className="text-xs text-[#9e4d97] font-semibold uppercase tracking-wider">Gobierno municipal</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-2">
            <Link className="px-4 py-2 rounded-xl text-base text-[#44474e] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors" href="#">El municipio</Link>
            <Link className="px-4 py-2 rounded-xl text-base text-[#44474e] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors" href="#">Áreas de gestión</Link>
            <Link className="px-4 py-2 rounded-xl text-base text-[#44474e] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors" href="#">Disfrutá Escobar</Link>
            <Link className="px-4 py-2 rounded-xl text-base text-[#44474e] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors" href="#">Novedades</Link>
          </nav>
          
          <div className="flex items-center gap-4 shrink-0">
            <Link className="bg-[#9e4d97] text-white px-6 py-2 rounded-xl text-base font-semibold hover:bg-[#823d7c] transition-colors flex items-center gap-2 shadow-sm" href="#">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              <span>Ingresar a Escobar 360°</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#00142f] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
