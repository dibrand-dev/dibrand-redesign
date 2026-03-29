'use client';

import React from 'react';
import { ListChecks, CheckCircle2, XCircle, Info, ChevronRight } from 'lucide-react';

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
    answers: QuestionAnswer[];
    questionnaire: QuestionnaireSection[];
}

export default function QuestionnaireAnswersCard({ answers, questionnaire }: QuestionnaireAnswersCardProps) {
    if (!questionnaire || questionnaire.length === 0) {
        return (
            <div className="bg-white rounded-[24px] border border-slate-200/60 p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                    <ListChecks size={32} />
                </div>
                <h3 className="text-[16px] font-black text-slate-900 mb-2">No Questionnaire Found</h3>
                <p className="text-[13px] text-slate-500 max-w-[280px] font-medium leading-relaxed">
                    This job position doesn't have a vetting questionnaire associated with it.
                </p>
            </div>
        );
    }

    const getAnswer = (id: string) => {
        const found = (answers || []).find(a => a.question_id === id);
        return found ? found.answer : null;
    };

    const renderAnswer = (q: any) => {
        const value = getAnswer(q.id);
        
        if (value === null || value === undefined || value === '') {
            return <span className="text-slate-400 italic text-[13px]">No response provided</span>;
        }

        if (q.type === 'yesno') {
            const isYes = value === true || value === 'yes' || value === 'Yes';
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
            <p className="text-[14px] font-semibold text-slate-900 leading-relaxed whitespace-pre-wrap">
                {String(value)}
            </p>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

            {answers.length === 0 && (
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
