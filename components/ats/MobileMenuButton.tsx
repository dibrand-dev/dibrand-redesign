'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';

export default function MobileMenuButton() {
    const { toggle } = useSidebar();

    return (
        <button 
            onClick={toggle}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            aria-label="Toggle Menu"
        >
            <Menu size={24} />
        </button>
    );
}
