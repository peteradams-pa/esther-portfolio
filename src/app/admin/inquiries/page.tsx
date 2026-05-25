// src/app/admin/inquiries/page.tsx
import { prisma } from '@/lib/prisma'
import { formatDateFull, timeAgo } from '@/lib/utils'
import InquiryActions from './InquiryActions'

export const dynamic = 'force-dynamic'

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: { project: { select: { title: true, slug: true } } },
  })

  const counts = {
    all:     inquiries.length,
    new:     inquiries.filter((i) => i.status === 'NEW').length,
    replied: inquiries.filter((i) => i.status === 'REPLIED').length,
    closed:  inquiries.filter((i) => i.status === 'CLOSED').length,
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-sol-ink">Inquiries</h1>
          <p className="text-sol-steel text-sm mt-0.5">
            {counts.all} total · <span className="text-sol-sky font-semibold">{counts.new} new</span>
          </p>
        </div>
        <button className="btn-outline text-sm">
          Export CSV
        </button>
      </div>

      {/* Status counts */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'All',     count: counts.all,     color: 'border-l-sol-steel' },
          { label: 'New',     count: counts.new,     color: 'border-l-sol-sky' },
          { label: 'Replied', count: counts.replied,  color: 'border-l-sol-amber' },
          { label: 'Closed',  count: counts.closed,  color: 'border-l-sol-leaf' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`surface-card p-4 border-l-4 ${color}`}>
            <div className="font-display text-2xl font-semibold text-sol-ink">{count}</div>
            <div className="text-[0.72rem] tracking-wide uppercase text-sol-steel">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Inquiry Type</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sol-sky flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {inq.firstName[0]}{inq.lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sol-ink text-sm">{inq.firstName} {inq.lastName}</div>
                      <a href={`mailto:${inq.email}`} className="text-[0.72rem] text-sol-sky hover:underline">{inq.email}</a>
                      {inq.company && <div className="text-[0.68rem] text-sol-steel">{inq.company}</div>}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-blue text-[0.65rem]">{inq.inquiryType}</span>
                </td>
                <td>
                  <p className="text-[0.78rem] text-sol-steel max-w-xs line-clamp-2">{inq.message}</p>
                </td>
                <td>
                  <div className="text-[0.75rem] text-sol-steel">{formatDateFull(inq.createdAt)}</div>
                  <div className="text-[0.65rem] text-sol-smoke">{timeAgo(inq.createdAt)}</div>
                </td>
                <td>
                  <span className={
                    inq.status === 'NEW'     ? 'status-new' :
                    inq.status === 'REPLIED' ? 'status-replied' :
                    inq.status === 'CLOSED'  ? 'status-closed' : 'status-draft'
                  }>
                    {inq.status.toLowerCase()}
                  </span>
                </td>
                <td>
                  <InquiryActions id={inq.id} email={inq.email} status={inq.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inquiries.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📥</div>
            <div className="font-display text-xl text-sol-ink mb-1">No inquiries yet</div>
            <p className="text-sol-steel text-sm">Inquiries from your contact form will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
