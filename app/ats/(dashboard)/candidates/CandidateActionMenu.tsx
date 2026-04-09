'use client'

import React, { useState } from 'react';
import { 
    MoreVertical, 
    ExternalLink, 
    UserPlus, 
    RefreshCw, 
    Check, 
    Loader2, 
    Trash2, 
    History,
    FileText
} from 'lucide-react';
import { updateCandidateStatus, assignRecruiter, deleteCandidate } from '../../actions';
import { capitalizeName } from '@/lib/utils';

interface Recruiter {
    id: string;
    full_name: string;
}

interface CandidateActionMenuProps {
    candidateId: string;
    currentStatus: string;
    recruiters: Recruiter[];
    userRole: string;
}

export default function CandidateActionMenu({ 
    candidateId, 
    currentStatus, 
    recruiters,
    userRole 
}: CandidateActionMenuProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showRecruiterMenu, setShowRecruiterMenu] = useState(false);

    const isAdmin = userRole === 'admin';
    const isRecruiterOrAdmin = userRole === 'recruiter' || isAdmin;

    const statuses = ['Nuevo', 'Screening', 'Interview', 'Offered', 'Rejected'];

    const handleStatusUpdate = async (newStatus: string) => {
        setLoading(true);
        try {
            await updateCandidateStatus(candidateId, newStatus);
            setOpen(false);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setLoading(false);
            setShowStatusMenu(false);
        }
    };

    const handleAssignRecruiter = async (recruiterId: string) => {
        setLoading(true);
        try {
            await assignRecruiter(candidateId, recruiterId);
            setOpen(false);
        } catch (error) {
            console.error('Error assigning recruiter:', error);
        } finally {
            setLoading(false);
            setShowRecruiterMenu(false);
        }
    };

    const handleEditNotes = () => {
        alert('Edit Notes functionality not yet implemented.');
        setOpen(false);
    };

    const handleViewAuditLog = () => {
        alert('View Audit Log functionality not yet implemented.');
        setOpen(false);
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de eliminar este candidato?')) return;
        setLoading(true);
        try {
            await deleteCandidate(candidateId);
            setOpen(false);
        } catch (error) {
            console.error('Error deleting candidate:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                    href={`/admin/candidates/${candidateId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Ver Perfil"
                >
                    <ExternalLink size={18} />
                </a>
                <button 
                    onClick={() => setOpen(!open)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                    {loading ? <Loader2 size={18} className="animate-spin text-indigo-600" /> : <MoreVertical size={18} />}
                </button>
            </div>

            {open && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => { setOpen(false); setShowStatusMenu(false); setShowRecruiterMenu(false); }}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in duration-200">
                        {/* Common Actions (Recruiters & Admins) */}
                        <div className="px-2">
                            <button 
                                onClick={handleEditNotes}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                <FileText size={14} className="text-slate-400" />
                                <span>Editar Notas</span>
                            </button>

                            <button 
                                onClick={() => { setShowStatusMenu(!showStatusMenu); setShowRecruiterMenu(false); }}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <RefreshCw size={14} className="text-slate-400" />
                                    <span>Cambiar Estado</span>
                                </div>
                                <span className={`text-[9px] text-slate-400 transition-transform ${showStatusMenu ? 'rotate-90' : ''}`}>►</span>
                            </button>
                            {showStatusMenu && (
                                <div className="mt-1 space-y-1 pl-6">
                                    {statuses.map(s => (
                                        <button 
                                            key={s}
                                            onClick={() => handleStatusUpdate(s)}
                                            className={`w-full text-left px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${s === currentStatus ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            {s === currentStatus && <Check size={10} className="inline mr-1" />}
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Admin-only Actions */}
                        {isAdmin && (
                            <>
                                <div className="h-px bg-slate-100 my-2 mx-4" />
                                
                                <div className="px-2">
                                    <button 
                                        onClick={() => { setShowRecruiterMenu(!showRecruiterMenu); setShowStatusMenu(false); }}
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <UserPlus size={14} className="text-slate-400" />
                                            <span>Asignar Reclutador</span>
                                        </div>
                                        <span className={`text-[9px] text-slate-400 transition-transform ${showRecruiterMenu ? 'rotate-90' : ''}`}>►</span>
                                    </button>
                                    {showRecruiterMenu && (
                                        <div className="mt-1 space-y-1 pl-6 max-h-40 overflow-y-auto custom-scrollbar">
                                            {recruiters.map(r => (
                                                <button 
                                                    key={r.id}
                                                    onClick={() => handleAssignRecruiter(r.id)}
                                                    className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all truncate"
                                                >
                                                    {capitalizeName(r.full_name)}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleViewAuditLog}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                                    >
                                        <History size={14} className="text-slate-400" />
                                        <span>Historial (Audit)</span>
                                    </button>

                                    <button 
                                        onClick={handleDelete}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={14} className="text-rose-400" />
                                        <span>Eliminar Candidato</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
