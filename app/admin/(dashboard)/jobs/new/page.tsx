
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createJob } from '@/app/actions/jobs';
import JobOpeningForm from '../JobOpeningForm';

export default function NewJobPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-admin-text-primary tracking-tight uppercase">New Job Opening</h2>
                    <p className="text-admin-text-secondary text-sm font-medium italic">Post a new career opportunity at Dibrand.</p>
                </div>
            </div>
            <JobOpeningForm />
        </div>
    );
}
