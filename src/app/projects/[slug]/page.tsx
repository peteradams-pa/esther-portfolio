// src/app/projects/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Zap, Calendar, User, ArrowLeft, CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { Project } from '@/types'
import { PROJECT_CATEGORY_LABELS, formatDate } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ where: { published: true }, select: { slug: true } })
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await prisma.project.findUnique({ where: { slug: params.slug } })
  if (!project) return {}
  return {
    title: project.metaTitle || project.title,
    description: project.metaDescription || project.description.slice(0, 160),
  }
}

export const revalidate = 60

export default async function ProjectDetailPage({ params }: Props) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!project) notFound()

  // Track view (fire-and-forget)
  prisma.project.update({
    where: { id: project.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {})

  const p = project as unknown as Project
  const metrics = Array.isArray(p.metrics) ? p.metrics : []

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        {/* Header */}
        <section className="bg-sol-deep text-white py-16 px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Projects
            </Link>
            <div className="text-[0.72rem] tracking-widest uppercase text-sol-amber mb-2">
              {PROJECT_CATEGORY_LABELS[p.category]}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-3">
              {p.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-[0.82rem] text-white/50">
              <span className="flex items-center gap-1.5"><MapPin size={12} /> {p.location}</span>
              <span className="flex items-center gap-1.5"><Zap size={12} /> {p.capacity}</span>
              <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(p.completionDate)}</span>
              <span className="flex items-center gap-1.5"><User size={12} /> {p.role}</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-6 md:px-10 bg-sol-ash">
          <div className="max-w-4xl mx-auto">

            {/* Impact metrics */}
            {metrics.length > 0 && (
              <RevealOnScroll>
                <div className="bg-gradient-to-br from-sol-deep to-sol-sky rounded-2xl p-6 md:p-8 mb-10">
                  <div className="text-[0.72rem] tracking-widest uppercase text-sol-amber mb-5">
                    📊 Measurable Impact
                  </div>
                  <div className={`grid grid-cols-${Math.min(metrics.length, 4)} gap-6`}>
                    {metrics.map((m, i) => (
                      <div key={i} className="text-center">
                        <div className="font-display text-4xl font-semibold text-white">{m.value}</div>
                        <div className="text-[0.68rem] tracking-widest uppercase text-white/45 mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="md:col-span-2 space-y-8">
                <RevealOnScroll>
                  <div className="surface-card p-6">
                    <h2 className="font-display text-xl font-semibold text-sol-ink mb-3">Project Overview</h2>
                    <p className="text-sol-steel leading-relaxed">{p.description}</p>
                  </div>
                </RevealOnScroll>

                {p.challenge && (
                  <RevealOnScroll delay={0.1}>
                    <div className="surface-card p-6">
                      <h2 className="font-display text-xl font-semibold text-sol-ink mb-3">The Challenge</h2>
                      <p className="text-sol-steel leading-relaxed">{p.challenge}</p>
                    </div>
                  </RevealOnScroll>
                )}

                {p.solution && (
                  <RevealOnScroll delay={0.15}>
                    <div className="surface-card p-6">
                      <h2 className="font-display text-xl font-semibold text-sol-ink mb-3">Our Solution</h2>
                      <p className="text-sol-steel leading-relaxed">{p.solution}</p>
                    </div>
                  </RevealOnScroll>
                )}

                {p.technologies.length > 0 && (
                  <RevealOnScroll delay={0.2}>
                    <div className="surface-card p-6">
                      <h2 className="font-display text-xl font-semibold text-sol-ink mb-4">Technologies Used</h2>
                      <div className="flex flex-wrap gap-2">
                        {p.technologies.map((tech) => (
                          <span key={tech} className="flex items-center gap-1.5 px-3 py-1.5 bg-sol-ash border border-sol-fog rounded-lg text-sm text-sol-sky">
                            <CheckCircle size={11} /> {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </RevealOnScroll>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                <RevealOnScroll direction="left">
                  <div className="surface-card p-5">
                    <h3 className="text-[0.72rem] tracking-widest uppercase font-semibold text-sol-steel mb-4">
                      Project Details
                    </h3>
                    {[
                      { label: 'Capacity', value: p.capacity },
                      { label: 'Client Type', value: p.clientType },
                      { label: 'Location', value: p.location },
                      { label: 'Completion', value: formatDate(p.completionDate) },
                      p.paybackPeriod && { label: 'Payback Period', value: p.paybackPeriod },
                      p.annualSavings && { label: 'Annual Savings', value: p.annualSavings },
                      p.co2Avoided && { label: 'CO₂ Avoided', value: p.co2Avoided },
                    ].filter(Boolean).map((item: any) => (
                      <div key={item.label} className="py-2.5 border-b border-sol-fog last:border-0">
                        <div className="text-[0.68rem] uppercase tracking-wide text-sol-steel mb-0.5">{item.label}</div>
                        <div className="text-sm font-semibold text-sol-ink">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </RevealOnScroll>

                <RevealOnScroll direction="left" delay={0.1}>
                  <div className="bg-sol-ink text-white rounded-xl p-5">
                    <div className="text-sm font-semibold mb-2">Want a similar project?</div>
                    <p className="text-[0.78rem] text-white/55 mb-4 leading-relaxed">
                      Let's discuss your energy needs and build a bankable proposal for your site.
                    </p>
                    <Link href="/contact" className="btn-primary w-full justify-center text-center">
                      Book a Consultation
                    </Link>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
