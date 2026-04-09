'use client';

import React, { useState } from 'react';
import { Download, Maximize2, FileText, Loader2 } from 'lucide-react';

interface ResumeViewerProps {
    candidate: {
        id: string;
        resume_url?: string;
        cv_filename?: string;
        first_name?: string;
        last_name?: string;
    };
}

export default function ResumeViewer({ candidate }: ResumeViewerProps) {
    const [showPreview, setShowPreview] = useState(true);
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mdvyvqphumrciekgjlfb.supabase.co';
    
    // Construct the public URL for the resume
    const getFileUrl = () => {
        if (!candidate.resume_url && !candidate.cv_filename) return null;
        
        let path = candidate.resume_url || candidate.cv_filename || '';
        
        // If it's already an absolute URL, return as is
        if (path.startsWith('http')) return path;

        // If it starts with /storage, it might be a relative path from the domain
        if (path.startsWith('/storage')) return `${supabaseUrl}${path}`;
        
        // Clean up the path from potentially being double-nested by the UI elsewhere
        // (Sometimes paths include the bucket name prefix if saved incorrectly)
        if (path.startsWith('resumes/')) path = path.replace('resumes/', '');
        
        return `${supabaseUrl}/storage/v1/object/public/resumes/${path}`;
    };

    const fileUrl = getFileUrl();
    const fileName = candidate.cv_filename || `${candidate.first_name || 'Candidate'}_Resume.pdf`;

    const handleDownload = () => {
        if (!fileUrl) return;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenNewWindow = () => {
        if (!fileUrl) return;
        window.open(fileUrl, '_blank');
    };

    return (
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-8 h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#DAE2FF] flex items-center justify-center text-[#0040A1]">
                        <FileText size={16} />
                    </div>
                    <h3 className="text-[18px] font-extrabold text-slate-900">Currículum Vitae</h3>
                </div>
                <div className="flex gap-4 text-slate-400">
                    <button 
                        onClick={handleDownload}
                        className="p-2 hover:bg-slate-50 rounded-lg hover:text-[#0040A1] transition-all" 
                        title="Descargar CV"
                        disabled={!fileUrl}
                    >
                        <Download size={18} />
                    </button>
                    <button 
                        onClick={handleOpenNewWindow}
                        className="p-2 hover:bg-slate-50 rounded-lg hover:text-[#0040A1] transition-all" 
                        title="Abrir en Nueva Pestaña"
                        disabled={!fileUrl}
                    >
                        <Maximize2 size={18} />
                    </button>
                </div>
            </div>

            <div className="border border-slate-200 rounded-2xl bg-[#F8FAFC] flex flex-col items-center justify-center mb-6 h-[720px] relative overflow-hidden group">
                {!fileUrl ? (
                    <div className="text-center p-10 animate-pulse">
                        <div className="w-20 h-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FileText size={36} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-[13px]">Sin archivo adjunto</p>
                        <p className="text-slate-300 text-[11px] mt-1 uppercase tracking-widest">Sube un CV para visualizarlo aquí</p>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <iframe 
                            src={`${fileUrl}#toolbar=0&navpanes=0`}
                            className="w-full h-full border-none rounded-xl"
                            title="Candidate Resume"
                        />
                        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={handleOpenNewWindow}
                                className="px-6 py-3 bg-[#0040A1] text-white font-extrabold text-[12px] rounded-xl shadow-2xl shadow-blue-900/40 flex items-center gap-2 hover:scale-105 transition-all uppercase tracking-widest"
                            >
                                <Maximize2 size={14}/> Pantalla Completa
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex items-center justify-between px-2">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] truncate max-w-[70%]" title={fileName}>
                    {fileName}
                </p>
                {fileUrl && (
                    <span className="text-[10px] font-black text-[#0040A1] bg-[#DAE2FF] px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        Verified PDF
                    </span>
                )}
            </div>
        </div>
    );
}
