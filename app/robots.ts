import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/admin/',
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'Google-Extended'],
                allow: ['/', '/success-stories/'],
            },
        ],
        sitemap: 'https://www.dibrand.co/sitemap.xml',
    };
}
