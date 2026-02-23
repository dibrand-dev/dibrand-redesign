import { getUser } from '../../actions';
import EditUserForm from './EditUserForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
        return <div>Usuario no encontrado</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/users" className="p-2 hover:bg-corporate-grey/5 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-corporate-grey font-heading">Editar Administrador</h2>
                    <p className="text-corporate-grey/60">Actualiza los datos del usuario</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
                <EditUserForm user={user} />
            </div>
        </div>
    );
}
