'use client'

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function MessageButton() {
    const scrollToNotes = () => {
        const element = document.getElementById('recruiter-notes');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Focus textarea if it exists
            setTimeout(() => {
                const textarea = element.querySelector('textarea');
                if (textarea) textarea.focus();
            }, 600);
        }
    };

    return (
        <button 
            onClick={scrollToNotes}
            className="px-8 py-3 rounded-xl border border-[#E1E2E5] text-[13px] font-bold text-[#191C1D] hover:bg-[#F8FAFC] transition-all bg-white shadow-sm flex items-center gap-2 active:scale-[0.98]"
        >
            <MessageSquare size={18} /> Message
        </button>
    );
}
