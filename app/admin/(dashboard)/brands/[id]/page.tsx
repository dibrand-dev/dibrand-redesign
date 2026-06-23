import { getBrandById } from '../actions';
import BrandsForm from '../BrandsForm';
import { notFound } from 'next/navigation';

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const brand = await getBrandById(id);

    if (!brand) {
        notFound();
    }

    return <BrandsForm brand={brand} />;
}
