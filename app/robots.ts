import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://srijandev.in/sitemap.xml',
    host: 'https://srijandev.in',
  };
}
