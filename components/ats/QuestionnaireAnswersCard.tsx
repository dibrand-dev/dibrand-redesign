'use client';

import React, { useState, useTransition } from 'react';
import { ListChecks, CheckCircle2, XCircle, Info, Pencil, Save, X, Loader2, Copy } from 'lucide-react';
import { updateCandidate } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface QuestionAnswer {
    question_id: string;
    answer: any;
}

interface QuestionnaireSection {
    id: string;
    title: string;
    questions: any[];
}

interface QuestionnaireAnswersCardProps {
    candidateId: string;
    answers: QuestionAnswer[];
    questionnaire: QuestionnaireSection[];
}

export default function QuestionnaireAnswersCard({ 
    candidateId, 
    answers: initialAnswers, 
    questionnaire 
}: QuestionnaireAnswersCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedAnswers, setEditedAnswers] = useState<QuestionAnswer[]>(initialAnswers || []);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    if (!questionnaire || questionnaire.length === 0) {
        return (
            <div className="bg-white rounded-[24px] border border-slate-200/60 p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                    <ListChecks size={32} />
                </div>
                <h3 className="text-[16px] font-black text-slate-900 mb-2">No Questionnaire Found</h3>
                <p className="text-[13px] text-slate-500 max-w-[280px] font-medium leading-relaxed font-outfit">
                    This job position doesn't have a vetting questionnaire associated with it.
                </p>
            </div>
        );
    }

    const getAnswer = (id: string) => {
        const found = editedAnswers.find(a => a.question_id === id);
        return found ? found.answer : null;
    };

    const updateAnswer = (id: string, value: any) => {
        setEditedAnswers(prev => {
            const exists = prev.some(a => a.question_id === id);
            if (exists) {
                return prev.map(a => a.question_id === id ? { ...a, answer: value } : a);
            } else {
                return [...prev, { question_id: id, answer: value }];
            }
        });
    };

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateCandidate(candidateId, { questionnaire_answers: editedAnswers });
                setIsEditing(false);
                router.refresh();
            } catch (error) {
                console.error('Failed to update vetting answers:', error);
            }
        });
    };

    const handleCancel = () => {
        setEditedAnswers(initialAnswers || []);
        setIsEditing(false);
    };

    const [isCopied, setIsCopied] = useState(false);

    const copyVettingToClipboard = () => {
        let text = "";
        questionnaire.forEach(section => {
            text += `\n--- ${section.title.toUpperCase()} ---\n\n`;
            section.questions.forEach((q, idx) => {
                const answer = getAnswer(q.id);
                let answerText = "No response";

                if (answer !== null && answer !== undefined && answer !== "") {
                    if (q.type === 'yesno') {
                        const isYes = answer === true || answer === 'yes' || answer === 'Yes' || answer === 'si' || answer === 'Si';
                        answerText = isYes ? 'SÍ' : 'NO';
                    } else if (q.type === 'sublist' && q.subquestions) {
                        answerText = q.subquestions.map((sub: string, i: number) => {
                            return `${sub}: ${(answer as any)?.[i] || 'N/A'}`;
                        }).join('\n');
                    } else {
                        answerText = String(answer);
                    }
                }
                text += `${idx + 1}. ${q.label}\nR: ${answerText}\n\n`;
            });
        });

        navigator.clipboard.writeText(text.trim());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const renderAnswer = (q: any) => {
        const value = getAnswer(q.id);
        
        if (isEditing) {
            // Edit Mode Rendering
            if (q.type === 'yesno') {
                const isYes = value === true || value === 'yes' || value === 'Yes' || value === 'si' || value === 'Si';
                return (
                    <div className="flex gap-4">
                        <button 
                            onClick={() => updateAnswer(q.id, 'Yes')}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
                                isYes ? "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                            )}
                        >
                            <CheckCircle2 size={16} /> Sí
                        </button>
                        <button 
                            onClick={() => updateAnswer(q.id, 'No')}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
                                !isYes && value !== null ? "bg-rose-50 text-rose-700 border-rose-500 shadow-sm" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                            )}
                        >
                            <XCircle size={16} /> No
                        </button>
                    </div>
                );
            }

            if (q.type === 'sublist' && q.subquestions) {
                return (
                    <div className="space-y-4 mt-2">
                        {q.subquestions.map((sub: string, idx: number) => (
                            <div key={idx} className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{sub}</label>
                                <input 
                                    type="text"
                                    value={(value as any)?.[idx] || ''}
                                    onChange={(e) => {
                                        const newValue = [...(Array.isArray(value) ? value : [])];
                                        newValue[idx] = e.target.value;
                                        updateAnswer(q.id, newValue);
                                    }}
                                    className="w-full bg-slate-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-[#A3369D50] text-[13px] font-bold text-slate-700 outline-none transition-all"
                                    placeholder="Ingrese respuesta..."
                                />
                            </div>
                        ))}
                    </div>
                );
            }

            if (q.type === 'textarea') {
                return (
                    <textarea 
                        value={String(value || '')}
                        onChange={(e) => updateAnswer(q.id, e.target.value)}
                        className="w-full bg-slate-50 p-6 rounded-2xl border-none focus:ring-2 focus:ring-[#A3369D50] text-[14px] font-bold text-slate-700 leading-relaxed outline-none transition-all min-h-[120px]"
                        placeholder="Escribe aquí los detalles..."
                    />
                );
            }

            // Default text input
            return (
                <input 
                    type="text"
                    value={String(value || '')}
                    onChange={(e) => updateAnswer(q.id, e.target.value)}
                    className="w-full bg-slate-50 p-5 rounded-xl border-none focus:ring-2 focus:ring-[#A3369D50] text-[14px] font-bold text-slate-700 outline-none transition-all"
                    placeholder="Escribe la respuesta..."
                />
            );
        }

        // View Mode Rendering
        if (value === null || value === undefined || value === '') {
            return <span className="text-slate-400 italic text-[13px]">No response provided</span>;
        }

        if (q.type === 'yesno') {
            const isYes = value === true || value === 'yes' || value === 'Yes' || value === 'si' || value === 'Si';
            return (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-tight ${isYes ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {isYes ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {isYes ? 'Yes' : 'No'}
                </div>
            );
        }

        if (q.type === 'sublist' && q.subquestions) {
            return (
                <div className="space-y-3 mt-2">
                    {q.subquestions.map((sub: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></span>
                            <div className="flex-1">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1">{sub}</p>
                                <p className="text-[13px] font-semibold text-slate-900 leading-relaxed">
                                    {(value as any)?.[idx] || <span className="text-slate-400 italic">Unanswered</span>}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <p className="text-[14px] font-semibold text-slate-900 leading-relaxed whitespace-pre-wrap font-outfit">
                {String(value)}
            </p>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-outfit">
            <div className="flex justify-end pr-2 gap-3">
                {!isEditing ? (
                    <>
                        <button 
                            onClick={copyVettingToClipboard}
                            className={cn(
                                "flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[13px] font-black transition-all shadow-sm",
                                isCopied ? "text-green-600 border-green-200 bg-green-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Copy size={14} /> {isCopied ? '¡Copiado!' : 'Copiar Vetting'}
                        </button>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[13px] font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                        >
                            <Pencil size={14} /> Editar Vetting
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                         <button 
                            onClick={handleCancel}
                            disabled={isPending}
                            className="text-slate-400 text-[13px] font-black uppercase tracking-widest hover:text-slate-700 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isPending}
                            className="group relative flex items-center gap-2 bg-gradient-to-r from-[#A3369D] to-[#D83484] px-7 py-3 rounded-xl text-[13px] font-black text-white hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                )}
            </div>

            {questionnaire.map((section) => (
                <div key={section.id} className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <h3 className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase">
                            {section.title}
                        </h3>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">Vetting Section</span>
                    </div>
                    
                    <div className="p-8 space-y-10">
                        {section.questions.map((q, idx) => (
                            <div key={idx} className="group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-[10px] font-black border border-blue-100">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-black text-slate-900 leading-tight mb-1">
                                            {q.label}
                                        </p>
                                        {q.note && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-tight">
                                                <Info size={12} /> {q.note}
                                            </div>
                                        )}
                                        {q.helper && (
                                            <p className="text-[11px] text-slate-400 font-medium italic mt-1">
                                                {q.helper}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="ml-10 pl-4 border-l-2 border-slate-100 group-hover:border-blue-100 transition-colors">
                                    {renderAnswer(q)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {initialAnswers.length === 0 && !isEditing && (
                <div className="bg-amber-50 rounded-[20px] border border-amber-100 p-6 flex items-center gap-4 text-amber-800 shadow-sm">
                    <Info size={24} className="shrink-0" />
                    <div>
                        <p className="text-[13px] font-black uppercase tracking-tight leading-none mb-1">No saved answers</p>
                        <p className="text-[12px] font-medium leading-relaxed opacity-80">
                            This candidate was manually added or applied before the questionnaire was enabled.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
