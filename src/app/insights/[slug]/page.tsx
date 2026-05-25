// src/app/insights/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import { formatDateFull } from '@/lib/utils'
import { BLOG_CATEGORY_LABELS } from '@/types'
import type { BlogCategory } from '@/types'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post) return {}
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
  }
}

export const revalidate = 300

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!post) notFound()

  // Track view
  prisma.blogPost
    .update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {})

  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      category: post.category,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  const POST_ICONS: Record<string, string> = {
    COMMERCIAL_SOLAR: '☀️',
    BATTERY_STORAGE: '🔋',
    ENERGY_FINANCE: '📊',
    OFF_GRID: '🌾',
    POLICY_MARKET: '🌍',
    INDUSTRIAL_SOLAR: '🏗️',
    SUSTAINABILITY: '🌿',
  }

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        {/* Hero */}
        <section className="bg-sol-deep text-white py-16 px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Insights
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="badge badge-amber">
                {BLOG_CATEGORY_LABELS[post.category as BlogCategory]}
              </span>
              {post.featured && <span className="badge badge-blue">Featured</span>}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-white/60 text-base leading-relaxed mb-6">{post.excerpt}</p>
            )}
            <div className="flex flex-wrap gap-5 text-[0.78rem] text-white/40">
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> {post.readTime} min read
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} /> {formatDateFull(post.publishedAt)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Tag size={12} /> {post.viewCount} views
              </span>
            </div>
          </div>
        </section>

        {/* Article */}
        <section className="py-16 px-6 md:px-10 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12">
              {/* Content */}
              <RevealOnScroll>
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-display prose-headings:font-semibold prose-headings:text-sol-ink
                    prose-p:text-sol-steel prose-p:leading-relaxed
                    prose-a:text-sol-sky prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-sol-ink
                    prose-ul:text-sol-steel prose-ol:text-sol-steel
                    prose-blockquote:border-l-sol-amber prose-blockquote:text-sol-steel"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-sol-fog">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[0.72rem] text-sol-steel font-semibold tracking-wide uppercase mr-1">
                        Tags:
                      </span>
                      {post.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author card */}
                <div className="mt-10 surface-card p-6 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sol-sky to-sol-leaf flex items-center justify-center text-white font-display text-xl font-semibold flex-shrink-0">
                    EK
                  </div>
                  <div>
                    <div className="font-semibold text-sol-ink">Esther Watiri Kiarie</div>
                    <div className="text-[0.75rem] text-sol-sky mb-2">
                      Technical Sales Manager · Solar Energy
                    </div>
                    <p className="text-[0.82rem] text-sol-steel leading-relaxed">
                      9+ years leading solar energy solutions across East Africa. Specialist in
                      commercial, industrial, and off-grid systems.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* CTA */}
                <RevealOnScroll direction="left">
                  <div className="bg-sol-ink text-white rounded-xl p-5">
                    <div className="font-display text-lg font-semibold mb-2">
                      Need solar advice?
                    </div>
                    <p className="text-[0.78rem] text-white/55 mb-4 leading-relaxed">
                      Get a personalised consultation and feasibility study for your project.
                    </p>
                    <Link href="/contact" className="btn-primary w-full justify-center text-center text-sm">
                      Book a Consultation
                    </Link>
                  </div>
                </RevealOnScroll>

                {/* Solar calculator teaser */}
                <RevealOnScroll direction="left" delay={0.1}>
                  <div className="surface-card p-5">
                    <div className="font-semibold text-sol-ink text-sm mb-1">
                      ☀️ Solar Calculator
                    </div>
                    <p className="text-[0.75rem] text-sol-steel mb-3 leading-relaxed">
                      Estimate your savings and payback period instantly.
                    </p>
                    <Link
                      href="/#calculator"
                      className="text-[0.78rem] font-semibold text-sol-sky hover:underline"
                    >
                      Try the Calculator →
                    </Link>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 px-6 md:px-10 bg-sol-ash">
            <div className="max-w-6xl mx-auto">
              <RevealOnScroll>
                <div className="section-label">Keep Reading</div>
                <h2 className="font-display text-3xl font-light text-sol-ink mb-8">
                  Related <strong className="font-semibold">Articles</strong>
                </h2>
              </RevealOnScroll>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedPosts.map((p, i) => (
                  <RevealOnScroll key={p.id} delay={i * 0.08}>
                    <Link href={`/insights/${p.slug}`} className="group block">
                      <div className="surface-card overflow-hidden hover:shadow-solar transition-all group-hover:-translate-y-1 duration-300">
                        <div className="h-32 bg-gradient-to-br from-sol-deep to-sol-sky flex items-center justify-center text-5xl opacity-20 group-hover:opacity-30 transition-opacity">
                          {POST_ICONS[p.category] || '☀️'}
                        </div>
                        <div className="p-4">
                          <div className="badge badge-blue mb-2">
                            {BLOG_CATEGORY_LABELS[p.category as BlogCategory]}
                          </div>
                          <h3 className="font-display text-base font-semibold text-sol-ink leading-snug group-hover:text-sol-sky transition-colors">
                            {p.title}
                          </h3>
                          <div className="flex items-center gap-1 mt-2 text-[0.7rem] text-sol-steel">
                            <Clock size={10} /> {p.readTime} min read
                          </div>
                        </div>
                      </div>
                    </Link>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
