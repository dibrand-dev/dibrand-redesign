'use client';

import React, { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { disconnectGoogleCalendar } from '../../actions';

interface GoogleIntegrationProps {
    isConnected: boolean;
}

export default function GoogleIntegration({ isConnected }: GoogleIntegrationProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConnect = () => {
        setIsLoading(true);
        // Redirect to the API route that starts the Google OAuth flow
        window.location.href = '/api/auth/google';
    };

    const handleDisconnect = async () => {
        if (!confirm('¿Estás seguro de que deseas desconectar Google Calendar?')) return;
        setIsLoading(true);
        try {
            await disconnectGoogleCalendar();
            // Refreshing via router is handled by revalidatePath in the server action,
            // but for better UX we might want a hard reload if needed or just let it update.
        } catch (error) {
            console.error('Error disconnecting Google Calendar:', error);
            alert('Error al desconectar Google Calendar');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center p-4 bg-[#FAFAFA] border border-slate-100/80 rounded-[16px] hover:border-slate-200 transition-colors shadow-sm">
            <div className="w-9 h-9 flex items-center justify-center shrink-0 mr-4">
                <Calendar size={22} className="text-red-500" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
                <h4 className="text-[13px] font-extrabold text-slate-900 leading-tight">Google Calendar</h4>
                {isConnected ? (
                    <span className="text-[9px] font-black tracking-widest text-emerald-600 uppercase">CONNECTED</span>
                ) : (
                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">NOT CONNECTED</span>
                )}
            </div>
            {isLoading ? (
                <Loader2 size={16} className="animate-spin text-slate-400" />
            ) : isConnected ? (
                <button 
                    onClick={handleDisconnect}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                    Disconnect
                </button>
            ) : (
                <button 
                    onClick={handleConnect}
                    className="text-[12px] font-bold text-[#0B4FEA] hover:text-blue-800 transition-colors"
                >
                    Connect
                </button>
            )}
        </div>
    );
}
