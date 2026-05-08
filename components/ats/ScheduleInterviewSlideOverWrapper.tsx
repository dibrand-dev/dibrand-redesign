'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScheduleInterviewSlideOver from './ScheduleInterviewSlideOver';

export default function ScheduleInterviewSlideOverWrapper({
    candidate,
    recruiterId
}: {
    candidate: any;
    recruiterId: string | null;
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Since this wrapper is only rendered when showSchedule is true,
        // we set open to true immediately on mount to trigger the slide-in animation.
        setOpen(true);
    }, []);

    const handleClose = () => {
        setOpen(false);
        // Wait for the slide-out animation to finish before removing from DOM
        setTimeout(() => {
            router.push(`/ats/candidates/${candidate.id}`, { scroll: false });
        }, 300); // Wait 300ms for framer-motion transition
    };

    return (
        <ScheduleInterviewSlideOver 
            candidate={candidate} 
            recruiterId={recruiterId} 
            open={open} 
            onClose={handleClose} 
        />
    );
}
