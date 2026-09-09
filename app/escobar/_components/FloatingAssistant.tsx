import Link from "next/link";

export default function FloatingAssistant() {
  return (
    <aside className="fixed bottom-24 right-6 z-40">
      <Link className="group flex items-center gap-3 bg-[#7ffc97] text-[#003010] hover:bg-[#1aa54c] hover:text-white px-6 py-4 rounded-full shadow-[0_4px_12px_-2px_rgba(15,41,74,0.18)] transition-all duration-200" href="#">
        <div className="w-9 h-9 rounded-full bg-[#003010] text-[#1aa54c] group-hover:bg-white group-hover:text-[#003010] flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[22px]">chat</span>
        </div>
        <div className="flex flex-col text-left pr-1">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80 leading-none">Asistente virtual</span>
          <span className="text-base font-bold leading-tight">Hablá con Flora</span>
        </div>
      </Link>
    </aside>
  );
}
