'use client'
// src/app/admin/login/page.tsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Sun, Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-sol-ink flex items-center justify-center px-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-hero-grid opacity-100 pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sun size={24} className="text-sol-amber" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-white">
            Esther <span className="text-sol-amber">Kiarie</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={14} className="text-sol-amber" />
            <span className="text-[0.72rem] tracking-widest uppercase text-white/40 font-semibold">
              Secure Sign In
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-lg text-white text-sm
                           placeholder-white/25 outline-none transition-all
                           focus:border-sol-amber/50 focus:ring-2 focus:ring-sol-amber/10"
                placeholder="esther@estherkiarie.com"
              />
            </div>

            <div className="mb-5">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 bg-white/6 border border-white/12 rounded-lg text-white text-sm
                             placeholder-white/25 outline-none transition-all
                             focus:border-sol-amber/50 focus:ring-2 focus:ring-sol-amber/10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sol-amber text-sol-ink font-bold text-sm rounded-lg
                         transition-all hover:bg-sol-gold disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-sol-ink/30 border-t-sol-ink rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Secured with NextAuth · JWT Sessions
        </p>
      </div>
    </div>
  )
}
