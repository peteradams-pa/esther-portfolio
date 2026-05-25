'use client'
// src/app/admin/seo/SeoForm.tsx
import { useState } from 'react'
import { Save, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  seo: { id: string; page: string; title: string; description: string; keywords?: string | null }
  label: string
}

export default function SeoForm({ seo, label }: Props) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title:       seo.title       || '',
    description: seo.description || '',
    keywords:    seo.keywords    || '',
  })

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/seo/${seo.page}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success(`${label} SEO saved!`)
    } catch {
      toast.error('Failed to save SEO settings')
    } finally {
      setSaving(false)
    }
  }

  const titleLen = form.title.length
  const descLen  = form.description.length

  return (
    <div className="surface-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-sol-ash transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sol-ink text-sm">{label}</span>
          {form.title && (
            <span className="text-[0.72rem] text-sol-steel truncate max-w-xs hidden md:block">
              {form.title}
            </span>
          )}
          {!form.title && (
            <span className="badge badge-amber text-[0.6rem]">No title set</span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-sol-steel" /> : <ChevronDown size={16} className="text-sol-steel" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-sol-fog space-y-4 pt-4">
          <div>
            <label className="form-label">
              Meta Title
              <span className={`ml-2 font-normal normal-case tracking-normal ${
                titleLen > 60 ? 'text-red-500' : titleLen > 50 ? 'text-sol-amber' : 'text-sol-steel'
              }`}>
                {titleLen}/60
              </span>
            </label>
            <input
              className="form-input"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder={`e.g. Esther Watiri Kiarie | ${label.replace(/[🏠👤⚡🏆💬✍️📬]/g, '').trim()}`}
            />
          </div>
          <div>
            <label className="form-label">
              Meta Description
              <span className={`ml-2 font-normal normal-case tracking-normal ${
                descLen > 160 ? 'text-red-500' : descLen > 140 ? 'text-sol-amber' : 'text-sol-steel'
              }`}>
                {descLen}/160
              </span>
            </label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe this page for search engines…"
            />
          </div>
          <div>
            <label className="form-label">Keywords (comma separated)</label>
            <input
              className="form-input"
              value={form.keywords}
              onChange={(e) => update('keywords', e.target.value)}
              placeholder="solar energy Kenya, renewable energy consultant…"
            />
          </div>

          {/* SERP preview */}
          <div className="bg-sol-ash rounded-lg p-4">
            <div className="text-[0.65rem] tracking-widest uppercase text-sol-steel mb-2">
              Google Preview
            </div>
            <div className="text-[0.9rem] text-blue-600 font-medium leading-snug mb-0.5 truncate">
              {form.title || 'Page Title'}
            </div>
            <div className="text-[0.72rem] text-green-700 mb-0.5">
              https://estherkiarie.com/{seo.page === 'home' ? '' : seo.page}
            </div>
            <div className="text-[0.78rem] text-gray-600 leading-relaxed line-clamp-2">
              {form.description || 'Page description will appear here…'}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-secondary disabled:opacity-50"
          >
            <Save size={13} />
            {saving ? 'Saving…' : 'Save SEO'}
          </button>
        </div>
      )}
    </div>
  )
}
