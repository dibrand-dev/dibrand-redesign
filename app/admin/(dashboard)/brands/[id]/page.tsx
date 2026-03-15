import { getBrandById } from '../actions';
import BrandsForm from '../BrandsForm';
import { notFound } from 'next/navigation';

export default async function EditBrandPage({ params }: { params: { id: string } }) {
    const brand = await getBrandById(params.id);

    if (!brand) {
        notFound();
    }

    return <BrandsForm brand={brand} />;
}
