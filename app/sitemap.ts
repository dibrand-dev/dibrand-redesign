import { MetadataRoute } from 'next';
import { createAdminClient } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createAdminClient();
    const baseUrl = 'https://dibrand.co';

    // Static routes
    const staticRoutes = [
        '',
        '/es',
        '/en',
        '/es/success-stories',
        '/en/success-stories',
        '/es/staff-augmentation',
        '/en/staff-augmentation',
    ];

    const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Case Studies
    const { data: cases } = await supabase
        .from('case_studies')
        .select('slug, updated_at')
        .eq('is_published', true);

    if (cases) {
        cases.forEach((c) => {
            // Add both languages if applicable, or just generic
            sitemapEntries.push({
                url: `${baseUrl}/en/success-stories/${c.slug}`,
                lastModified: new Date(c.updated_at || Date.now()),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
            sitemapEntries.push({
                url: `${baseUrl}/es/success-stories/${c.slug}`,
                lastModified: new Date(c.updated_at || Date.now()),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    }

    return sitemapEntries;
}
