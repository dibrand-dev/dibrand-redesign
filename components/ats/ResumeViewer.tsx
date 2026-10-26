'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, Maximize2, FileText, FileX, Upload, Loader2, RefreshCw } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { updateCandidate } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ResumeViewerProps {
    candidate: {
        id: string;
        resume_url?: string;
        cv_filename?: string;
        first_name?: string;
        last_name?: string;
    };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fduftfijlyqyzfbvbtmo.supabase.co';

function resolveResumeUrl(rawUrl?: string, rawFilename?: string): string | null {
    if (!rawUrl && !rawFilename) return null;
    let path = rawUrl || rawFilename || '';

    // Normalize legacy project domain to active domain
    if (path.startsWith('http')) {
        return path.replace('https://mdvyvqphumrciekgjlfb.supabase.co', supabaseUrl);
    }

    // Relative path from domain
    if (path.startsWith('/storage')) return `${supabaseUrl}${path}`;

    // Clean up duplicate bucket prefix
    if (path.startsWith('resumes/')) path = path.replace('resumes/', '');

    return `${supabaseUrl}/storage/v1/object/public/resumes/${path}`;
}

export default function ResumeViewer({ candidate }: ResumeViewerProps) {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>(candidate.cv_filename || `${candidate.first_name || 'Candidato'}_Resume.pdf`);
    const [status, setStatus] = useState<'checking' | 'available' | 'not_found' | 'none'>('checking');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const url = resolveResumeUrl(candidate.resume_url, candidate.cv_filename);
        const name = candidate.cv_filename || `${candidate.first_name || 'Candidato'}_Resume.pdf`;
        setFileUrl(url);
        setFileName(name);

        if (!url) {
            setStatus('none');
            return;
        }

        let isMounted = true;
        setStatus('checking');

        fetch(url, { method: 'HEAD' })
            .then(res => {
                if (!isMounted) return;
                if (res.ok) {
                    setStatus('available');
                } else {
                    setStatus('not_found');
                }
            })
            .catch(() => {
                if (!isMounted) return;
                setStatus('not_found');
            });

        return () => {
            isMounted = false;
        };
    }, [candidate.resume_url, candidate.cv_filename]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const fileExt = file.name.split('.').pop();
            const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = uniqueName;

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file, {
                    contentType: file.type || 'application/pdf',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl(filePath);

            await updateCandidate(candidate.id, {
                resume_url: publicUrl,
                cv_filename: file.name
            });

            setFileUrl(publicUrl);
            setFileName(file.name);
            setStatus('available');
            toast.success('Currículum subido y vinculado con éxito.');
            router.refresh();
        } catch (err: any) {
            console.error('Error uploading resume:', err);
            toast.error(err.message || 'Error al subir el currículum.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownload = () => {
        if (!fileUrl || status !== 'available') return;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenNewWindow = () => {
        if (!fileUrl || status !== 'available') return;
        window.open(fileUrl, '_blank');
    };

    return (
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6 md:p-8 h-full font-outfit">
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#9e4d97]/10 flex items-center justify-center text-[#9e4d97]">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-bold text-slate-900 leading-tight">Currículum vitae</h3>
                        <p className="text-[12px] text-slate-500 font-medium">Documento original de postulación</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:border-[#9e4d97] hover:text-[#9e4d97] text-[12px] font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                        title={status === 'available' ? 'Reemplazar currículum' : 'Subir currículum'}
                    >
                        {isUploading ? <Loader2 size={14} className="animate-spin text-[#9e4d97]" /> : <Upload size={14} />}
                        {status === 'available' ? 'Reemplazar' : 'Subir archivo'}
                    </button>

                    {status === 'available' && (
                        <>
                            <button 
                                onClick={handleDownload}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#9e4d97] transition-all" 
                                title="Descargar CV"
                            >
                                <Download size={18} />
                            </button>
                            <button 
                                onClick={handleOpenNewWindow}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#9e4d97] transition-all" 
                                title="Abrir en nueva pestaña"
                            >
                                <Maximize2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Viewer Content */}
            <div className="border border-slate-200 rounded-2xl bg-[#F8FAFC] flex flex-col items-center justify-center mb-6 min-h-[520px] lg:h-[720px] relative overflow-hidden group">
                {status === 'checking' && (
                    <div className="text-center p-10 flex flex-col items-center">
                        <Loader2 size={32} className="animate-spin text-[#9e4d97] mb-4" />
                        <p className="text-slate-600 font-bold text-[14px]">Comprobando currículum...</p>
                        <p className="text-slate-400 text-[12px] mt-1">Conectando con el almacenamiento seguro de Supabase</p>
                    </div>
                )}

                {status === 'not_found' && (
                    <div className="text-center p-8 md:p-12 max-w-md flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#9e4d97]/10 rounded-2xl flex items-center justify-center text-[#9e4d97] mb-4">
                            <FileX size={32} />
                        </div>
                        <h4 className="text-[16px] font-bold text-slate-900 mb-2">Currículum no disponible en el almacenamiento</h4>
                        <p className="text-[13px] text-slate-600 leading-relaxed mb-6">
                            El archivo <span className="font-bold text-slate-800 break-all">{fileName}</span> fue registrado en la importación, pero el documento PDF no se encuentra cargado en el bucket de Supabase.
                        </p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="px-6 py-3 bg-[#9e4d97] text-white rounded-xl text-[13px] font-bold hover:bg-[#7d3b77] transition-all flex items-center gap-2 shadow-sm shadow-[#9e4d97]/20 disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            Subir archivo PDF
                        </button>
                        <p className="text-[11px] text-slate-400 mt-3">Formatos aceptados: PDF, DOCX (hasta 10 MB)</p>
                    </div>
                )}

                {status === 'none' && (
                    <div className="text-center p-8 md:p-12 max-w-md flex flex-col items-center">
                        <div className="w-16 h-16 bg-white shadow-sm rounded-2xl border border-slate-200 flex items-center justify-center text-slate-300 mb-4">
                            <FileText size={32} />
                        </div>
                        <h4 className="text-[16px] font-bold text-slate-800 mb-1">Sin archivo adjunto</h4>
                        <p className="text-[13px] text-slate-500 mb-6">Este candidato aún no tiene un currículum cargado.</p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="px-6 py-3 bg-[#9e4d97] text-white rounded-xl text-[13px] font-bold hover:bg-[#7d3b77] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            Subir currículum
                        </button>
                    </div>
                )}

                {status === 'available' && fileUrl && (
                    <div className="w-full h-full relative">
                        <iframe 
                            src={`${fileUrl}#toolbar=0&navpanes=0`}
                            className="w-full h-full border-none rounded-xl"
                            title="Currículum del candidato"
                        />
                        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={handleOpenNewWindow}
                                className="px-6 py-3 bg-[#9e4d97] text-white font-bold text-[12px] rounded-xl shadow-xl flex items-center gap-2 hover:bg-[#7d3b77] transition-all uppercase tracking-wider"
                            >
                                <Maximize2 size={14} /> Pantalla completa
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2 text-[12px]">
                <p className="text-slate-500 font-medium truncate max-w-[70%]" title={fileName}>
                    Archivo: <span className="font-bold text-slate-700">{fileName}</span>
                </p>
                {status === 'available' ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        PDF verificado
                    </span>
                ) : status === 'not_found' ? (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Pendiente de carga
                    </span>
                ) : null}
            </div>
        </div>
    );
}
