import { useState } from 'react'
import { API_BASE_URL } from '../config'

export default function RegisterPage({ onSwitchToLogin, onRegisterSuccess }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback({ type: '', text: '' })

    if (form.password !== form.confirmPassword) {
      setFeedback({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setLoading(true)

    try {
      // 1. Register the new user (Using API_BASE_URL here)
      const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
        credentials: 'include',
      })

      const registerData = await registerResponse.json().catch(() => ({}))

      if (!registerResponse.ok) {
        throw new Error(registerData.message || registerData.error || 'Registration failed')
      }

      setFeedback({
        type: 'success',
        text: 'Account created successfully! Redirecting to login...',
      })

      setForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      })

      if (onSwitchToLogin) {
        setTimeout(() => {
          onSwitchToLogin()
        }, 1200)
      }
    } catch (error) {
      setFeedback({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.35),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-white/10 bg-slate-950/40 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Note App</p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Create your account
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Sign up to start saving your notes securely.
              </p>

              <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                <p className="font-medium">Why sign up?</p>
                <ul className="mt-3 space-y-2 text-cyan-200">
                  <li>• Save notes privately to your account</li>
                  <li>• Access your notes from anywhere</li>
                  <li>• Enjoy a seamless note-taking experience</li>
                </ul>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Register</p>
                  <h2 className="mt-2 text-2xl font-semibold">Join today</h2>
                </div>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Back to login
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
                  <span>Username</span>
                  <input
                    value={form.username}
                    onChange={(event) =>
                      setForm({ ...form, username: event.target.value })
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    placeholder="alex"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    placeholder="alex@example.com"
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
                    placeholder="Create a secure password"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Confirm Password</span>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setForm({ ...form, confirmPassword: event.target.value })
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    placeholder="Re-enter password"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}