'use client'
// src/app/admin/testimonials/new/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewTestimonialPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name:        '',
    role:        '',
    company:     '',
    text:        '',
    rating:      5,
    featured:    false,
    published:   true,
    linkedinUrl: '',
  })

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.text.trim()) {
      toast.error('Name and testimonial text are required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success('Testimonial saved!')
      router.push('/admin/testimonials')
    } catch {
      toast.error('Failed to save testimonial')
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
        <Link href="/admin/testimonials" className="p-2 text-sol-steel hover:text-sol-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-sol-ink">New Testimonial</h1>
          <p className="text-sol-steel text-sm">Add a client or colleague recommendation</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto btn-primary disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Saving…' : 'Save Testimonial'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="surface-card p-6">
            <h2 className="font-semibold text-sol-ink text-sm mb-4 pb-3 border-b border-sol-fog">
              Testimonial Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Client Name *">
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Role / Title *">
                  <input
                    className="form-input"
                    value={form.role}
                    onChange={(e) => update('role', e.target.value)}
                    placeholder="CEO"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Company">
                  <input
                    className="form-input"
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    placeholder="Acme Ltd"
                  />
                </Field>
                <Field label="LinkedIn URL">
                  <input
                    className="form-input"
                    value={form.linkedinUrl}
                    onChange={(e) => update('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/janedoe"
                  />
                </Field>
              </div>
              <Field label="Testimonial Text *">
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '140px' }}
                  value={form.text}
                  onChange={(e) => update('text', e.target.value)}
                  placeholder="What the client said about working with you…"
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
              <Field label="Star Rating">
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => update('rating', star)}
                      className={`text-2xl transition-colors ${
                        star <= form.rating ? 'text-sol-amber' : 'text-sol-smoke'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="text-[0.68rem] text-sol-steel mt-1">{form.rating} / 5 stars</div>
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
                <span className="text-sm text-sol-ink font-medium">Featured (homepage)</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {form.text && (
            <div className="surface-card p-5 bg-sol-ink text-white">
              <div className="text-[0.68rem] tracking-widest uppercase text-white/30 mb-3">Preview</div>
              <div className="font-display text-3xl text-sol-amber leading-none mb-2">"</div>
              <p className="text-[0.82rem] text-white/70 leading-relaxed mb-3 line-clamp-4">
                {form.text}
              </p>
              <div className="text-sol-amber text-xs mb-2">{'★'.repeat(form.rating)}</div>
              <div className="text-sm font-semibold text-white">{form.name || 'Client Name'}</div>
              <div className="text-[0.7rem] text-white/40">
                {form.role || 'Role'}{form.company ? `, ${form.company}` : ''}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
