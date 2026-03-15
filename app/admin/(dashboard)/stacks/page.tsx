import { getStacks, deleteStack } from './actions';
import { Trash2, Code } from 'lucide-react';
import StackForm from './StackForm';

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
                {/* Formulario de Creación (Client Component) */}
                <div className="lg:col-span-1">
                    <StackForm />
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
