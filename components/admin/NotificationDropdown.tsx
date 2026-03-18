'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Mail, Filter, CheckCircle, User, Briefcase, FileText, X, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getNotifications, markAsRead, markAllAsRead } from '@/app/admin/(dashboard)/notifications-actions';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();
    
    // Refresh periodically
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
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
      case 'candidate': return <User size={16} className="text-emerald-500" />;
      case 'lead': return <Mail size={16} className="text-blue-500" />;
      case 'system': return <FileText size={16} className="text-purple-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
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
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-gray-500 relative group"
      >
        <Bell size={20} className="group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-black text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-4 w-[380px] bg-white rounded-3xl shadow-2xl border border-admin-border overflow-hidden z-[100] ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="p-6 border-b border-admin-border flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-black text-admin-text-primary tracking-tight uppercase">NOTIFICACIONES</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-admin-accent/10 text-admin-accent rounded-full text-[10px] font-black uppercase">
                    {unreadCount} NUEVAS
                  </span>
                )}
              </div>
              <button 
                onClick={handleMarkAllAsRead}
                className="p-2 text-gray-400 hover:text-admin-accent hover:bg-admin-accent/5 rounded-xl transition-all"
                title="Marcar todas como leídas"
              >
                <CheckCircle size={18} />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-admin-border/50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-5 flex gap-4 hover:bg-zinc-50 transition-all group relative ${!notif.is_read ? 'bg-admin-accent/[0.02]' : ''}`}
                    >
                      {/* Unread dot */}
                      {!notif.is_read && (
                        <div className="absolute top-6 right-6 w-2 h-2 bg-admin-accent rounded-full shadow-sm shadow-admin-accent/50"></div>
                      )}

                      <div className={`w-10 h-10 rounded-xl ${getBg(notif.type)} flex items-center justify-center shrink-0 border border-white shadow-sm`}>
                        {getIcon(notif.type)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-col">
                           <p className={`text-xs ${!notif.is_read ? 'font-bold' : 'font-medium'} text-admin-text-primary line-clamp-1`}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-admin-text-secondary leading-relaxed line-clamp-2">
                            {notif.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock size={10} /> 
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: es })}
                          </p>
                          
                          <Link 
                            href={notif.link || '#'} 
                            onClick={(e) => {
                              if (!notif.link || notif.link === '#') e.preventDefault();
                              handleMarkAsRead(notif.id);
                              setIsOpen(false);
                            }}
                            className="text-[9px] font-black text-admin-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5"
                          >
                            Detalles <ChevronRight size={10} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <Bell size={24} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium italic">Sin notificaciones.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-50 border-t border-admin-border">
              <Link
                href="/admin/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-3 bg-white border border-admin-border text-[11px] font-black text-admin-text-primary uppercase tracking-widest rounded-xl hover:bg-admin-accent hover:border-transparent hover:text-white transition-all shadow-sm active:scale-95"
              >
                Ver todas las notificaciones
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
