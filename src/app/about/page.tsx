// src/app/about/page.tsx
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — Esther Watiri Kiarie',
  description: "Esther's journey from electrical engineer to leading solar technical sales manager across East Africa. 9+ years, 4.8 MW deployed.",
}

const TIMELINE = [
  { year: '2024 – Present', title: 'Technical Sales Manager', org: 'Leading East African Solar Developer', desc: 'Leading solar sales strategy, enterprise accounts, and project pipeline development across Kenya, Tanzania, and Uganda.' },
  { year: '2021 – 2024',   title: 'Senior Solar Project Engineer', org: 'Renewable Energy Solutions Ltd', desc: 'Designed and commissioned 18+ commercial and industrial solar systems. Led system sizing, PVsyst modelling, and client technical presentations.' },
  { year: '2018 – 2021',   title: 'Renewable Energy Consultant', org: 'UNDP Energy Access Programme', desc: 'Conducted energy audits and feasibility studies for rural electrification programs. Delivered 12 off-grid community microgrids.' },
  { year: '2015 – 2018',   title: 'Electrical Engineer (Power Systems)', org: 'Kenya Power', desc: 'Power distribution and grid engineering. Built deep foundational knowledge in energy infrastructure, metering, and demand-side management.' },
]

const EXPERTISE = [
  'Commercial & Industrial Solar Design',
  'Energy Audits & Feasibility Studies',
  'Financial Modelling & ROI Analysis',
  'Off-Grid & Hybrid System Design',
  'PVsyst & HOMER Pro Simulation',
  'Battery Storage System Sizing',
  'Stakeholder & Client Relationships',
  'Project Management & Commissioning',
  'Technical Proposal Writing',
  'Procurement & Vendor Management',
]

const VALUES = [
  { icon: '🎯', title: 'Technical Precision', desc: 'Every project is grounded in rigorous energy analysis, accurate system design, and engineering best practices.' },
  { icon: '🤝', title: 'Client-Centred', desc: 'Solutions built around real business needs and financial realities — not just technical specifications.' },
  { icon: '🌿', title: 'Sustainability First', desc: 'Long-term environmental and social impact is always at the centre of every energy recommendation.' },
  { icon: '📊', title: 'Data-Driven', desc: 'ROI models, energy monitoring, and performance tracking guide every recommendation from day one.' },
]

export const revalidate = 3600

export default async function AboutPage() {
  const profile = await prisma.profile.findFirst()

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        {/* Header */}
        <section className="bg-sol-ink text-white py-20 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-sol-amber flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-sol-amber" /> My Story
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-3">
              Powering Africa's <strong className="font-semibold">Energy Future</strong>
            </h1>
            <p className="text-white/55 max-w-xl leading-relaxed">
              A decade of expertise at the intersection of technical excellence and commercial strategy in renewable energy.
            </p>
          </div>
        </section>

        {/* Bio + Portrait */}
        <section className="section-wrapper bg-white">
          <div className="section-inner">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 items-start">
              {/* Portrait card */}
              <RevealOnScroll direction="left">
                <div>
                  <div className="bg-gradient-to-br from-sol-deep to-sol-sky rounded-2xl aspect-[3/4] flex items-end p-6 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center font-display text-[10rem] font-light text-white/8 pointer-events-none select-none">
                      EWK
                    </div>
                    <div className="relative bg-white rounded-xl p-4 w-full">
                      <div className="font-display text-lg font-semibold text-sol-ink">Esther Watiri Kiarie</div>
                      <div className="text-[0.72rem] tracking-wide uppercase text-sol-sky mt-0.5">Technical Sales Manager · Solar Energy</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { val: profile?.statsMwDeployed ?? 4.8, dec: 1, suf: ' MW', label: 'Deployed' },
                      { val: profile?.statsProjects   ?? 62,  dec: 0, suf: '+',   label: 'Projects' },
                      { val: profile?.statsClients    ?? 140, dec: 0, suf: '+',   label: 'Clients' },
                      { val: profile?.statsYears      ?? 9,   dec: 0, suf: ' yrs', label: 'Experience' },
                    ].map((s) => (
                      <div key={s.label} className="surface-card p-4 text-center">
                        <div className="font-display text-2xl font-semibold text-sol-amber">
                          <AnimatedCounter end={s.val} decimals={s.dec} suffix={s.suf} />
                        </div>
                        <div className="text-[0.68rem] tracking-wide uppercase text-sol-steel mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>

              {/* Bio text */}
              <RevealOnScroll>
                <div className="space-y-5 text-sol-steel leading-relaxed text-[0.95rem]">
                  {(profile?.bio || '').split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {VALUES.map((v) => (
                    <div key={v.title} className="p-4 bg-sol-ash rounded-xl border-l-4 border-sol-amber">
                      <div className="text-lg mb-1">{v.icon}</div>
                      <div className="font-semibold text-sol-ink text-sm mb-1">{v.title}</div>
                      <div className="text-[0.78rem] text-sol-steel leading-relaxed">{v.desc}</div>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-wrapper bg-sol-ash">
          <div className="section-inner">
            <RevealOnScroll>
              <div className="section-label">Career Path</div>
              <h2 className="font-display text-4xl font-light text-sol-ink mb-10">
                Professional <strong className="font-semibold">Timeline</strong>
              </h2>
            </RevealOnScroll>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sol-amber via-sol-sky to-sol-leaf" />

              <div className="space-y-8">
                {TIMELINE.map((item, i) => (
                  <RevealOnScroll key={i} delay={i * 0.1}>
                    <div className="relative pl-16">
                      <div className="absolute left-[18px] top-1.5 w-3 h-3 rounded-full bg-sol-amber border-2 border-white shadow-glow-amber" />
                      <div className="font-mono text-[0.72rem] text-sol-steel tracking-wide mb-1">{item.year}</div>
                      <div className="font-semibold text-sol-ink mb-0.5">{item.title}</div>
                      <div className="text-[0.8rem] text-sol-sky mb-1.5 font-medium">{item.org}</div>
                      <div className="text-[0.85rem] text-sol-steel leading-relaxed">{item.desc}</div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className="section-wrapper bg-white">
          <div className="section-inner">
            <RevealOnScroll>
              <div className="section-label">Core Skills</div>
              <h2 className="font-display text-4xl font-light text-sol-ink mb-8">
                Areas of <strong className="font-semibold">Expertise</strong>
              </h2>
            </RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {EXPERTISE.map((skill, i) => (
                <RevealOnScroll key={skill} delay={(i % 3) * 0.06}>
                  <div className="flex items-center gap-3 p-4 bg-sol-ash rounded-xl border border-sol-fog hover:border-sol-sky hover:bg-sol-sky/4 transition-all group">
                    <CheckCircle size={16} className="text-sol-mint flex-shrink-0 group-hover:text-sol-sky transition-colors" />
                    <span className="text-sm font-medium text-sol-ink">{skill}</span>
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
