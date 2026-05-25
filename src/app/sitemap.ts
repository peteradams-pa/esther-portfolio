// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://estherkiarie.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    prisma.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                changeFrequency: 'weekly',  priority: 1 },
    { url: `${BASE_URL}/about`,        changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/projects`,     changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/achievements`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/testimonials`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/insights`,     changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/contact`,      changeFrequency: 'yearly',  priority: 0.9 },
  ]

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/insights/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...projectPages, ...postPages]
}
