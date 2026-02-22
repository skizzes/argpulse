import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://argpulse.com',
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: 'https://argpulse.com/dollar-blue-today',
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: 'https://argpulse.com/inflation-argentina',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ]
}
