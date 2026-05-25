'use client'
// src/app/admin/blog/new/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'COMMERCIAL_SOLAR', label: 'Commercial Solar' },
  { value: 'BATTERY_STORAGE',  label: 'Battery Storage' },
  { value: 'ENERGY_FINANCE',   label: 'Energy Finance' },
  { value: 'OFF_GRID',         label: 'Off-Grid Systems' },
  { value: 'POLICY_MARKET',    label: 'Policy & Market' },
  { value: 'INDUSTRIAL_SOLAR', label: 'Industrial Solar' },
  { value: 'SUSTAINABILITY',   label: 'Sustainability' },
]

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title:          '',
    excerpt:        '',
    content:        '',
    category:       'COMMERCIAL_SOLAR',
    readTime:       5,
    featured:       false,
    published:      false,
    metaTitle:      '',
    metaDescription:'',
  })
  const [tags, setTags] = useState<string[]>([''])

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSave = async (publish = false) => {
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          published: publish,
          publishedAt: publish ? new Date().toISOString() : null,
          tags: tags.filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success(publish ? 'Article published!' : 'Saved as draft')
      router.push('/admin/blog')
    } catch {
      toast.error('Failed to save article')
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {hint && <p className="text-[0.68rem] text-sol-steel mt-1">{hint}</p>}
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="p-2 text-sol-steel hover:text-sol-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-sol-ink">New Article</h1>
          <p className="text-sol-steel text-sm">Write a solar energy insight</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 border border-sol-smoke rounded-lg text-sm font-semibold text-sol-steel
                       hover:border-sol-sky hover:text-sol-sky transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main */}
        <div className="xl:col-span-2 space-y-5">
          <div className="surface-card p-6">
            <h2 className="font-semibold text-sol-ink text-sm mb-4 pb-3 border-b border-sol-fog">
              Article Content
            </h2>
            <div className="space-y-4">
              <Field label="Title *">
                <input
                  className="form-input text-lg"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Why Every Kenya Business Should Go Solar in 2025"
                />
              </Field>
              <Field label="Excerpt / Subtitle">
                <textarea
                  className="form-textarea"
                  value={form.excerpt}
                  onChange={(e) => update('excerpt', e.target.value)}
                  placeholder="A short compelling summary shown in listings and meta descriptions…"
                />
              </Field>
              <Field
                label="Article Content (HTML supported)"
                hint="Write your full article here. You can use HTML tags like <h2>, <p>, <ul>, <strong>, <blockquote> etc."
              >
                <textarea
                  className="form-textarea font-mono text-sm"
                  style={{ minHeight: '400px' }}
                  value={form.content}
                  onChange={(e) => update('content', e.target.value)}
                  placeholder="<p>Start writing your article here...</p>"
                />
              </Field>
            </div>
          </div>

          {/* SEO */}
          <div className="surface-card p-6">
            <h2 className="font-semibold text-sol-ink text-sm mb-4 pb-3 border-b border-sol-fog">
              SEO Settings
            </h2>
            <div className="space-y-4">
              <Field
                label="Meta Title"
                hint={`${form.metaTitle.length}/60 characters — leave blank to use article title`}
              >
                <input
                  className="form-input"
                  value={form.metaTitle}
                  onChange={(e) => update('metaTitle', e.target.value)}
                  placeholder="Leave blank to auto-use article title"
                />
              </Field>
              <Field
                label="Meta Description"
                hint={`${form.metaDescription.length}/160 characters — leave blank to use excerpt`}
              >
                <textarea
                  className="form-textarea"
                  value={form.metaDescription}
                  onChange={(e) => update('metaDescription', e.target.value)}
                  placeholder="Leave blank to auto-use excerpt"
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish */}
          <div className="surface-card p-5">
            <h2 className="font-semibold text-sol-ink text-sm mb-4 pb-3 border-b border-sol-fog">
              Settings
            </h2>
            <div className="space-y-3">
              <Field label="Category *">
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Estimated Read Time (minutes)">
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={60}
                  value={form.readTime}
                  onChange={(e) => update('readTime', parseInt(e.target.value))}
                />
              </Field>
              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => update('featured', e.target.checked)}
                  className="w-4 h-4 accent-sol-amber"
                />
                <span className="text-sm text-sol-ink font-medium">
                  Featured article (shown prominently)
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="surface-card p-5">
            <h2 className="font-semibold text-sol-ink text-sm mb-4 pb-3 border-b border-sol-fog">
              Tags
            </h2>
            <div className="space-y-2">
              {tags.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="form-input !py-2 text-sm flex-1"
                    value={t}
                    onChange={(e) => {
                      const arr = [...tags]
                      arr[i] = e.target.value
                      setTags(arr)
                    }}
                    placeholder="e.g. Commercial Solar"
                  />
                  <button
                    onClick={() => setTags(tags.filter((_, j) => j !== i))}
                    className="p-1.5 text-sol-steel hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setTags([...tags, ''])}
                className="text-[0.72rem] text-sol-sky hover:underline flex items-center gap-1"
              >
                <Plus size={11} /> Add Tag
              </button>
            </div>
          </div>

          {/* Preview tip */}
          <div className="surface-card p-5 bg-sol-ash border-sol-fog">
            <div className="text-[0.72rem] font-semibold text-sol-steel uppercase tracking-wide mb-2">
              💡 Writing Tips
            </div>
            <ul className="text-[0.72rem] text-sol-steel space-y-1.5 leading-relaxed">
              <li>• Use {'<h2>'} and {'<h3>'} for section headings</li>
              <li>• Wrap paragraphs in {'<p>'} tags</li>
              <li>• Use {'<strong>'} for key terms</li>
              <li>• Add {'<ul><li>'} for bullet lists</li>
              <li>• Use {'<blockquote>'} for callouts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
