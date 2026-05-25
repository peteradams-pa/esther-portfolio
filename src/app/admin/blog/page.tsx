// src/app/admin/blog/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'
import { formatDateFull } from '@/lib/utils'
import { BLOG_CATEGORY_LABELS } from '@/types'
import type { BlogCategory } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-sol-ink">Blog Posts</h1>
          <p className="text-sol-steel text-sm mt-0.5">
            {posts.length} articles · {posts.filter((p) => p.published).length} published
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary">
          <Plus size={14} /> New Article
        </Link>
      </div>

      <div className="surface-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Read Time</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Views</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div className="font-semibold text-sol-ink text-sm max-w-xs">{post.title}</div>
                  {post.excerpt && (
                    <div className="text-[0.7rem] text-sol-steel truncate max-w-xs mt-0.5">
                      {post.excerpt}
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge badge-blue">
                    {BLOG_CATEGORY_LABELS[post.category as BlogCategory]}
                  </span>
                </td>
                <td className="text-sm text-sol-steel">{post.readTime} min</td>
                <td>
                  <span className={post.published ? 'status-published' : 'status-draft'}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  {post.featured ? (
                    <span className="badge badge-amber">Featured</span>
                  ) : (
                    <span className="text-sol-smoke text-xs">—</span>
                  )}
                </td>
                <td className="font-mono text-sm text-sol-steel">{post.viewCount}</td>
                <td className="text-[0.72rem] text-sol-steel">
                  {post.publishedAt ? formatDateFull(post.publishedAt) : '—'}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {post.published && (
                      <Link
                        href={`/insights/${post.slug}`}
                        target="_blank"
                        className="p-1.5 text-sol-steel hover:text-sol-sky transition-colors"
                        title="View live"
                      >
                        <Eye size={14} />
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
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

        {posts.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">✍️</div>
            <div className="font-display text-xl text-sol-ink mb-1">No articles yet</div>
            <p className="text-sol-steel text-sm mb-4">
              Share your solar energy expertise with the world.
            </p>
            <Link href="/admin/blog/new" className="btn-primary">
              <Plus size={14} /> Write First Article
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
