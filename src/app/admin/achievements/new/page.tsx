'use client'
// src/app/admin/achievements/new/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { ACHIEVEMENT_TYPE_ICONS } from '@/lib/utils'

const TYPES = [
  { value: 'CERTIFICATION', label: 'Certification' },
  { value: 'AWARD',         label: 'Award' },
  { value: 'TRAINING',      label: 'Training' },
  { value: 'CONFERENCE',    label: 'Conference' },
  { value: 'SPEAKING',      label: 'Speaking Engagement' },
  { value: 'RECOGNITION',   label: 'Recognition' },
]

export default function NewAchievementPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title:          '',
    issuer:         '',
    type:           'CERTIFICATION',
    year:           new Date().getFullYear(),
    description:    '',
    certificateUrl: '',
    featured:       false,
    published:      true,
  })

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSave = async () => {
    if (!form.title.trim() || !form.issuer.trim()) {
      toast.error('Title and issuer are required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success('Achievement saved!')
      router.push('/admin/achievements')
    } catch {
      toast.error('Failed to save achievement')
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/achievements"
          className="p-2 text-sol-steel hover:text-sol-ink transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-sol-ink">New Achievement</h1>
          <p className="text-sol-steel text-sm">Add a certification, award, or recognition</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto btn-primary disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Saving…' : 'Save Achievement'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="surface-card p-6">
            <h2 className="font-semibold text-sol-ink text-sm mb-4 pb-3 border-b border-sol-fog">
              Achievement Details
            </h2>
            <div className="space-y-4">
              <Field label="Title *">
                <input
                  className="form-input"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. NABCEP PV Associate"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Issuing Organisation *">
                  <input
                    className="form-input"
                    value={form.issuer}
                    onChange={(e) => update('issuer', e.target.value)}
                    placeholder="e.g. NABCEP"
                  />
                </Field>
                <Field label="Year *">
                  <input
                    className="form-input"
                    type="number"
                    min={2000}
                    max={2030}
                    value={form.year}
                    onChange={(e) => update('year', parseInt(e.target.value))}
                  />
                </Field>
              </div>
              <Field label="Description (optional)">
                <textarea
                  className="form-textarea"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Brief description of this achievement or what it represents…"
                />
              </Field>
              <Field label="Certificate / Credential URL (optional)">
                <input
                  className="form-input"
                  value={form.certificateUrl}
                  onChange={(e) => update('certificateUrl', e.target.value)}
                  placeholder="https://…"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="surface-card p-5">
            <h2 className="font-semibold text-sol-ink text-sm mb-4 pb-3 border-b border-sol-fog">
              Settings
            </h2>
            <div className="space-y-4">
              <Field label="Type *">
                <select
                  className="form-select"
                  value={form.type}
                  onChange={(e) => update('type', e.target.value)}
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {ACHIEVEMENT_TYPE_ICONS[t.value]} {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => update('published', e.target.checked)}
                  className="w-4 h-4 accent-sol-sky"
                />
                <span className="text-sm text-sol-ink font-medium">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => update('featured', e.target.checked)}
                  className="w-4 h-4 accent-sol-amber"
                />
                <span className="text-sm text-sol-ink font-medium">Featured</span>
              </label>
            </div>
          </div>

          {/* Live preview */}
          {form.title && (
            <div className="surface-card p-5 border-t-4 border-t-sol-amber">
              <div className="text-[0.68rem] tracking-widest uppercase text-sol-steel mb-3">
                Preview
              </div>
              <div className="text-2xl mb-2">{ACHIEVEMENT_TYPE_ICONS[form.type]}</div>
              <div className="badge badge-amber mb-2">
                {TYPES.find((t) => t.value === form.type)?.label}
              </div>
              <div className="font-semibold text-sol-ink text-sm">{form.title}</div>
              <div className="text-[0.75rem] text-sol-sky mt-0.5">{form.issuer || 'Issuer'}</div>
              <div className="font-mono text-[0.7rem] text-sol-steel mt-0.5">{form.year}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
