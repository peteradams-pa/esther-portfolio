// src/app/achievements/page.tsx
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import { ACHIEVEMENT_TYPE_LABELS, ACHIEVEMENT_TYPE_ICONS } from '@/lib/utils'
import type { AchievementType } from '@/types'

export const metadata: Metadata = {
  title: 'Achievements & Certifications',
  description: "Esther Watiri Kiarie's professional certifications, awards, speaking engagements, and industry recognition in renewable energy.",
}

export const revalidate = 3600

const TYPE_COLORS: Record<string, string> = {
  CERTIFICATION: 'border-t-sol-amber',
  AWARD:         'border-t-sol-mint',
  TRAINING:      'border-t-sol-sky',
  CONFERENCE:    'border-t-sol-mid',
  SPEAKING:      'border-t-purple-500',
  RECOGNITION:   'border-t-sol-gold',
}

const ICON_BG: Record<string, string> = {
  CERTIFICATION: 'bg-amber-50',
  AWARD:         'bg-green-50',
  TRAINING:      'bg-blue-50',
  CONFERENCE:    'bg-sky-50',
  SPEAKING:      'bg-purple-50',
  RECOGNITION:   'bg-yellow-50',
}

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { year: 'desc' }],
  })

  const featured = achievements.filter((a) => a.featured)
  const byType = achievements.reduce((acc, a) => {
    acc[a.type] = acc[a.type] || []
    acc[a.type].push(a)
    return acc
  }, {} as Record<string, typeof achievements>)

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        {/* Header */}
        <section className="bg-sol-ink text-white py-20 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-sol-amber flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-sol-amber" /> Recognition & Credentials
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-3">
              Achievements & <strong className="font-semibold">Certifications</strong>
            </h1>
            <p className="text-white/55 max-w-xl leading-relaxed">
              A record of professional development, industry recognition, and technical mastery in renewable energy.
            </p>
            <div className="flex gap-8 mt-8">
              <div><div className="font-display text-2xl font-semibold text-sol-amber">{achievements.length}+</div><div className="text-[0.68rem] tracking-widest uppercase text-white/35 mt-0.5">Credentials</div></div>
              <div><div className="font-display text-2xl font-semibold text-sol-amber">{featured.length}</div><div className="text-[0.68rem] tracking-widest uppercase text-white/35 mt-0.5">Featured</div></div>
              <div><div className="font-display text-2xl font-semibold text-sol-amber">9+</div><div className="text-[0.68rem] tracking-widest uppercase text-white/35 mt-0.5">Years Active</div></div>
            </div>
          </div>
        </section>

        {/* Featured achievements */}
        {featured.length > 0 && (
          <section className="section-wrapper bg-white">
            <div className="section-inner">
              <RevealOnScroll>
                <div className="section-label">Highlights</div>
                <h2 className="font-display text-3xl font-light text-sol-ink mb-8">
                  Featured <strong className="font-semibold">Credentials</strong>
                </h2>
              </RevealOnScroll>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map((a, i) => (
                  <RevealOnScroll key={a.id} delay={(i % 3) * 0.08}>
                    <div className={`surface-card p-6 border-t-4 ${TYPE_COLORS[a.type]} hover:-translate-y-1 hover:shadow-solar transition-all duration-300`}>
                      <div className={`w-12 h-12 rounded-xl ${ICON_BG[a.type]} flex items-center justify-center text-2xl mb-4`}>
                        {ACHIEVEMENT_TYPE_ICONS[a.type]}
                      </div>
                      <div className="badge badge-amber mb-2">{ACHIEVEMENT_TYPE_LABELS[a.type as AchievementType]}</div>
                      <h3 className="font-semibold text-sol-ink mb-1 leading-snug">{a.title}</h3>
                      <p className="text-[0.78rem] text-sol-sky font-medium mb-1">{a.issuer}</p>
                      <p className="font-mono text-[0.72rem] text-sol-steel">{a.year}</p>
                      {a.description && <p className="text-[0.78rem] text-sol-steel mt-2 leading-relaxed">{a.description}</p>}
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All by type */}
        <section className="section-wrapper bg-sol-ash">
          <div className="section-inner">
            <RevealOnScroll>
              <div className="section-label">Full Record</div>
              <h2 className="font-display text-3xl font-light text-sol-ink mb-8">
                Complete <strong className="font-semibold">Achievement Record</strong>
              </h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {achievements.map((a, i) => (
                <RevealOnScroll key={a.id} delay={(i % 3) * 0.06}>
                  <div className={`surface-card p-5 border-t-4 ${TYPE_COLORS[a.type]} transition-all hover:-translate-y-0.5 hover:shadow-sm`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-10 h-10 rounded-lg ${ICON_BG[a.type]} flex items-center justify-center text-xl flex-shrink-0`}>
                        {ACHIEVEMENT_TYPE_ICONS[a.type]}
                      </div>
                      <span className="font-mono text-[0.68rem] text-sol-steel">{a.year}</span>
                    </div>
                    <div className="mt-3">
                      <div className="badge badge-gray mb-1.5">{ACHIEVEMENT_TYPE_LABELS[a.type as AchievementType]}</div>
                      <h3 className="font-semibold text-sol-ink text-sm leading-snug mb-0.5">{a.title}</h3>
                      <p className="text-[0.75rem] text-sol-sky">{a.issuer}</p>
                      {a.description && <p className="text-[0.72rem] text-sol-steel mt-1.5 leading-relaxed">{a.description}</p>}
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
