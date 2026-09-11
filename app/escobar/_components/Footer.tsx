import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#00142f] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img alt="Logo Escobar" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1UlSPefOWKKovPsmFrPIgA4bESWRpLK8hwR5CtqQTLUUSNysNBKD0-VmJRejv257b19WnEzAPxQFrOVS6MuUSbVCLwYkpEAMTSKDbU5ILmEociB0jLDFYYK3fCB1vwaPtyik3H3H6tLFBSJBBQFJ6cRBSClJ2wjLCXVHX1Ls9uPmazgOmKoW42mR1yFmqigkEl0dSHLu5VcyYCd5xoGdhblP2KxwwsEJV2scJgB_Q0zjHg8WwYw47Ru3Gv1djVgQOPfpGHYtFkv" />
              <span className="text-xl font-bold tracking-tight text-white">Escobar</span>
            </div>
            <span className="text-sm font-semibold text-[#d3e4fe] uppercase tracking-wider">Teléfonos de emergencia</span>
            <ul className="space-y-2 text-xl font-bold">
              <li className="flex items-center justify-between bg-[#0f294a]/60 p-3 rounded-lg">
                <span className="text-base text-[#d3e4fe] font-normal">SAME</span>
                <span className="text-[#cce5ff]">107</span>
              </li>
              <li className="flex items-center justify-between bg-[#0f294a]/60 p-3 rounded-lg">
                <span className="text-base text-[#d3e4fe] font-normal">Policía</span>
                <span className="text-[#cce5ff]">911</span>
              </li>
              <li className="flex items-center justify-between bg-[#0f294a]/60 p-3 rounded-lg">
                <span className="text-base text-[#d3e4fe] font-normal">Bomberos</span>
                <span className="text-[#cce5ff]">100</span>
              </li>
              <li className="bg-[#0f294a]/60 p-3 rounded-lg">
                <span className="block text-xs font-semibold text-[#d3e4fe] font-normal">Ojos y oídos en alerta</span>
                <span className="text-lg text-[#cce5ff] font-bold">0800-555-5040</span>
              </li>
            </ul>
          </div>
          
          {/* Col 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white">Redes sociales oficiales</h3>
            <span className="text-sm text-[#d3e4fe]">Canales oficiales de comunicación y difusión ciudadana:</span>
            <div className="flex flex-col gap-3 text-sm font-semibold">
              <span className="text-[#cce5ff]">@escobargobar</span>
              <Link className="flex items-center gap-2 text-[#d3e4fe] hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">camera</span>
                <span>Instagram</span>
              </Link>
              <Link className="flex items-center gap-2 text-[#d3e4fe] hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">public</span>
                <span>Facebook</span>
              </Link>
              <Link className="flex items-center gap-2 text-[#d3e4fe] hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">smart_display</span>
                <span>YouTube</span>
              </Link>
              <Link className="flex items-center gap-2 text-[#d3e4fe] hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">tag</span>
                <span>X (ex Twitter)</span>
              </Link>
            </div>
          </div>
          
          {/* Col 3 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white">Gobierno abierto</h3>
            <ul className="space-y-3 text-base">
              <li className="text-[#d3e4fe] hover:text-white transition-colors">
                <Link href="#">Rendimos cuentas</Link>
              </li>
              <li className="text-[#d3e4fe] hover:text-white transition-colors">
                <Link href="#">Presupuesto municipal</Link>
              </li>
              <li className="text-[#d3e4fe] hover:text-white transition-colors">
                <Link href="#">Portal de datos abiertos</Link>
              </li>
              <li className="text-[#d3e4fe] hover:text-white transition-colors">
                <Link href="#">Boletín oficial de Escobar</Link>
              </li>
            </ul>
          </div>
          
          {/* Col 4 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white">Sede central</h3>
            <div className="flex flex-col gap-2 text-base text-[#d3e4fe]">
              <span className="text-base text-white font-semibold">Palacio municipal</span>
              <span>Estrada 599, Belén de Escobar</span>
              <span>Provincia de Buenos Aires, Argentina</span>
              <span>Código postal: B1625</span>
            </div>
            <div className="mt-4 pt-4 border-t border-[#0f294a] flex flex-col gap-2 text-sm">
              <Link className="text-[#d3e4fe] hover:text-white transition-colors" href="#">Políticas de privacidad</Link>
              <Link className="text-[#d3e4fe] hover:text-white transition-colors" href="#">Términos y condiciones del servicio</Link>
            </div>
          </div>
          
        </div>
        
        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-[#0f294a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#d3e4fe]">
          <span>© 2025 Municipalidad de Escobar. Todos los derechos reservados.</span>
          <div className="flex items-center gap-2">
            <span>Desarrollado por:</span>
            <Link href="https://www.dibrand.co/es" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD6VzAy75tC7gG6WveW8C00zxUCE1N_GFe-B1MnvaygWhGg02knumRBXsXbk9l0CoTNRN1983-h2R6spxfGVTzFyiQEyedPpBfe0ZoxFlMNmPTiKcCkSgZ2ApZKT8Unos3SGwdDoqwR8zaVaRjgSupVyKUlKiqcNkBQBP9uua9Q_KJUQFU7xQDlE3zgWXREyR-nOuLLshv0eTRXAMJzU5TH7ZQQ_zSTG-xYovdOHrmhFfCRR_rajPHtXEzun9WjqqVwQ" alt="DIBRAND" className="h-7 w-auto object-contain brightness-100" />
            </Link>
          </div>
          <span>Cumple con el estándar de accesibilidad Web WCAG 2.1 AA</span>
        </div>
      </div>
    </footer>
  );
}
