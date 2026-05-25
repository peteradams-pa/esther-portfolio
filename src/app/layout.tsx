// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans, Space_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import AuthSessionProvider from '@/components/providers/SessionProvider'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://estherkiarie.com'),
  title: {
    default: 'Esther Watiri Kiarie | Solar Energy Technical Sales Manager | Nairobi, Kenya',
    template: '%s | Esther Watiri Kiarie',
  },
  description:
    'Technical Sales Manager with 9+ years leading solar energy solutions across East Africa. Commercial, industrial, and off-grid solar specialist. 4.8 MW deployed, 62+ projects completed.',
  keywords: [
    'solar energy Kenya',
    'commercial solar Nairobi',
    'renewable energy consultant Kenya',
    'solar sales manager East Africa',
    'off-grid solar systems Kenya',
    'energy audit Nairobi',
    'solar ROI Kenya',
    'industrial solar Kenya',
  ],
  authors: [{ name: 'Esther Watiri Kiarie', url: 'https://estherkiarie.com' }],
  creator: 'Esther Watiri Kiarie',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://estherkiarie.com',
    siteName: 'Esther Watiri Kiarie',
    title: 'Esther Watiri Kiarie | Solar Energy Technical Sales Manager',
    description:
      'Trusted solar energy expert. 9+ years delivering commercial, industrial, and off-grid solar solutions across East Africa.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Esther Watiri Kiarie — Solar Energy Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Esther Watiri Kiarie | Solar Energy Expert',
    description: '9+ years delivering solar energy solutions across East Africa.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B1F3A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="font-body bg-sol-ash text-sol-ink antialiased">
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0B1F3A',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#27AE60', secondary: '#fff' } },
            error: { iconTheme: { primary: '#E74C3C', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
