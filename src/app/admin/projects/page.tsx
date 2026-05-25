// src/app/admin/projects/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { PROJECT_CATEGORY_LABELS } from '@/types'
import type { ProjectCategory } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-sol-ink">Projects</h1>
          <p className="text-sol-steel text-sm mt-0.5">
            {projects.length} projects · {projects.filter((p) => p.published).length} published
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="btn-primary"
        >
          <Plus size={14} /> Add Project
        </Link>
      </div>

      <div className="surface-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="font-semibold text-sol-ink text-sm">{p.title}</div>
                  <div className="text-[0.72rem] text-sol-steel">{p.location} · {formatDate(p.completionDate)}</div>
                </td>
                <td>
                  <span className="badge badge-blue">
                    {PROJECT_CATEGORY_LABELS[p.category as ProjectCategory]}
                  </span>
                </td>
                <td className="text-sm font-mono text-sol-sky">{p.capacity}</td>
                <td>
                  <span className={p.published ? 'status-published' : 'status-draft'}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  {p.featured ? (
                    <span className="badge badge-amber">Featured</span>
                  ) : (
                    <span className="text-sol-smoke text-xs">—</span>
                  )}
                </td>
                <td className="font-mono text-sm text-sol-steel">{p.viewCount}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="p-1.5 text-sol-steel hover:text-sol-sky transition-colors"
                      title="View live"
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="p-1.5 text-sol-steel hover:text-sol-sky transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      className="p-1.5 text-sol-steel hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <div className="font-display text-xl text-sol-ink mb-1">No projects yet</div>
            <p className="text-sol-steel text-sm mb-4">Add your first solar project to showcase your work.</p>
            <Link href="/admin/projects/new" className="btn-primary">
              <Plus size={14} /> Add First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
