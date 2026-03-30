'use client';
import { Instagram, Linkedin, Facebook, Twitter } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          {/* Logo Minimal */}
          <div className="text-2xl font-montserrat font-black tracking-tighter text-black flex items-center gap-1">
            Dibrand<span className="w-1.5 h-1.5 bg-gradient-to-r from-[#D83484] to-[#A3369D] rounded-full mt-1.5" />
          </div>

          {/* Copyright Técnico */}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center md:text-left">
            © {new Date().getFullYear()} Dibrand.co Engineering & Strategy. All rights reserved.
          </p>

          {/* Social Icons B&N */}
          <div className="flex gap-8 text-black/40">
            <a href="https://www.instagram.com/dibrand.ok/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://www.linkedin.com/company/dibrand/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://x.com/Dibrand_ok" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
