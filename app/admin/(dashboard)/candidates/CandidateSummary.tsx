'use client'

import { useState } from 'react';
import { updateCandidateSummary } from './actions';
import { Save } from 'lucide-react';

export default function CandidateSummary({ id, initialSummary }: { id: string, initialSummary: string }) {
    const [summary, setSummary] = useState(initialSummary || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateCandidateSummary(id, summary);
        } catch (error) {
            alert('Error saving summary');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Candidate Summary</h3>
                <button
                    onClick={handleSave}
                    disabled={saving || summary === initialSummary}
                    className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 disabled:opacity-30 transition-all uppercase"
                >
                    {saving ? 'Saving...' : (
                        <>
                            <Save size={14} />
                            Save Summary
                        </>
                    )}
                </button>
            </div>
            <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write free information about the candidate..."
                className="w-full h-40 p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-corporate-grey resize-none transition-all placeholder:italic"
            />
        </div>
    );
}
