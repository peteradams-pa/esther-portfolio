'use client'
// src/app/contact/ContactForm.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { INQUIRY_TYPE_OPTIONS } from '@/lib/utils'

const schema = z.object({
  firstName:   z.string().min(1, 'First name is required'),
  lastName:    z.string().min(1, 'Last name is required'),
  email:       z.string().email('Enter a valid email address'),
  phone:       z.string().optional(),
  company:     z.string().optional(),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  message:     z.string().min(10, 'Message must be at least 10 characters'),
})

type FormValues = z.infer<typeof schema>

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSubmitted(true)
      reset()
    } catch {
      toast.error('Something went wrong. Please try again or WhatsApp directly.')
    }
  }

  if (submitted) {
    return (
      <div className="surface-card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
        <CheckCircle size={48} className="text-sol-leaf mb-4" />
        <h3 className="font-display text-2xl font-semibold text-sol-ink mb-2">Message Sent!</h3>
        <p className="text-sol-steel max-w-sm leading-relaxed">
          Thank you for reaching out. Esther will respond personally within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm text-sol-sky hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div className="surface-card p-8">
      <h2 className="font-display text-2xl font-semibold text-sol-ink mb-1">Send a Message</h2>
      <p className="text-sol-steel text-sm mb-6">Fill in the form and receive a personal response.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">First Name *</label>
            <input {...register('firstName')} className="form-input" placeholder="Jane" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="form-label">Last Name *</label>
            <input {...register('lastName')} className="form-input" placeholder="Doe" />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Email Address *</label>
          <input {...register('email')} type="email" className="form-input" placeholder="jane@company.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Phone / WhatsApp</label>
            <input {...register('phone')} className="form-input" placeholder="+254 700 000 000" />
          </div>
          <div>
            <label className="form-label">Company</label>
            <input {...register('company')} className="form-input" placeholder="Your Company Ltd" />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Inquiry Type *</label>
          <select {...register('inquiryType')} className="form-select">
            <option value="">Select inquiry type…</option>
            {INQUIRY_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.inquiryType && <p className="text-red-500 text-xs mt-1">{errors.inquiryType.message}</p>}
        </div>

        <div className="mb-6">
          <label className="form-label">Your Message *</label>
          <textarea
            {...register('message')}
            className="form-textarea"
            placeholder="Tell me about your project, energy challenge, or question…"
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-secondary w-full justify-center group disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Send Message
              <Send size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </form>
    </div>
  )
}
