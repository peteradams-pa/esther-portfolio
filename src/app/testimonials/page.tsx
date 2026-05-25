// src/app/testimonials/page.tsx
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import { generateInitials } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Client Testimonials',
  description: "What clients, colleagues, and partners say about working with Esther Watiri Kiarie on solar energy projects.",
}

export const revalidate = 3600

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })

  const featured = testimonials.filter((t) => t.featured)
  const rest = testimonials.filter((t) => !t.featured)

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] bg-sol-ink min-h-screen">
        {/* Header */}
        <section className="py-20 px-6 md:px-10 border-b border-white/8">
          <div className="max-w-6xl mx-auto">
            <div className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-sol-amber flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-sol-amber" /> Client Voices
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-3">
              What They Say About <strong className="font-semibold text-sol-amber">My Work</strong>
            </h1>
            <p className="text-white/50 max-w-lg leading-relaxed">
              From C-suite executives to NGO directors — consistent impact, technical credibility, and earned trust.
            </p>
            <div className="flex gap-8 mt-8">
              <div>
                <div className="font-display text-2xl font-semibold text-sol-amber">{testimonials.length}+</div>
                <div className="text-[0.68rem] tracking-widest uppercase text-white/30 mt-0.5">Testimonials</div>
              </div>
              <div>
                <div className="font-display text-2xl font-semibold text-sol-amber">5.0</div>
                <div className="text-[0.68rem] tracking-widest uppercase text-white/30 mt-0.5">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured — large cards */}
        {featured.length > 0 && (
          <section className="py-16 px-6 md:px-10">
            <div className="max-w-6xl mx-auto">
              <RevealOnScroll>
                <div className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-sol-amber flex items-center gap-2 mb-8">
                  <span className="w-6 h-0.5 bg-sol-amber" /> Featured
                </div>
              </RevealOnScroll>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map((t, i) => (
                  <RevealOnScroll key={t.id} delay={(i % 3) * 0.1}>
                    <div className="glass-card p-7 hover:bg-white/7 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                      <div className="font-display text-5xl text-sol-amber leading-none mb-4">"</div>
                      <p className="text-[0.9rem] leading-relaxed text-white/72 flex-1 mb-5">{t.text}</p>
                      <div>
                        <div className="text-sol-amber text-sm tracking-widest mb-4">
                          {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sol-sky to-sol-leaf flex items-center justify-center text-white font-display font-semibold flex-shrink-0">
                            {generateInitials(t.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{t.name}</div>
                            <div className="text-[0.72rem] text-white/40">
                              {t.role}{t.company ? `, ${t.company}` : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <section className="pb-16 px-6 md:px-10">
            <div className="max-w-6xl mx-auto">
              <RevealOnScroll>
                <div className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-white/25 flex items-center gap-2 mb-8">
                  <span className="w-6 h-0.5 bg-white/20" /> More Testimonials
                </div>
              </RevealOnScroll>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rest.map((t, i) => (
                  <RevealOnScroll key={t.id} delay={(i % 2) * 0.08}>
                    <div className="glass-card p-6 hover:bg-white/6 transition-all duration-300">
                      <p className="text-[0.88rem] leading-relaxed text-white/65 mb-4 italic">"{t.text}"</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sol-amber to-sol-sky flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {generateInitials(t.name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{t.name}</div>
                            <div className="text-[0.68rem] text-white/35">{t.role}{t.company ? `, ${t.company}` : ''}</div>
                          </div>
                        </div>
                        <div className="text-sol-amber text-xs">{'★'.repeat(t.rating)}</div>
                      </div>
                    </div>
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
