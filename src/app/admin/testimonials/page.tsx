// src/app/admin/testimonials/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-sol-ink">Testimonials</h1>
          <p className="text-sol-steel text-sm mt-0.5">
            {testimonials.length} total · {testimonials.filter((t) => t.published).length} published
          </p>
        </div>
        <Link href="/admin/testimonials/new" className="btn-primary">
          <Plus size={14} /> Add Testimonial
        </Link>
      </div>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="surface-card p-5 flex items-start gap-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sol-sky to-sol-leaf flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {t.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <span className="font-semibold text-sol-ink text-sm">{t.name}</span>
                  <span className="text-sol-steel text-[0.78rem] ml-2">
                    {t.role}{t.company ? `, ${t.company}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {t.featured && <span className="badge badge-amber">Featured</span>}
                  <span className={t.published ? 'status-published' : 'status-draft'}>
                    {t.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              {/* Stars */}
              <div className="flex text-sol-amber text-xs mb-2">
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <p className="text-[0.82rem] text-sol-steel leading-relaxed line-clamp-2">
                "{t.text}"
              </p>
              <div className="text-[0.68rem] text-sol-smoke mt-2">{timeAgo(t.createdAt)}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link
                href={`/admin/testimonials/${t.id}/edit`}
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
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="surface-card py-16 text-center">
            <div className="text-4xl mb-3">💬</div>
            <div className="font-display text-xl text-sol-ink mb-1">No testimonials yet</div>
            <p className="text-sol-steel text-sm mb-4">
              Add client testimonials to build trust and credibility.
            </p>
            <Link href="/admin/testimonials/new" className="btn-primary">
              <Plus size={14} /> Add First Testimonial
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
