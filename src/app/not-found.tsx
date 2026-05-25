// src/app/not-found.tsx
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sol-ink text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-hero-grid opacity-100 pointer-events-none" />
      <div className="relative text-center max-w-md">
        <div className="font-display text-[8rem] font-light text-sol-amber/20 leading-none mb-2">
          404
        </div>
        <h1 className="font-display text-3xl font-semibold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-white/50 leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home size={14} /> Go Home
          </Link>
          <Link href="/projects" className="btn-outline-white">
            View Projects
          </Link>
        </div>
      </div>
    </div>
  )
}
