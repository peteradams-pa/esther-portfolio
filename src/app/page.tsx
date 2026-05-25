// src/app/page.tsx
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import SolarCalculator from '@/components/sections/SolarCalculator'
import ProjectCard from '@/components/ui/ProjectCard'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import type { Project, Testimonial } from '@/types'

export const revalidate = 60 // ISR — revalidate every minute

export const metadata: Metadata = {
  title: 'Esther Watiri Kiarie | Solar Energy Technical Sales Manager',
}

async function getData() {
  const [profile, featuredProjects, testimonials] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findMany({
      where: { featured: true, published: true },
      orderBy: { completionDate: 'desc' },
      take: 3,
    }),
    prisma.testimonial.findMany({
      where: { featured: true, published: true },
      take: 3,
    }),
  ])
  return { profile, featuredProjects, testimonials }
}

export default async function HomePage() {
  const { profile, featuredProjects, testimonials } = await getData()

  const stats = {
    mwDeployed: profile?.statsMwDeployed ?? 4.8,
    projects:   profile?.statsProjects   ?? 62,
    clients:    profile?.statsClients    ?? 140,
    years:      profile?.statsYears      ?? 9,
  }

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero */}
        <HeroSection stats={stats} />

        {/* ── Featured Projects */}
        <section className="section-wrapper bg-white">
          <div className="section-inner">
            <RevealOnScroll>
              <div className="section-label">Featured Work</div>
              <h2 className="font-display text-4xl font-light text-sol-ink mb-3">
                Signature <strong className="font-semibold">Solar Projects</strong>
              </h2>
              <p className="text-sol-steel max-w-lg leading-relaxed mb-10">
                A selection of high-impact renewable energy installations spanning commercial, industrial, and community use cases.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((p, i) => (
                <RevealOnScroll key={p.id} delay={i * 0.1}>
                  <ProjectCard project={p as unknown as Project} />
                </RevealOnScroll>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/projects" className="btn-secondary inline-flex group">
                View All Projects
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Solar Calculator */}
        <SolarCalculator />

        {/* ── Testimonials */}
        <section className="section-wrapper bg-sol-ink text-white">
          <div className="section-inner">
            <RevealOnScroll>
              <div className="section-label" style={{ color: 'var(--tw-prose-bold)' }}>
                <span className="text-sol-amber">What Clients Say</span>
              </div>
              <h2 className="font-display text-4xl font-light text-white mb-3">
                Voices of <strong className="font-semibold text-sol-amber">Trust</strong>
              </h2>
              <p className="text-white/50 max-w-lg leading-relaxed mb-10">
                From C-suite executives to NGO directors — consistent impact, earned trust.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <RevealOnScroll key={t.id} delay={i * 0.1}>
                  <div className="glass-card p-6 hover:bg-white/7 transition-colors">
                    <div className="font-display text-5xl text-sol-amber leading-none mb-3">"</div>
                    <p className="text-[0.88rem] leading-relaxed text-white/70 mb-4">{t.text}</p>
                    <div className="flex text-sol-amber text-sm mb-4">
                      {'★'.repeat(t.rating)}
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sol-sky to-sol-leaf flex items-center justify-center text-white font-display font-semibold text-sm flex-shrink-0">
                        {t.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{t.name}</div>
                        <div className="text-[0.72rem] text-white/40">
                          {t.role}{t.company ? `, ${t.company}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/testimonials" className="btn-outline-white">
                Read More Testimonials →
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA Strip */}
        <section className="py-20 px-6 bg-gradient-to-br from-sol-amber via-amber-400 to-sol-gold">
          <div className="max-w-3xl mx-auto text-center">
            <RevealOnScroll>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-sol-ink mb-4">
                Ready to harness solar energy?
              </h2>
              <p className="text-sol-ink/70 text-lg mb-8">
                Get a personalised consultation and bankable feasibility study for your project.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-sol-ink text-white font-semibold rounded-lg hover:-translate-y-1 transition-transform">
                Book a Free Consultation
                <ArrowRight size={16} />
              </Link>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
