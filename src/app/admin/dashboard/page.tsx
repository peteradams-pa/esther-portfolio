// src/app/admin/dashboard/page.tsx
import { prisma } from '@/lib/prisma'
import { Eye, Inbox, Zap, FileText, TrendingUp, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [
    totalViews,
    totalInquiries,
    newInquiries,
    totalProjects,
    publishedProjects,
    totalPosts,
    publishedPosts,
    recentInquiries,
    topProjects,
  ] = await Promise.all([
    prisma.analyticsEvent.count({ where: { event: 'page_view' } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: { id: true, title: true, category: true, viewCount: true, inquiryCount: true },
    }),
  ])

  return {
    totalViews, totalInquiries, newInquiries,
    totalProjects, publishedProjects,
    totalPosts, publishedPosts,
    recentInquiries, topProjects,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const statCards = [
    { label: 'Profile Views',       value: stats.totalViews.toLocaleString(), icon: Eye,       color: 'text-sol-sky',   delta: null },
    { label: 'Total Inquiries',     value: stats.totalInquiries.toString(),   icon: Inbox,     color: 'text-sol-mint',  delta: stats.newInquiries > 0 ? `${stats.newInquiries} new` : null },
    { label: 'Active Projects',     value: stats.publishedProjects.toString(), icon: Zap,       color: 'text-sol-amber', delta: `${stats.totalProjects} total` },
    { label: 'Published Articles',  value: stats.publishedPosts.toString(),   icon: FileText,  color: 'text-purple-500', delta: `${stats.totalPosts} total` },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-sol-ink">Dashboard</h1>
        <p className="text-sol-steel text-sm mt-0.5">Welcome back, Esther — here's your portfolio overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, delta }) => (
          <div key={label} className="surface-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-current/10 flex items-center justify-center ${color}`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <div className={`font-display text-3xl font-semibold ${color} leading-none mb-0.5`}>
              {value}
            </div>
            <div className="text-[0.72rem] tracking-wide uppercase text-sol-steel">{label}</div>
            {delta && (
              <div className="text-[0.72rem] text-sol-leaf mt-1.5 flex items-center gap-1">
                <TrendingUp size={10} /> {delta}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Recent inquiries */}
        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sol-ink text-sm">Latest Inquiries</h2>
            <Link href="/admin/inquiries" className="text-[0.72rem] text-sol-sky hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="space-y-1">
            {stats.recentInquiries.length === 0 && (
              <p className="text-sol-steel text-sm py-4 text-center">No inquiries yet</p>
            )}
            {stats.recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-start gap-3 py-3 border-b border-sol-fog last:border-0">
                <div className="w-8 h-8 rounded-full bg-sol-sky flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {inq.firstName[0]}{inq.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-sol-ink">
                    {inq.firstName} {inq.lastName}
                    {inq.company && <span className="font-normal text-sol-steel"> · {inq.company}</span>}
                  </div>
                  <div className="text-[0.75rem] text-sol-steel truncate">{inq.inquiryType}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`badge ${inq.status === 'NEW' ? 'badge-blue' : inq.status === 'REPLIED' ? 'badge-gray' : 'badge-green'}`}>
                    {inq.status.toLowerCase()}
                  </span>
                  <span className="text-[0.65rem] text-sol-smoke">{timeAgo(inq.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top projects */}
        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sol-ink text-sm">Top Performing Projects</h2>
            <Link href="/admin/projects" className="text-[0.72rem] text-sol-sky hover:underline flex items-center gap-1">
              Manage <ArrowUpRight size={11} />
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Views</th>
                <th>Leads</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProjects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-medium text-sol-ink text-sm">{p.title}</div>
                    <div className="text-[0.68rem] text-sol-steel">{p.category.replace('_', ' ')}</div>
                  </td>
                  <td className="font-mono text-sm font-semibold text-sol-sky">{p.viewCount}</td>
                  <td className="font-mono text-sm font-semibold text-sol-mint">{p.inquiryCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="surface-card p-6">
        <h2 className="font-semibold text-sol-ink text-sm mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ New Project',     href: '/admin/projects?new=true',     color: 'bg-sol-sky text-white' },
            { label: '+ New Blog Post',   href: '/admin/blog?new=true',         color: 'bg-sol-deep text-white' },
            { label: '+ Add Achievement', href: '/admin/achievements?new=true', color: 'bg-sol-amber text-sol-ink' },
            { label: 'View Inquiries',    href: '/admin/inquiries',             color: 'bg-sol-ash text-sol-ink border border-sol-fog' },
          ].map(({ label, href, color }) => (
            <Link
              key={label}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 ${color}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
