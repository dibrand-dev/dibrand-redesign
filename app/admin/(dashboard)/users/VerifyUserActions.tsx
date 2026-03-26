'use client'

import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { forceVerifyUser, resendVerification } from './actions';

export default function VerifyUserActions({ id, email, isVerified }: { id: string, email: string, isVerified: boolean }) {
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);

    if (isVerified) {
        return <span className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg uppercase">Verificado</span>;
    }

    const handleVerify = async () => {
        if (!confirm('¿Estás seguro de que deseas validar manualmente esta cuenta? El usuario ya no necesitará verificar su correo electrónico.')) return;
        
        setVerifying(true);
        try {
            await forceVerifyUser(id);
        } catch (error) {
            console.error(error);
            alert('Error al verificar la cuenta: ' + (error as Error).message);
        } finally {
            setVerifying(false);
        }
    }

    const handleResend = async () => {
        setResending(true);
        try {
            await resendVerification(email);
            alert('Correo reenviado exitosamente. El usuario debería recibir un nuevo enlace para establecer su contraseña.');
        } catch (error) {
            console.error(error);
            alert('Error al reenviar correo: ' + (error as Error).message);
        } finally {
            setResending(false);
        }
    }

    return (
        <div className="flex gap-2 items-center">
            <span className="text-[10px] font-black tracking-widest text-amber-600 bg-amber-100 px-2 py-1.5 rounded-lg uppercase mr-2 shadow-sm">Pendiente</span>
            
            <button 
                onClick={handleVerify} 
                disabled={verifying || resending}
                title="Validar Manualmente"
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all shadow-sm border border-emerald-200 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
                {verifying ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            </button>
            <button 
                onClick={handleResend} 
                disabled={verifying || resending}
                title="Reenviar Correo"
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all shadow-sm border border-blue-200 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
                {resending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
            </button>
        </div>
    );
}
