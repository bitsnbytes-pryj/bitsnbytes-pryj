import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://gobitsnbytes.org'
  
  return {
    rules: [
      {
        // Default rules for all crawlers
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/_next/', '/admin/'],
      },
      {
        // Specific rules for major search engines - allow full access
        userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-News', 'Googlebot-Video'],
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: ['Bingbot', 'msnbot'],
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: ['Applebot', 'DuckDuckBot', 'Yandex', 'Baiduspider'],
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        // AI crawlers with access to LLM content
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai'],
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
