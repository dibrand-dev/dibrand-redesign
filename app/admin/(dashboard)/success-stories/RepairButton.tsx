'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { fixAllDataConsistency } from './actions';

export default function RepairButton() {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleRepair = async () => {
        if (!confirm('¿Deseas reparar la consistencia de los datos? Esto asignará órdenes y estados por defecto y sincronizará todas las tablas.')) return;

        setLoading(true);
        try {
            await fixAllDataConsistency();
            setDone(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (e) {
            alert('Error repair data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRepair}
            disabled={loading || done}
            className={`inline-flex items-center gap-2 px-4 py-3 border border-admin-border rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${done ? 'bg-emerald-500 text-white border-transparent' : 'text-admin-text-secondary hover:bg-admin-card-bg'
                }`}
        >
            {loading ? (
                <RefreshCw size={14} className="animate-spin" />
            ) : done ? (
                <CheckCircle2 size={14} />
            ) : (
                <RefreshCw size={14} />
            )}
            <span>{loading ? 'Reparando...' : done ? '¡Listo!' : 'Reparar Datos'}</span>
        </button>
    );
}
