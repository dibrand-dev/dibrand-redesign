'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SlideOverProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    /** Optional title for the header */
    title?: string;
    /** Optional subtitle / description */
    subtitle?: string;
    /** Width class — defaults to ~45% on desktop, 100% on mobile */
    widthClass?: string;
    /** Optional header actions (buttons, etc.) */
    headerActions?: React.ReactNode;
    /** If true, hides the default header entirely (for custom headers) */
    hideHeader?: boolean;
}

/**
 * SlideOver — accessible panel that slides in from the right.
 *
 * - Desktop: 45% width with backdrop blur
 * - Mobile: 100% width, swipe-to-close gesture (via drag)
 * - Focus trap via overlay click, Escape key
 * - Uses framer-motion for smooth spring animations
 */
export default function SlideOver({
    open,
    onClose,
    children,
    title,
    subtitle,
    widthClass = 'w-full sm:w-[480px] lg:w-[45vw] xl:w-[40vw]',
    headerActions,
    hideHeader = false,
}: SlideOverProps) {

    // Close on Escape
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [open, handleKeyDown]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.x > 100 || info.velocity.x > 500) onClose();
                        }}
                        className={`relative ${widthClass} max-w-full h-full bg-white shadow-2xl flex flex-col`}
                        role="dialog"
                        aria-modal="true"
                        aria-label={title || 'Panel'}
                    >
                        {/* Header */}
                        {!hideHeader && (
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0 bg-white z-10">
                                <div className="min-w-0 flex-1">
                                    {title && (
                                        <h2 className="text-[18px] font-extrabold text-slate-900 truncate">
                                            {title}
                                        </h2>
                                    )}
                                    {subtitle && (
                                        <p className="text-[12px] text-slate-500 font-medium mt-0.5 truncate">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-4">
                                    {headerActions}
                                    <button
                                        onClick={onClose}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                                        aria-label="Close panel"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Content — scrollable */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {children}
                        </div>

                        {/* Drag handle for mobile — visual hint */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-slate-300 sm:hidden" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
