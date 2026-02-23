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
                    <h2 className="text-2xl font-bold text-corporate-grey font-heading">Administradores</h2>
                    <p className="text-corporate-grey/60">Gestiona los usuarios con acceso al panel</p>
                </div>
                <Link
                    href="/admin/users/new"
                    className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} />
                    Nuevo Administrador
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-corporate-grey/5 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-corporate-grey">Nombre</th>
                            <th className="px-6 py-4 font-semibold text-corporate-grey">Email</th>
                            <th className="px-6 py-4 font-semibold text-corporate-grey text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-corporate-grey/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-corporate-grey">
                                        {user.user_metadata?.firstName} {user.user_metadata?.lastName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-corporate-grey/70">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/users/${user.id}/edit`}
                                            className="p-2 text-corporate-grey/60 hover:text-primary transition-colors"
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
                                <td colSpan={3} className="px-6 py-10 text-center text-corporate-grey/50">
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
