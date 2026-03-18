'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, Trash2, User, Mail, FileText, ChevronRight, Inbox } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '@/app/admin/(dashboard)/notifications-actions';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (e) {
            console.error('Failed to fetch notifications:', e);
        }
        setLoading(false);
    };

    const handleMarkAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        await markAsRead(id);
    };

    const handleMarkAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        await markAllAsRead();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'candidate': return <User size={20} className="text-emerald-500" />;
            case 'lead': return <Mail size={20} className="text-blue-500" />;
            case 'system': return <FileText size={20} className="text-purple-500" />;
            default: return <Bell size={20} className="text-gray-500" />;
        }
    };

    const getBg = (type: string) => {
        switch (type) {
            case 'candidate': return 'bg-emerald-50';
            case 'lead': return 'bg-blue-50';
            case 'system': return 'bg-purple-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-admin-text-primary tracking-tight">Todas las Notificaciones</h2>
                    <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Historial completo de alertas y eventos.</p>
                </div>
                
                <button 
                    onClick={handleMarkAllAsRead}
                    disabled={notifications.every(n => n.is_read)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-admin-accent text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-admin-accent/20"
                >
                    <CheckCircle size={16} />
                    Marcar todas como leídas
                </button>
            </div>

            {/* Content Card */}
            <div className="bg-admin-card-bg rounded-3xl border border-admin-border shadow-sm overflow-hidden min-h-[500px]">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-admin-accent/20 border-t-admin-accent rounded-full animate-spin"></div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cargando historial...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-admin-border/50">
                        {notifications.map((notif) => (
                            <div 
                                key={notif.id}
                                className={`p-8 flex gap-6 hover:bg-zinc-50 transition-all group relative ${!notif.is_read ? 'bg-admin-accent/[0.01]' : ''}`}
                            >
                                {!notif.is_read && (
                                    <div className="absolute top-1/2 -translate-y-1/2 left-2 w-1.5 h-1.5 bg-admin-accent rounded-full"></div>
                                )}

                                <div className={`w-14 h-14 rounded-2xl ${getBg(notif.type)} flex items-center justify-center shrink-0 border-2 border-white shadow-sm transition-transform group-hover:scale-110 duration-300`}>
                                    {getIcon(notif.type)}
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className={`text-base ${!notif.is_read ? 'font-black' : 'font-bold'} text-admin-text-primary flex items-center gap-2`}>
                                                {notif.title}
                                                {!notif.is_read && <span className="px-2 py-0.5 bg-admin-accent text-white rounded-full text-[8px] font-black uppercase tracking-tighter">Nueva</span>}
                                            </h4>
                                            <p className="text-sm text-admin-text-secondary font-medium mt-1">
                                                {notif.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                            <span className="flex items-center gap-1"><Clock size={12}/> {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: es })}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getBg(notif.type)} ${notif.type === 'candidate' ? 'text-emerald-600' : notif.type === 'lead' ? 'text-blue-600' : 'text-purple-600'}`}>
                                                {notif.type}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {!notif.is_read && (
                                                <button 
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                    className="text-[10px] font-black text-admin-accent hover:underline uppercase tracking-widest"
                                                >
                                                    Marcar leída
                                                </button>
                                            )}
                                            {notif.link && (
                                                <Link 
                                                    href={notif.link}
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                    className="flex items-center gap-1 px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-admin-accent transition-colors shadow-lg shadow-zinc-900/10"
                                                >
                                                    Ver Detalle <ChevronRight size={12} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-32 flex flex-col items-center justify-center space-y-6 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <Inbox size={48} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-admin-text-primary italic">Bandeja de entrada vacía</p>
                            <p className="text-sm text-gray-400 font-medium mt-2">No tienes notificaciones pendientes en este momento.</p>
                        </div>
                        <Link href="/admin" className="px-8 py-3 bg-zinc-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-admin-accent transition-all shadow-xl shadow-zinc-900/10">
                            Volver al Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
