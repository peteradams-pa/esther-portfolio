'use client'
// src/app/admin/projects/new/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'COMMERCIAL',   label: 'Commercial Solar' },
  { value: 'RESIDENTIAL',  label: 'Residential Solar' },
  { value: 'INDUSTRIAL',   label: 'Industrial Systems' },
  { value: 'OFF_GRID',     label: 'Off-Grid Systems' },
  { value: 'HYBRID',       label: 'Hybrid Systems' },
  { value: 'ENERGY_AUDIT', label: 'Energy Audits' },
]

interface Metric { value: string; label: string }

export default function NewProjectPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', category: 'COMMERCIAL', location: '', capacity: '',
    clientType: '', role: '', completionDate: '',
    description: '', challenge: '', solution: '',
    featured: false, published: false,
    roi: '', paybackPeriod: '', annualSavings: '', co2Avoided: '',
  })
  const [technologies, setTechnologies] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([''])
  const [metrics, setMetrics] = useState<Metric[]>([{ value: '', label: '' }])

  const update = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }))

  const handleSave = async (publish = false) => {
    setSaving(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          published: publish,
          technologies: technologies.filter(Boolean),
          tags: tags.filter(Boolean),
          metrics: metrics.filter((m) => m.value && m.label),
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success(publish ? 'Project published!' : 'Project saved as draft')
      router.push('/admin/projects')
    } catch {
      toast.error('Failed to save project')
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
        <Link href="/admin/projects" className="p-2 text-sol-steel hover:text-sol-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-sol-ink">New Project</h1>
          <p className="text-sol-steel text-sm">Add a solar project case study</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 border border-sol-smoke rounded-lg text-sm font-semibold text-sol-steel hover:border-sol-sky hover:text-sol-sky transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            <Save size={14} /> {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="xl:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="surface-card p-6">
            <h2 className="font-semibold text-sol-ink mb-4 pb-3 border-b border-sol-fog">Basic Information</h2>
            <div className="space-y-4">
              <Field label="Project Title *">
                <input className="form-input" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Mombasa Port Solar Installation" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category *">
                  <select className="form-select" value={form.category} onChange={(e) => update('category', e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </Field>
                <Field label="Capacity *">
                  <input className="form-input" value={form.capacity} onChange={(e) => update('capacity', e.target.value)} placeholder="e.g. 500 kWp" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Location *">
                  <input className="form-input" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Westlands, Nairobi" />
                </Field>
                <Field label="Completion Date *">
                  <input className="form-input" type="month" value={form.completionDate} onChange={(e) => update('completionDate', e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Client Type">
                  <input className="form-input" value={form.clientType} onChange={(e) => update('clientType', e.target.value)} placeholder="e.g. Manufacturing Company" />
                </Field>
                <Field label="Your Role">
                  <input className="form-input" value={form.role} onChange={(e) => update('role', e.target.value)} placeholder="e.g. Lead Technical Sales Manager" />
                </Field>
              </div>
            </div>
          </div>

          {/* Narrative */}
          <div className="surface-card p-6">
            <h2 className="font-semibold text-sol-ink mb-4 pb-3 border-b border-sol-fog">Project Narrative</h2>
            <div className="space-y-4">
              <Field label="Project Description *">
                <textarea className="form-textarea" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Brief overview of the project and its significance…" />
              </Field>
              <Field label="The Challenge">
                <textarea className="form-textarea" value={form.challenge} onChange={(e) => update('challenge', e.target.value)} placeholder="What problem or energy challenge did the client face?" />
              </Field>
              <Field label="The Solution">
                <textarea className="form-textarea" value={form.solution} onChange={(e) => update('solution', e.target.value)} placeholder="How did you design and deliver the solution?" />
              </Field>
            </div>
          </div>

          {/* Technologies */}
          <div className="surface-card p-6">
            <h2 className="font-semibold text-sol-ink mb-4 pb-3 border-b border-sol-fog">Technologies Used</h2>
            <div className="space-y-2">
              {technologies.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="form-input flex-1"
                    value={t}
                    onChange={(e) => {
                      const arr = [...technologies]; arr[i] = e.target.value; setTechnologies(arr)
                    }}
                    placeholder="e.g. SMA Sunny Tripower Inverters"
                  />
                  <button onClick={() => setTechnologies(technologies.filter((_, j) => j !== i))} className="p-2 text-sol-steel hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={() => setTechnologies([...technologies, ''])} className="text-[0.78rem] text-sol-sky hover:underline flex items-center gap-1 mt-1">
                <Plus size={12} /> Add Technology
              </button>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="surface-card p-6">
            <h2 className="font-semibold text-sol-ink mb-4 pb-3 border-b border-sol-fog">Impact Metrics</h2>
            <div className="space-y-3">
              {metrics.map((m, i) => (
                <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
                  <input
                    className="form-input"
                    value={m.value}
                    onChange={(e) => {
                      const arr = [...metrics]; arr[i] = { ...arr[i], value: e.target.value }; setMetrics(arr)
                    }}
                    placeholder="70%"
                  />
                  <input
                    className="form-input"
                    value={m.label}
                    onChange={(e) => {
                      const arr = [...metrics]; arr[i] = { ...arr[i], label: e.target.value }; setMetrics(arr)
                    }}
                    placeholder="Grid Independence"
                  />
                  <button onClick={() => setMetrics(metrics.filter((_, j) => j !== i))} className="p-2 text-sol-steel hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={() => setMetrics([...metrics, { value: '', label: '' }])} className="text-[0.78rem] text-sol-sky hover:underline flex items-center gap-1">
                <Plus size={12} /> Add Metric
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish settings */}
          <div className="surface-card p-5">
            <h2 className="font-semibold text-sol-ink mb-4 pb-3 border-b border-sol-fog text-sm">Publish Settings</h2>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="w-4 h-4 accent-sol-sky" />
              <span className="text-sm text-sol-ink font-medium">Published (visible on site)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="w-4 h-4 accent-sol-amber" />
              <span className="text-sm text-sol-ink font-medium">Featured (show on homepage)</span>
            </label>
          </div>

          {/* Financial metrics */}
          <div className="surface-card p-5">
            <h2 className="font-semibold text-sol-ink mb-4 pb-3 border-b border-sol-fog text-sm">Financial Details</h2>
            <div className="space-y-3">
              {[
                { label: 'ROI', field: 'roi', placeholder: 'e.g. 340%' },
                { label: 'Payback Period', field: 'paybackPeriod', placeholder: 'e.g. 4.2 years' },
                { label: 'Annual Savings', field: 'annualSavings', placeholder: 'e.g. KES 8.4M' },
                { label: 'CO₂ Avoided', field: 'co2Avoided', placeholder: 'e.g. 420 tonnes/yr' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="form-label text-[0.65rem]">{label}</label>
                  <input
                    className="form-input !py-2 text-sm"
                    value={(form as any)[field]}
                    onChange={(e) => update(field, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="surface-card p-5">
            <h2 className="font-semibold text-sol-ink mb-4 pb-3 border-b border-sol-fog text-sm">Tags</h2>
            <div className="space-y-2">
              {tags.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="form-input !py-2 text-sm flex-1"
                    value={t}
                    onChange={(e) => {
                      const arr = [...tags]; arr[i] = e.target.value; setTags(arr)
                    }}
                    placeholder="e.g. Nairobi"
                  />
                  <button onClick={() => setTags(tags.filter((_, j) => j !== i))} className="p-1.5 text-sol-steel hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button onClick={() => setTags([...tags, ''])} className="text-[0.72rem] text-sol-sky hover:underline flex items-center gap-1">
                <Plus size={11} /> Add Tag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
