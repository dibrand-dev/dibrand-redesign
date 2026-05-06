'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, Inbox, Loader2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { getNotifications, markAsRead, markAllAsRead } from '@/app/admin/(dashboard)/notifications-actions';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const fetchNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
        setLoading(false);
    };

    // Derive unread count from notifications state
    const syncUnreadCount = (notifs: any[]) => {
        setUnreadCount(notifs.filter((n: any) => !n.is_read).length);
    };

    useEffect(() => {
        fetchNotifications();

        // Subscribe to changes
        const channel = supabase
            .channel('notifications-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    console.log('New notification received:', payload);
                    setNotifications(prev => {
                        const next = [payload.new, ...prev];
                        syncUnreadCount(next);
                        return next;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    setNotifications(prev => {
                        // Fix race condition: if we already marked it as read locally,
                        // don't overwrite with a stale Realtime payload that still has is_read=false
                        const existing = prev.find(n => n.id === payload.new.id);
                        if (existing?.is_read && !payload.new.is_read) {
                            // Our optimistic update is ahead — ignore this stale payload
                            return prev;
                        }
                        const next = prev.map(n => n.id === payload.new.id ? payload.new : n);
                        syncUnreadCount(next);
                        return next;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Handle click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        // Optimistic update first — prevents UI flicker
        setNotifications(prev => {
            const next = prev.map(n => n.id === id ? { ...n, is_read: true } : n);
            syncUnreadCount(next);
            return next;
        });
        const result = await markAsRead(id);
        if (!result.success) {
            // Rollback on failure
            console.error('markAsRead failed, rolling back optimistic update');
            fetchNotifications();
        }
    };

    const handleMarkAllAsRead = async () => {
        // Optimistic update first
        setNotifications(prev => {
            const next = prev.map(n => ({ ...n, is_read: true }));
            syncUnreadCount(next);
            return next;
        });
        const result = await markAllAsRead();
        if (!result.success) {
            console.error('markAllAsRead failed, rolling back');
            fetchNotifications();
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'nota': return 'bg-amber-500';
            case 'estado': return 'bg-blue-500';
            case 'asignación': return 'bg-emerald-500';
            case 'recordatorio': return 'bg-purple-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative ${isOpen ? 'bg-[#F1F5F9] text-[#0040A1]' : 'text-slate-400 hover:bg-[#F1F5F9] hover:text-[#191C1D]'}`}
            >
                <Bell size={24} className={`flex-shrink-0 ${unreadCount > 0 ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''}`} />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B3261E] opacity-75"></span>
                        <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-[#B3261E] text-white text-[10px] font-bold border-[1.5px] border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[calc(100vw-1.5rem)] md:absolute md:top-auto md:mt-4 md:left-auto md:translate-x-0 md:right-0 md:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[100] md:origin-top-right origin-top"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-[13px] text-slate-900 uppercase tracking-widest">Notificaciones</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-admin-accent/10 text-admin-accent text-[10px] font-bold rounded-full">
                                        {unreadCount} nuevas
                                    </span>
                                )}
                            </div>
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="text-[10px] font-black text-admin-accent hover:underline uppercase tracking-tighter"
                            >
                                Marcar todas como leídas
                            </button>
                        </div>

                        {/* List */}
                        <div className="max-h-[70vh] md:max-h-[450px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                                    <Loader2 size={24} className="animate-spin text-admin-accent" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">Cargando...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                        <Inbox size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-slate-900 text-sm uppercase">Sin notificaciones</p>
                                        <p className="text-[11px] text-slate-400 font-medium italic">Te avisaremos cuando pase algo importante.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif.id}
                                            className={`p-5 md:p-5 flex gap-4 hover:bg-slate-50/80 transition-colors relative group ${!notif.is_read ? 'bg-admin-accent/[0.02]' : ''}`}
                                        >
                                            <div className="shrink-0 pt-1">
                                                <div className={`w-2 h-2 rounded-full ${getTypeColor(notif.type)} ${!notif.is_read ? 'animate-pulse ring-4 ring-slate-100' : 'opacity-40'}`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-[13px] leading-tight break-words whitespace-normal ${!notif.is_read ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap pt-0.5 shrink-0">
                                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: es })}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-slate-500 font-medium whitespace-normal break-words">
                                                    {notif.message}
                                                </p>
                                                
                                                <div className="flex items-center gap-3 pt-3">
                                                    {notif.link && (
                                                        <Link 
                                                            href={notif.link}
                                                            onClick={() => {
                                                                handleMarkAsRead(notif.id);
                                                                setIsOpen(false);
                                                            }}
                                                            className="flex items-center gap-1 text-[11px] font-black text-admin-accent uppercase tracking-widest hover:underline"
                                                        >
                                                            Ver detalles <ExternalLink size={12} />
                                                        </Link>
                                                    )}
                                                    {!notif.is_read && (
                                                        <button 
                                                            onClick={() => handleMarkAsRead(notif.id)}
                                                            className="flex items-center gap-1 text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
                                                        >
                                                            <Check size={12} /> Marcar leído
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {!notif.is_read && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-admin-accent"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
                                <Link 
                                    href="/admin/notifications" 
                                    className="text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Ver historial completo
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <style jsx global>{`
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(10deg); }
                    75% { transform: rotate(-10deg); }
                }
            `}</style>
        </div>
    );
}
