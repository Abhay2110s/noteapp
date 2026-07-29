import { useState } from 'react'
import { API_BASE_URL } from '../config'

export default function LoginPage({ onSwitchToRegister, onLoginSuccess }) {
  const [form, setForm] = useState({
    identifier: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback({ type: '', text: '' })
    setLoading(true)

    try {
      const response = await Promise.race([
        fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.identifier,
            email: form.identifier,
            password: form.password,
          }),
          credentials: 'include',
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out. Please try again.')), 15000))
      ])

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed')
      }

      setFeedback({
        type: 'success',
        text: data.message || 'Logged in successfully.',
      })

      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (error) {
      setFeedback({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,116,144,0.35),transparent_40%),linear-gradient(135deg,#020617_0%,#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-white/10 bg-slate-950/40 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Note App</p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Log in to view and manage your notes securely. This page uses the backend’s
                cookie-based authentication flow.
              </p>

              <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                <p className="font-medium">Secure access</p>
                <ul className="mt-3 space-y-2 text-cyan-200">
                  <li>• Use your username or email</li>
                  <li>• Keep your notes protected behind JWT auth</li>
                  <li>• Stay signed in with an HTTP-only cookie</li>
                </ul>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Login</p>
                  <h2 className="mt-2 text-2xl font-semibold">Access your workspace</h2>
                </div>
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Create account
                </button>
              </div>

              {feedback.text ? (
                <div
                  className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                    feedback.type === 'error'
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  }`}
                >
                  {feedback.text}
                </div>
              ) : null}

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Username or email</span>
                  <input
                    value={form.identifier}
                    onChange={(event) =>
                      setForm({ ...form, identifier: event.target.value })
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    placeholder="alex or alex@example.com"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Password</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) =>
                      setForm({ ...form, password: event.target.value })
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    placeholder="Enter your password"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}