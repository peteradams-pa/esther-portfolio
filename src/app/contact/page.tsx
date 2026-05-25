// src/app/contact/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactForm from './ContactForm'
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact — Start Your Solar Project',
  description: "Get in touch with Esther Watiri Kiarie for solar project consultation, energy audits, or partnership enquiries.",
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] bg-white">
        {/* Header */}
        <section className="bg-sol-ink text-white py-16 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-sol-amber mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-sol-amber" /> Let's Connect
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-3">
              Start Your Energy <strong className="font-semibold">Transformation</strong>
            </h1>
            <p className="text-white/55 max-w-lg leading-relaxed">
              Whether you have a project in mind, want an energy audit, or need strategic solar advice — let's talk.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">

              {/* Info card */}
              <div className="bg-sol-deep text-white rounded-2xl p-8">
                <h2 className="font-display text-2xl font-semibold mb-2">Get In Touch</h2>
                <p className="text-white/55 text-sm leading-relaxed mb-8">
                  I respond to all enquiries within 24 hours. For urgent project needs, WhatsApp is fastest.
                </p>

                <div className="space-y-5">
                  {[
                    { icon: <Mail size={16} />, label: 'Email', value: 'esther@estherkiarie.com', href: 'mailto:esther@estherkiarie.com' },
                    { icon: <Phone size={16} />, label: 'Phone / WhatsApp', value: '+254 700 000 000', href: 'tel:+254700000000' },
                    { icon: <MapPin size={16} />, label: 'Location', value: 'Nairobi, Kenya · Available Regionally', href: undefined },
                    { icon: <Linkedin size={16} />, label: 'LinkedIn', value: 'linkedin.com/in/estherkiarie', href: 'https://linkedin.com/in/estherkiarie' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 pb-5 border-b border-white/8 last:border-0">
                      <div className="w-10 h-10 rounded-xl bg-sol-amber/12 flex items-center justify-center text-sol-amber flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-[0.68rem] tracking-widest uppercase text-white/35 mb-0.5">{item.label}</div>
                        {item.href ? (
                          <a href={item.href} className="text-sm text-white font-medium hover:text-sol-amber transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <div className="text-sm text-white font-medium">{item.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}?text=Hi%20Esther%2C%20I%E2%80%99d%20like%20to%20discuss%20a%20solar%20project`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp mt-6"
                >
                  💬 Chat on WhatsApp
                </a>

                {/* Response time badge */}
                <div className="mt-5 flex items-center gap-2 text-[0.72rem] text-white/35">
                  <span className="w-2 h-2 rounded-full bg-sol-mint animate-pulse-slow" />
                  Typically responds within 24 hours
                </div>
              </div>

              {/* Form */}
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
