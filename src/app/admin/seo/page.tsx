// src/app/admin/seo/page.tsx
import { prisma } from '@/lib/prisma'
import SeoForm from './SeoForm'

export const dynamic = 'force-dynamic'

const PAGE_LABELS: Record<string, string> = {
  home:         '🏠 Homepage',
  about:        '👤 About Page',
  projects:     '⚡ Projects Page',
  achievements: '🏆 Achievements Page',
  testimonials: '💬 Testimonials Page',
  insights:     '✍️ Insights / Blog',
  contact:      '📬 Contact Page',
}

export default async function AdminSeoPage() {
  const seoPages = await prisma.pageSeo.findMany({ orderBy: { page: 'asc' } })

  // Ensure all pages exist
  const existingPages = seoPages.map((s) => s.page)
  const allPages = Object.keys(PAGE_LABELS)
  const missingPages = allPages.filter((p) => !existingPages.includes(p))

  // Create missing entries
  for (const page of missingPages) {
    await prisma.pageSeo.upsert({
      where: { page },
      update: {},
      create: { page, title: '', description: '' },
    })
  }

  const allSeo = await prisma.pageSeo.findMany({ orderBy: { page: 'asc' } })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-sol-ink">SEO Settings</h1>
        <p className="text-sol-steel text-sm mt-0.5">
          Manage meta titles and descriptions for each page
        </p>
      </div>

      <div className="mb-4 surface-card p-4 bg-sol-ash border-sol-fog flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div className="text-[0.78rem] text-sol-steel leading-relaxed">
          <strong className="text-sol-ink">SEO Tips:</strong> Keep titles under 60 characters and
          descriptions under 160 characters. Include primary keywords naturally. Titles appear in
          browser tabs and Google search results.
        </div>
      </div>

      <div className="space-y-4">
        {allSeo.map((seo) => (
          <SeoForm key={seo.id} seo={seo} label={PAGE_LABELS[seo.page] || seo.page} />
        ))}
      </div>
    </div>
  )
}
