'use client'
// src/app/admin/inquiries/InquiryActions.tsx
import { useState } from 'react'
import { Mail, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  id: string
  email: string
  status: string
}

export default function InquiryActions({ id, email, status }: Props) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [updating, setUpdating] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      setCurrentStatus(newStatus)
      toast.success(`Marked as ${newStatus.toLowerCase()}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <a
        href={`mailto:${email}`}
        className="p-1.5 text-sol-steel hover:text-sol-sky transition-colors"
        title="Reply via email"
      >
        <Mail size={14} />
      </a>
      {currentStatus !== 'REPLIED' && (
        <button
          onClick={() => updateStatus('REPLIED')}
          disabled={updating}
          className="p-1.5 text-sol-steel hover:text-sol-mint transition-colors disabled:opacity-40"
          title="Mark as replied"
        >
          <CheckCircle size={14} />
        </button>
      )}
      {currentStatus !== 'CLOSED' && (
        <button
          onClick={() => updateStatus('CLOSED')}
          disabled={updating}
          className="p-1.5 text-sol-steel hover:text-sol-leaf transition-colors disabled:opacity-40"
          title="Mark as closed"
        >
          <XCircle size={14} />
        </button>
      )}
    </div>
  )
}
