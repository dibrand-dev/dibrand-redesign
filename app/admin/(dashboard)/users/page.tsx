import Link from 'next/link';
import { getUsers } from './actions';
import { Plus, Edit } from 'lucide-react';
import DeleteUserButton from './DeleteUserButton';

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-admin-text-primary tracking-tight">Administradores</h2>
                    <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Gestiona los usuarios con acceso al panel</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/users/invite-recruiter"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-admin-border text-admin-text-primary font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <Plus size={20} className="text-indigo-600" />
                        Invitar Reclutador
                    </Link>
                    <Link
                        href="/admin/users/new"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-admin-accent text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-admin-accent/20 active:scale-95"
                    >
                        <Plus size={20} />
                        Nuevo Administrador
                    </Link>
                </div>
            </div>

            <div className="bg-admin-card-bg rounded-xl shadow-sm border border-admin-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-admin-bg/50 border-b border-admin-border">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-admin-bg/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-admin-text-primary group-hover:text-admin-accent transition-colors">
                                        {user.user_metadata?.firstName} {user.user_metadata?.lastName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-admin-text-secondary font-medium italic">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 text-right">
                                        <Link
                                            href={`/admin/users/${user.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-admin-accent hover:bg-admin-accent/5 rounded-xl transition-all"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <DeleteUserButton id={user.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-admin-text-secondary italic font-medium">
                                    No hay administradores registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
