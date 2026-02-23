import { getStacks, createStack, deleteStack } from './actions';
import { Trash2, Plus, Code } from 'lucide-react';

export default async function StacksPage() {
    const stacks = await getStacks();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-corporate-grey font-heading">Tech Stacks</h2>
                    <p className="text-corporate-grey/60">Gestiona las tecnologías disponibles para los candidatos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Creación */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-24">
                        <h3 className="text-lg font-bold text-corporate-grey mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-primary" />
                            Nueva Tecnología
                        </h3>
                        <form action={createStack} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-corporate-grey">Nombre</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Ej. React, Node.js, Python"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-corporate-grey">Icon URL (Opcional)</label>
                                <input
                                    name="icon_url"
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
                            >
                                Agregar Stack
                            </button>
                        </form>
                    </div>
                </div>

                {/* Listado */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-corporate-grey/5 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-corporate-grey">Tecnología</th>
                                    <th className="px-6 py-4 font-semibold text-corporate-grey text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {stacks.map((stack: any) => (
                                    <tr key={stack.id} className="hover:bg-corporate-grey/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                    {stack.icon_url ? (
                                                        <img src={stack.icon_url} alt={stack.name} className="w-6 h-6 object-contain" />
                                                    ) : (
                                                        <Code size={16} />
                                                    )}
                                                </div>
                                                <span className="font-medium text-corporate-grey">{stack.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <form action={async (formData) => {
                                                'use server'
                                                await deleteStack(stack.id);
                                            }}>
                                                <button
                                                    className="p-2 text-corporate-grey/60 hover:text-red-500 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                {stacks.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-10 text-center text-corporate-grey/50">
                                            No hay tecnologías registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
