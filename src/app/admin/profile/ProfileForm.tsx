'use client'
// src/app/admin/profile/ProfileForm.tsx
import { useState } from 'react'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  profile: any
}

export default function ProfileForm({ profile }: Props) {
  const [form, setForm] = useState({
    name:             profile?.name             || '',
    title:            profile?.title            || '',
    tagline:          profile?.tagline          || '',
    bio:              profile?.bio              || '',
    bioShort:         profile?.bioShort         || '',
    email:            profile?.email            || '',
    phone:            profile?.phone            || '',
    whatsapp:         profile?.whatsapp         || '',
    location:         profile?.location         || '',
    linkedinUrl:      profile?.linkedinUrl      || '',
    twitterUrl:       profile?.twitterUrl       || '',
    statsMwDeployed:  profile?.statsMwDeployed  || 0,
    statsProjects:    profile?.statsProjects    || 0,
    statsClients:     profile?.statsClients     || 0,
    statsYears:       profile?.statsYears       || 0,
    metaTitle:        profile?.metaTitle        || '',
    metaDescription:  profile?.metaDescription  || '',
    metaKeywords:     profile?.metaKeywords     || '',
  })

  const [saving, setSaving] = useState(false)

  const update = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success('Profile saved successfully!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="surface-card p-6 mb-5">
      <h2 className="font-semibold text-sol-ink text-sm mb-4 pb-3 border-b border-sol-fog">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  )

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <Section title="Personal Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name *">
            <input className="form-input" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </Field>
          <Field label="Professional Title *">
            <input className="form-input" value={form.title} onChange={(e) => update('title', e.target.value)} />
          </Field>
        </div>
        <Field label="Tagline">
          <input className="form-input" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} placeholder="Short memorable line about what you do" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input className="form-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className="form-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="WhatsApp Number (digits only)">
            <input className="form-input" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} placeholder="254700000000" />
          </Field>
          <Field label="Location">
            <input className="form-input" value={form.location} onChange={(e) => update('location', e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="LinkedIn URL">
            <input className="form-input" value={form.linkedinUrl} onChange={(e) => update('linkedinUrl', e.target.value)} />
          </Field>
          <Field label="Twitter / X URL">
            <input className="form-input" value={form.twitterUrl} onChange={(e) => update('twitterUrl', e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Bio & Content">
        <Field label="Full Bio">
          <textarea className="form-textarea min-h-[160px]" value={form.bio} onChange={(e) => update('bio', e.target.value)} />
        </Field>
        <Field label="Short Bio (for cards)">
          <textarea className="form-textarea min-h-[80px]" value={form.bioShort} onChange={(e) => update('bioShort', e.target.value)} />
        </Field>
      </Section>

      <Section title="Hero Statistics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'MW Deployed', field: 'statsMwDeployed', type: 'number', step: '0.1' },
            { label: 'Projects',    field: 'statsProjects',   type: 'number', step: '1' },
            { label: 'Clients',     field: 'statsClients',    type: 'number', step: '1' },
            { label: 'Years Exp.',  field: 'statsYears',      type: 'number', step: '1' },
          ].map(({ label, field, type, step }) => (
            <Field key={field} label={label}>
              <input
                className="form-input"
                type={type}
                step={step}
                value={(form as any)[field]}
                onChange={(e) => update(field, parseFloat(e.target.value))}
              />
            </Field>
          ))}
        </div>
      </Section>

      <Section title="SEO — Homepage">
        <Field label="Meta Title">
          <input className="form-input" value={form.metaTitle} onChange={(e) => update('metaTitle', e.target.value)} />
          <div className="text-[0.68rem] text-sol-steel mt-1">{form.metaTitle.length} / 60 characters recommended</div>
        </Field>
        <Field label="Meta Description">
          <textarea className="form-textarea min-h-[80px]" value={form.metaDescription} onChange={(e) => update('metaDescription', e.target.value)} />
          <div className="text-[0.68rem] text-sol-steel mt-1">{form.metaDescription.length} / 160 characters recommended</div>
        </Field>
        <Field label="Keywords (comma separated)">
          <input className="form-input" value={form.metaKeywords} onChange={(e) => update('metaKeywords', e.target.value)} />
        </Field>
      </Section>
    </div>
  )
}
