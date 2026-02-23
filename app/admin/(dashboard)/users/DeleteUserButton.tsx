'use client'

import { Trash2 } from 'lucide-react';
import { deleteUser } from './actions';
import { useState } from 'react';

export default function DeleteUserButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (confirm('¿Estás seguro de que deseas eliminar este administrador?')) {
            setLoading(true);
            try {
                await deleteUser(id);
            } catch (error: any) {
                alert(error.message || 'Error al eliminar usuario');
                setLoading(false);
            }
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-corporate-grey/60 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Eliminar usuario"
        >
            <Trash2 size={18} />
        </button>
    );
}
