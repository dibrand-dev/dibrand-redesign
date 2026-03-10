import { getStacks, createStack, deleteStack } from './actions';
import { Trash2, Plus, Code } from 'lucide-react';

export default async function StacksPage() {
    const stacks = await getStacks();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-admin-text-primary tracking-tight">Tech Stacks</h2>
                    <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Gestiona las tecnologías disponibles para candidatos y casos de éxito.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Creación */}
                <div className="lg:col-span-1">
                    <div className="bg-admin-card-bg p-6 rounded-2xl border border-admin-border shadow-sm sticky top-24">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Plus size={16} className="text-admin-accent" />
                            Nueva Tecnología
                        </h3>
                        <form action={createStack} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-wider ml-1">Nombre</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-admin-border focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none transition-all font-medium text-sm bg-admin-bg/50"
                                    placeholder="Ej. React, Node.js, Python"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-wider ml-1">Icon URL (Opcional)</label>
                                <input
                                    name="icon_url"
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-xl border border-admin-border focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none transition-all font-medium text-sm bg-admin-bg/50"
                                    placeholder="https://..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-admin-accent text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-admin-accent/20 active:scale-95"
                            >
                                Agregar Stack
                            </button>
                        </form>
                    </div>
                </div>

                {/* Listado */}
                <div className="lg:col-span-2">
                    <div className="bg-admin-card-bg rounded-2xl border border-admin-border shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-admin-bg/50 border-b border-admin-border">
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tecnología</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-admin-border">
                                {stacks.map((stack: any) => (
                                    <tr key={stack.id} className="hover:bg-admin-bg/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-admin-bg flex items-center justify-center text-gray-400 group-hover:bg-admin-card-bg transition-colors border border-transparent group-hover:border-admin-border">
                                                    {stack.icon_url ? (
                                                        <img src={stack.icon_url} alt={stack.name} className="w-6 h-6 object-contain" />
                                                    ) : (
                                                        <Code size={18} />
                                                    )}
                                                </div>
                                                <span className="font-bold text-admin-text-primary text-sm group-hover:text-admin-accent transition-colors">{stack.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <form action={async (formData) => {
                                                'use server'
                                                await deleteStack(stack.id);
                                            }}>
                                                <button
                                                    className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
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
                                        <td colSpan={2} className="px-6 py-16 text-center text-gray-400 text-sm italic">
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
