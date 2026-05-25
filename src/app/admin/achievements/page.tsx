// src/app/admin/achievements/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { ACHIEVEMENT_TYPE_LABELS, ACHIEVEMENT_TYPE_ICONS } from '@/lib/utils'
import type { AchievementType } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminAchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: [{ featured: 'desc' }, { year: 'desc' }],
  })

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-sol-ink">Achievements</h1>
          <p className="text-sol-steel text-sm mt-0.5">
            {achievements.length} total · {achievements.filter((a) => a.published).length} published
          </p>
        </div>
        <Link href="/admin/achievements/new" className="btn-primary">
          <Plus size={14} /> Add Achievement
        </Link>
      </div>

      <div className="surface-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Achievement</th>
              <th>Type</th>
              <th>Issuer</th>
              <th>Year</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((a) => (
              <tr key={a.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{ACHIEVEMENT_TYPE_ICONS[a.type]}</span>
                    <div className="font-semibold text-sol-ink text-sm">{a.title}</div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-blue">
                    {ACHIEVEMENT_TYPE_LABELS[a.type as AchievementType]}
                  </span>
                </td>
                <td className="text-[0.78rem] text-sol-steel max-w-[180px] truncate">{a.issuer}</td>
                <td className="font-mono text-sm text-sol-ink">{a.year}</td>
                <td>
                  <span className={a.published ? 'status-published' : 'status-draft'}>
                    {a.published ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td>
                  {a.featured ? (
                    <span className="badge badge-amber">Featured</span>
                  ) : (
                    <span className="text-sol-smoke text-xs">—</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/achievements/${a.id}/edit`}
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

        {achievements.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <div className="font-display text-xl text-sol-ink mb-1">No achievements yet</div>
            <p className="text-sol-steel text-sm mb-4">
              Add your certifications, awards, and speaking engagements.
            </p>
            <Link href="/admin/achievements/new" className="btn-primary">
              <Plus size={14} /> Add First Achievement
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
