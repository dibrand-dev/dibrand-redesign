import { MetadataRoute } from 'next';
import { createAdminClient } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createAdminClient();
    const baseUrl = 'https://www.dibrand.co';

    // Static routes
    const staticRoutes = [
        '',
        '/es',
        '/en',
        '/es/success-stories',
        '/en/success-stories',
        '/es/staff-augmentation',
        '/en/staff-augmentation',
        '/es/about',
        '/en/about',
        '/es/comparativa/dibrand-vs-outsourcing-tradicional',
        '/en/comparativa/dibrand-vs-outsourcing-tradicional',
        '/es/pricing-models/costos-desarrollo-software-2026',
        '/en/pricing-models/software-development-cost-2026',
        '/es/ai-index',
        '/en/ai-index',
        '/es/join-us',
        '/en/join-us',
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

    // Dynamic Job Openings
    const { data: jobs } = await supabase
        .from('job_openings')
        .select('id, slug, created_at')
        .eq('is_active', true);

    if (jobs) {
        jobs.forEach((job) => {
            const finalSlug = job.slug || job.id;
            sitemapEntries.push({
                url: `${baseUrl}/en/join-us/${finalSlug}`,
                lastModified: new Date(job.created_at || Date.now()),
                changeFrequency: 'daily',
                priority: 0.9,
            });
            sitemapEntries.push({
                url: `${baseUrl}/es/join-us/${finalSlug}`,
                lastModified: new Date(job.created_at || Date.now()),
                changeFrequency: 'daily',
                priority: 0.9,
            });
        });
    }

    return sitemapEntries;
}
