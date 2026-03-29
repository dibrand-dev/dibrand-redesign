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
    const [showPreview, setShowPreview] = useState(false);
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mdvyvqphumrciekgjlfb.supabase.co';
    
    // Construct the public URL for the resume
    const getFileUrl = () => {
        if (!candidate.resume_url && !candidate.cv_filename) return null;
        
        const path = candidate.resume_url || candidate.cv_filename || '';
        if (path.startsWith('http')) return path;
        
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
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[18px] font-extrabold text-slate-900">Resume / CV</h3>
                <div className="flex gap-4 text-slate-400">
                    <button 
                        onClick={handleDownload}
                        className="hover:text-slate-700 transition-colors" 
                        title="Download CV"
                        disabled={!fileUrl}
                    >
                        <Download size={18} />
                    </button>
                    <button 
                        onClick={handleOpenNewWindow}
                        className="hover:text-slate-700 transition-colors" 
                        title="Open in new window"
                        disabled={!fileUrl}
                    >
                        <Maximize2 size={18} />
                    </button>
                </div>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center mb-6 h-[500px] relative overflow-hidden group">
                {!fileUrl ? (
                    <div className="text-center p-10">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">No resume uploaded yet</p>
                    </div>
                ) : showPreview ? (
                    <iframe 
                        src={`${fileUrl}#toolbar=0&navpanes=0`}
                        className="w-full h-full border-none rounded-xl"
                        title="Candidate Resume"
                    />
                ) : (
                    <>
                        <div className="w-72 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-sm p-8 absolute transform transition-transform duration-500 group-hover:-translate-y-2">
                            <div className="h-5 bg-slate-200 w-1/3 mb-6 rounded-sm"></div>
                            <div className="h-2.5 bg-slate-100 w-full mb-3 rounded-full"></div>
                            <div className="h-2.5 bg-slate-100 w-full mb-3 rounded-full"></div>
                            <div className="h-2.5 bg-slate-100 w-4/5 mb-6 rounded-full"></div>
                            <div className="h-2.5 bg-slate-200 w-1/4 mb-3 rounded-full"></div>
                            <div className="h-2.5 bg-slate-100 w-full mb-3 rounded-full"></div>
                            <div className="h-2.5 bg-slate-100 w-2/3 mb-3 rounded-full"></div>
                        </div>
                        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <button 
                                onClick={() => setShowPreview(true)}
                                className="px-6 py-3 bg-white text-slate-900 font-extrabold text-[13px] rounded-xl shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                <Maximize2 size={16}/> View Full Document
                            </button>
                        </div>
                    </>
                )}
            </div>
            
            <p className="text-center text-[12px] font-bold text-slate-500 truncate px-4" title={fileName}>
                {fileName}
            </p>
        </div>
    );
}
