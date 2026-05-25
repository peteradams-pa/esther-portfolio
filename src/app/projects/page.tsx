// src/app/projects/page.tsx
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectsClient from './ProjectsClient'
import type { Project } from '@/types'

export const metadata: Metadata = {
  title: 'Solar Project Portfolio',
  description: "Browse Esther Watiri Kiarie's portfolio of commercial, industrial, and off-grid solar energy projects across Kenya and East Africa.",
}

export const revalidate = 60

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { completionDate: 'desc' }],
  })

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        {/* Header */}
        <section className="bg-sol-ink text-white py-20 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="section-label" style={{ color: undefined }}>
              <span className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-sol-amber">
                <span className="w-6 h-0.5 bg-sol-amber" />
                Project Portfolio
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mt-3 mb-3">
              Solar Energy <strong className="font-semibold">Case Studies</strong>
            </h1>
            <p className="text-white/55 max-w-xl text-base leading-relaxed">
              Each project represents a unique energy challenge solved with precision engineering, strategic planning, and measurable outcomes.
            </p>
            <div className="flex gap-8 mt-8">
              {[
                { val: `${projects.length}+`, label: 'Projects Shown' },
                { val: '4.8 MW', label: 'Total Capacity' },
                { val: '6', label: 'Categories' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-semibold text-sol-amber">{s.val}</div>
                  <div className="text-[0.68rem] tracking-widest uppercase text-white/35 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProjectsClient projects={projects as unknown as Project[]} />
      </main>
      <Footer />
    </>
  )
}
