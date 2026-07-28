import { useEffect, useState } from 'react'

const EMPTY_NOTE = { title: '', description: '' }

async function readJson(response) {
  const text = await response.text()
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

function App() {
  const [authMode, setAuthMode] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    identifier: '',
  })
  const [noteForm, setNoteForm] = useState(EMPTY_NOTE)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  useEffect(() => {
    void bootstrap()
  }, [])

  async function bootstrap() {
    setLoading(true)
    try {
      const profileResponse = await fetch('/api/auth/profile', {
        credentials: 'include',
      })

      if (!profileResponse.ok) {
        throw new Error('Not authenticated')
      }

      const profileData = await readJson(profileResponse)
      setProfile(profileData)
      setIsAuthenticated(true)
      await loadNotes()
    } catch {
      setProfile(null)
      setIsAuthenticated(false)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  async function loadNotes() {
    const response = await fetch('/api/notes', {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Unable to load notes')
    }

    const noteData = await readJson(response)
    setNotes(Array.isArray(noteData) ? noteData : [])
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setFeedback({ type: '', text: '' })

    try {
      const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login'
      const payload =
        authMode === 'register'
          ? {
              username: authForm.username,
              email: authForm.email,
              password: authForm.password,
            }
          : {
              username: authForm.identifier,
              email: authForm.identifier,
              password: authForm.password,
            }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })

      const data = await readJson(response)

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Authentication failed')
      }

      if (authMode === 'login') {
        await bootstrap()
        setFeedback({ type: 'success', text: data.message || 'Logged in successfully' })
      } else {
        setAuthMode('login')
        setAuthForm({ username: '', email: '', password: '', identifier: '' })
        setFeedback({ type: 'success', text: data.message || 'Account created successfully' })
      }
    } catch (error) {
      setFeedback({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    setBusy(true)
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setProfile(null)
      setIsAuthenticated(false)
      setNotes([])
      setFeedback({ type: 'success', text: 'You have been logged out.' })
    } catch (error) {
      setFeedback({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function handleNoteSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setFeedback({ type: '', text: '' })

    try {
      const endpoint = editingNoteId ? `/api/notes/${editingNoteId}` : '/api/notes'
      const method = editingNoteId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteForm),
        credentials: 'include',
      })

      const data = await readJson(response)

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Unable to save note')
      }

      await loadNotes()
      setNoteForm(EMPTY_NOTE)
      setEditingNoteId(null)
      setFeedback({ type: 'success', text: data.message || 'Note saved' })
    } catch (error) {
      setFeedback({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(noteId) {
    setBusy(true)
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await readJson(response)
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Unable to delete note')
      }

      await loadNotes()
      setFeedback({ type: 'success', text: data.message || 'Note deleted' })
    } catch (error) {
      setFeedback({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.35),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Note App</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Your notes, secured by the backend</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              Register, log in, and manage your notes with the same cookie-authenticated JSON API that the backend exposes.
            </p>
          </div>
          {isAuthenticated && profile ? (
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
              <p className="font-medium">Signed in as {profile.username}</p>
              <p className="mt-1 text-cyan-200">{profile.email}</p>
            </div>
          ) : null}
        </header>

        {feedback.text ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === 'error'
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
            }`}
          >
            {feedback.text}
          </div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-16 text-slate-300">
            Loading your workspace...
          </div>
        ) : !isAuthenticated ? (
          <AuthPanel
            authMode={authMode}
            setAuthMode={setAuthMode}
            authForm={authForm}
            setAuthForm={setAuthForm}
            onSubmit={handleAuthSubmit}
            busy={busy}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Notes</p>
                  <h2 className="mt-2 text-2xl font-semibold">Your collection</h2>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Logout
                </button>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleNoteSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    <span>Title</span>
                    <input
                      value={noteForm.title}
                      onChange={(event) =>
                        setNoteForm({ ...noteForm, title: event.target.value })
                      }
                      className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-cyan-400"
                      placeholder="Draft idea"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    <span>Description</span>
                    <textarea
                      value={noteForm.description}
                      onChange={(event) =>
                        setNoteForm({ ...noteForm, description: event.target.value })
                      }
                      className="min-h-[112px] rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                      placeholder="Capture the details"
                      required
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    {editingNoteId ? 'Update note' : 'Create note'}
                  </button>
                  {editingNoteId ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNoteId(null)
                        setNoteForm(EMPTY_NOTE)
                      }}
                      className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="mt-8 space-y-4">
                {notes.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
                    No notes yet. Add one to get started.
                  </div>
                ) : (
                  notes.map((note) => (
                    <article
                      key={note._id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{note.title}</h3>
                          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">
                            {note.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoteId(note._id)
                              setNoteForm({ title: note.title, description: note.description })
                            }}
                            className="rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(note._id)}
                            className="rounded-full border border-rose-500/30 px-3 py-1.5 text-sm text-rose-200 transition hover:border-rose-400 hover:text-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Backend alignment</p>
              <h2 className="mt-2 text-2xl font-semibold">What this frontend uses</h2>
              <ul className="mt-6 space-y-4 text-sm text-slate-300">
                <li className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="font-semibold text-white">Auth routes</p>
                  <p className="mt-2">Registers users, logs them in with a cookie-based JWT, and loads profile data.</p>
                </li>
                <li className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="font-semibold text-white">Notes routes</p>
                  <p className="mt-2">Fetches, creates, updates, and deletes notes tied to the current authenticated user.</p>
                </li>
                <li className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="font-semibold text-white">Tailwind styling</p>
                  <p className="mt-2">A polished card-based experience with responsive layout and modern spacing.</p>
                </li>
              </ul>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

function AuthPanel({ authMode, setAuthMode, authForm, setAuthForm, onSubmit, busy }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Welcome</p>
        <h2 className="mt-3 text-3xl font-semibold">Create an account or jump back in</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          The frontend uses the backend’s JSON API for registration and login, and it preserves the JWT securely in an HTTP-only cookie.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex rounded-full border border-slate-800 bg-slate-950/70 p-1">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              authMode === 'login' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              authMode === 'register' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            Register
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {authMode === 'register' ? (
            <>
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span>Username</span>
                <input
                  value={authForm.username}
                  onChange={(event) => setAuthForm({ ...authForm, username: event.target.value })}
                  className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  placeholder="Alex"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span>Email</span>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                  className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  placeholder="alex@example.com"
                  required
                />
              </label>
            </>
          ) : (
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              <span>Username or email</span>
              <input
                value={authForm.identifier}
                onChange={(event) => setAuthForm({ ...authForm, identifier: event.target.value })}
                className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                placeholder="alex or alex@example.com"
                required
              />
            </label>
          )}

          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Password</span>
            <input
              type="password"
              value={authForm.password}
              onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder={authMode === 'login' ? '••••••••' : 'Create a secure password'}
              required
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default App
