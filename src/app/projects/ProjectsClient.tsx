'use client'
// src/app/projects/ProjectsClient.tsx
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import ProjectCard from '@/components/ui/ProjectCard'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import type { Project, ProjectCategory } from '@/types'
import { PROJECT_CATEGORY_LABELS } from '@/types'
import { cn } from '@/lib/utils'

const ALL_CATEGORIES = Object.keys(PROJECT_CATEGORY_LABELS) as ProjectCategory[]

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'ALL'>('ALL')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCategory === 'ALL' || p.category === activeCategory
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [projects, activeCategory, search])

  return (
    <section className="section-wrapper bg-sol-ash">
      <div className="section-inner">
        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sol-steel" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="form-input pl-9 !bg-white"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={cn(
                'px-4 py-2 rounded-full text-[0.75rem] font-medium border transition-all duration-200',
                activeCategory === 'ALL'
                  ? 'bg-sol-sky text-white border-sol-sky'
                  : 'bg-white text-sol-steel border-sol-smoke hover:border-sol-sky hover:text-sol-sky'
              )}
            >
              All Projects
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-[0.75rem] font-medium border transition-all duration-200',
                  activeCategory === cat
                    ? 'bg-sol-sky text-white border-sol-sky'
                    : 'bg-white text-sol-steel border-sol-smoke hover:border-sol-sky hover:text-sol-sky'
                )}
              >
                {PROJECT_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-[0.78rem] text-sol-steel mb-6">
          Showing <strong className="text-sol-ink">{filtered.length}</strong> project{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'ALL' && ` in ${PROJECT_CATEGORY_LABELS[activeCategory]}`}
          {search && ` matching "${search}"`}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <RevealOnScroll key={project.id} delay={(i % 3) * 0.08}>
                <ProjectCard project={project} />
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-sol-steel">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-display text-xl text-sol-ink mb-1">No projects found</div>
            <p className="text-sm">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </section>
  )
}
