import { getTestimonialById } from '../actions';
import TestimonialForm from '../TestimonialForm';
import { notFound } from 'next/navigation';

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
    const testimonial = await getTestimonialById(params.id);

    if (!testimonial) {
        notFound();
    }

    return <TestimonialForm testimonial={testimonial} />;
}
