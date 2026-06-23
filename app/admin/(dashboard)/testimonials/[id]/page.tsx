import { getTestimonialById } from '../actions';
import TestimonialForm from '../TestimonialForm';
import { notFound } from 'next/navigation';

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const testimonial = await getTestimonialById(id);

    if (!testimonial) {
        notFound();
    }

    return <TestimonialForm testimonial={testimonial} />;
}
