'use client';

import React, { useState } from 'react';
import { User, FileText, StickyNote, Clock } from 'lucide-react';
import CoverLetterCard from './CoverLetterCard';
import ResumeViewer from './ResumeViewer';
import RecruiterNotesWidget from './RecruiterNotesWidget';
import ApplicationHistoryWidget from './ApplicationHistoryWidget';
import QuestionnaireAnswersCard from './QuestionnaireAnswersCard';
import { ListChecks } from 'lucide-react';

interface CandidateTabsProps {
    candidate: any;
    logs: any[];
}

export default function CandidateTabs({ candidate, logs }: CandidateTabsProps) {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Vetting' | 'Resume' | 'Notes' | 'History'>('Overview');

    const tabs = [
        { id: 'Overview', label: 'Overview', icon: User },
        { id: 'Vetting', label: 'Vetting', icon: ListChecks },
        { id: 'Resume', label: 'Resume', icon: FileText },
        { id: 'Notes', label: 'Notes', icon: StickyNote },
        { id: 'History', label: 'History', icon: Clock },
    ] as const;

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <CoverLetterCard 
                            candidateId={candidate.id} 
                            initialContent={candidate.cover_letter} 
                        />
                    </div>
                );
            case 'Vetting':
                return (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <QuestionnaireAnswersCard 
                            answers={candidate.questionnaire_answers || []} 
                            questionnaire={candidate.job?.questionnaire || []} 
                        />
                    </div>
                );
            case 'Resume':
                return (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <ResumeViewer candidate={candidate} />
                    </div>
                );
            case 'Notes':
                return (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <RecruiterNotesWidget 
                            candidateId={candidate.id} 
                            initialLogs={logs} 
                        />
                    </div>
                );
            case 'History':
                return (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <ApplicationHistoryWidget 
                            candidate={candidate} 
                            logs={logs} 
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-[13px] font-bold transition-all border-b-2 -mb-[2px] ${
                            activeTab === tab.id
                                ? 'border-[#0B4FEA] text-[#0B4FEA]'
                                : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
}
