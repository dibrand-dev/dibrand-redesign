"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#00142f] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-10 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-4">
            <span className="text-[#d3e4fe] hidden sm:inline">Accesibilidad:</span>
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
            <Link className="bg-[#0f294a] text-white px-3 py-1 rounded hover:bg-[#d3e4fe] hover:text-[#0b1c30] transition-colors flex items-center gap-1 text-sm font-semibold" href="#">
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Atención 147</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Nav */}
      <div className="bg-white relative">
        <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Hamburger Button (Mobile Only) */}
            <button 
              className="lg:hidden p-2 -ml-2 text-[#00142f] hover:bg-[#f8f9ff] rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menú principal"
            >
              <span className="material-symbols-outlined text-[28px]">
                {isMenuOpen ? "close" : "menu"}
              </span>
            </button>
            
            <img alt="Logo Escobar" className="h-9 sm:h-11 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1UlSPefOWKKovPsmFrPIgA4bESWRpLK8hwR5CtqQTLUUSNysNBKD0-VmJRejv257b19WnEzAPxQFrOVS6MuUSbVCLwYkpEAMTSKDbU5ILmEociB0jLDFYYK3fCB1vwaPtyik3H3H6tLFBSJBBQFJ6cRBSClJ2wjLCXVHX1Ls9uPmazgOmKoW42mR1yFmqigkEl0dSHLu5VcyYCd5xoGdhblP2KxwwsEJV2scJgB_Q0zjHg8WwYw47Ru3Gv1djVgQOPfpGHYtFkv" />
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-semibold text-[#00142f] leading-tight tracking-tight">Municipio de Escobar</span>
              <span className="hidden sm:block text-xs text-[#006398] font-semibold uppercase tracking-wider">Gobierno municipal</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-2">
            <Link className="px-4 py-2 rounded-xl text-base text-[#44474e] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors" href="#">El municipio</Link>
            <Link className="px-4 py-2 rounded-xl text-base text-[#44474e] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors" href="#">Áreas de gestión</Link>
            <Link className="px-4 py-2 rounded-xl text-base text-[#44474e] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors" href="#">Disfrutá Escobar</Link>
            <Link className="px-4 py-2 rounded-xl text-base text-[#44474e] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors" href="#">Novedades</Link>
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link className="hidden md:flex bg-[#006398] text-white px-6 py-2 rounded-xl text-base font-semibold hover:bg-[#004a74] transition-colors items-center gap-2 shadow-sm" href="#">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              <span>Ingresar a Escobar 360°</span>
            </Link>
            <Link className="md:hidden bg-[#006398] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#004a74] transition-colors shadow-sm" href="#">
              Ingresar
            </Link>
            <div className="hidden sm:flex w-8 h-8 rounded-full bg-[#00142f] items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-[#f8f9ff] py-4 px-6 flex flex-col gap-2">
            <Link className="px-4 py-3 rounded-xl text-base font-semibold text-[#00142f] hover:bg-[#e5eeff] transition-colors" href="#" onClick={() => setIsMenuOpen(false)}>El municipio</Link>
            <Link className="px-4 py-3 rounded-xl text-base font-semibold text-[#00142f] hover:bg-[#e5eeff] transition-colors" href="#" onClick={() => setIsMenuOpen(false)}>Áreas de gestión</Link>
            <Link className="px-4 py-3 rounded-xl text-base font-semibold text-[#00142f] hover:bg-[#e5eeff] transition-colors" href="#" onClick={() => setIsMenuOpen(false)}>Disfrutá Escobar</Link>
            <Link className="px-4 py-3 rounded-xl text-base font-semibold text-[#00142f] hover:bg-[#e5eeff] transition-colors" href="#" onClick={() => setIsMenuOpen(false)}>Novedades</Link>
          </div>
        )}
      </div>
    </header>
  );
}
