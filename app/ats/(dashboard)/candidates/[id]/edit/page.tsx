import { getCandidateById } from '@/app/ats/actions';
import CandidateForm from '@/components/ats/CandidateForm';
import { notFound } from 'next/navigation';

export default async function EditCandidatePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const candidate = await getCandidateById(id);

    if (!candidate) notFound();

    return <CandidateForm candidate={candidate} isEdit={true} />;
}
