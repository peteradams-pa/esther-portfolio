// src/app/insights/page.tsx
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { BLOG_CATEGORY_LABELS } from '@/types'
import type { BlogCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Solar & Renewable Energy Insights',
  description: "Esther Watiri Kiarie's thought leadership on solar energy trends, ROI, battery storage, and the East African energy transition.",
}

export const revalidate = 300

const POST_ICONS: Record<string, string> = {
  COMMERCIAL_SOLAR: '☀️',
  BATTERY_STORAGE:  '🔋',
  ENERGY_FINANCE:   '📊',
  OFF_GRID:         '🌾',
  POLICY_MARKET:    '🌍',
  INDUSTRIAL_SOLAR: '🏗️',
  SUSTAINABILITY:   '🌿',
}

export default async function InsightsPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
  })

  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => !p.featured || p.id !== featured?.id)

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        {/* Header */}
        <section className="bg-sol-ink text-white py-20 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-sol-amber flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-sol-amber" /> Thought Leadership
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-3">
              Solar & Renewable <strong className="font-semibold">Insights</strong>
            </h1>
            <p className="text-white/55 max-w-xl leading-relaxed">
              Perspectives on the East African energy transition, solar ROI, battery storage, and the future of sustainable business.
            </p>
          </div>
        </section>

        <section className="section-wrapper bg-sol-ash">
          <div className="section-inner">
            {/* Featured post */}
            {featured && (
              <RevealOnScroll>
                <Link href={`/insights/${featured.slug}`} className="group block mb-10">
                  <div className="surface-card overflow-hidden grid grid-cols-1 lg:grid-cols-[2fr_1fr] hover:shadow-solar transition-all duration-300">
                    <div className="bg-gradient-to-br from-sol-deep to-sol-sky flex items-center justify-center p-16 text-8xl opacity-30 group-hover:opacity-40 transition-opacity">
                      {POST_ICONS[featured.category] || '☀️'}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="badge badge-amber">Featured</span>
                        <span className="badge badge-blue">{BLOG_CATEGORY_LABELS[featured.category as BlogCategory]}</span>
                      </div>
                      <h2 className="font-display text-2xl font-semibold text-sol-ink mb-3 leading-snug group-hover:text-sol-sky transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-[0.85rem] text-sol-steel leading-relaxed mb-4 line-clamp-3">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-[0.72rem] text-sol-steel">
                        <span className="flex items-center gap-1.5"><Clock size={11} /> {featured.readTime} min read</span>
                        <span className="text-sol-sky font-semibold group-hover:gap-1.5 flex items-center gap-1 transition-all">
                          Read Article <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post, i) => (
                <RevealOnScroll key={post.id} delay={(i % 3) * 0.08}>
                  <Link href={`/insights/${post.slug}`} className="group block h-full">
                    <div className="surface-card overflow-hidden hover:shadow-solar transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col">
                      <div className="h-40 bg-gradient-to-br from-sol-deep to-sol-sky flex items-center justify-center text-6xl opacity-25 group-hover:opacity-35 transition-opacity">
                        {POST_ICONS[post.category] || '☀️'}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="badge badge-blue mb-2 self-start">
                          {BLOG_CATEGORY_LABELS[post.category as BlogCategory]}
                        </div>
                        <h3 className="font-display text-lg font-semibold text-sol-ink leading-snug mb-2 group-hover:text-sol-sky transition-colors flex-1">
                          {post.title}
                        </h3>
                        <p className="text-[0.78rem] text-sol-steel leading-relaxed line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-[0.7rem] text-sol-steel border-t border-sol-fog pt-3">
                          <span>{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="py-20 text-center">
                <div className="text-4xl mb-3">✍️</div>
                <div className="font-display text-xl text-sol-ink mb-1">No articles published yet</div>
                <p className="text-sol-steel text-sm">Check back soon for solar energy insights.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
