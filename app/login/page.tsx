'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email, password, redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      try {
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()
        if (session?.user?.role === 'admin' || session?.role === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/dashboard'
        }
      } catch (err) {
        window.location.href = '/dashboard'
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Back to Website Link */}
      <div className="absolute top-8 left-8">
        <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Website
        </a>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/images/riznex-logo.jpg" alt="Riznex Digital Solutions" className="w-24 h-24 rounded-2xl object-contain bg-white shadow-2xl shadow-blue-500/10 p-2" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide uppercase">Riznex</h1>
          <p className="text-blue-400 text-sm mt-1 font-semibold tracking-widest">DIGITAL SOLUTIONS</p>
        </div>

        {/* Card */}
        <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Username</label>
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#161b2c] border border-[#1f2947] text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-[#161b2c] border border-[#1f2947] text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-blue-500/25 hover:opacity-90 disabled:opacity-50 transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1f2947]">
            <p className="text-xs text-slate-500 text-center">
              Powered by <span className="text-blue-400 font-semibold">Riznex</span> · Secure local authentication
            </p>
          </div>
        </div>

        
      </div>
    </div>
  )
}
