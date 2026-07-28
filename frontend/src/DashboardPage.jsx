import { useCallback, useEffect, useState } from 'react'

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

export default function DashboardPage({ onLogout }) {
  const [profile, setProfile] = useState(null)
  const [notes, setNotes] = useState([])
  const [noteForm, setNoteForm] = useState(EMPTY_NOTE)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  const loadNotes = useCallback(async () => {
    const response = await fetch('/api/notes', {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Unable to load notes')
    }

    const noteData = await readJson(response)
    setNotes(Array.isArray(noteData) ? noteData : [])
  }, [])

  const bootstrap = useCallback(async () => {
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
      await loadNotes()
    } catch (error) {
      setProfile(null)
      setNotes([])
      setFeedback({
        type: 'error',
        text: error.message || 'Please log in again.',
      })
      if (onLogout) {
        onLogout()
      }
    } finally {
      setLoading(false)
    }
  }, [loadNotes, onLogout])

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  async function handleSubmitNote(event) {
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
      setFeedback({
        type: 'success',
        text: data.message || (editingNoteId ? 'Note updated successfully' : 'Note created successfully'),
      })
    } catch (error) {
      setFeedback({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(noteId) {
    setBusy(true)
    setFeedback({ type: '', text: '' })

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

  function startEdit(note) {
    setEditingNoteId(note._id)
    setNoteForm({
      title: note.title,
      description: note.description,
    })
  }

  function cancelEdit() {
    setEditingNoteId(null)
    setNoteForm(EMPTY_NOTE)
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // ignore logout errors and just move on
    } finally {
      if (onLogout) {
        onLogout()
      }
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.35),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold">
                {profile ? `Welcome back, ${profile.username}` : 'Your notes workspace'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                Create, update, and organize your notes in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Logout
            </button>
          </div>
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

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
              {editingNoteId ? 'Update note' : 'Create note'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              {editingNoteId ? 'Edit your note' : 'Add a new note'}
            </h2>

            <form className="mt-6 space-y-4" onSubmit={handleSubmitNote}>
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span>Title</span>
                <input
                  value={noteForm.title}
                  onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value })}
                  className="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  placeholder="Draft idea"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span>Description</span>
                <textarea
                  value={noteForm.description}
                  onChange={(event) => setNoteForm({ ...noteForm, description: event.target.value })}
                  className="min-h-[140px] rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  placeholder="Write your note here..."
                  required
                />
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy ? 'Saving...' : editingNoteId ? 'Update note' : 'Create note'}
                </button>

                {editingNoteId ? (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Your notes</p>
                <h2 className="mt-2 text-2xl font-semibold">Recent notes</h2>
              </div>

              <button
                type="button"
                onClick={() => void loadNotes()}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
                Loading notes...
              </div>
            ) : notes.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
                No notes yet. Create your first one.
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {notes.map((note) => (
                  <article
                    key={note._id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white">{note.title}</h3>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">
                          {note.description}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(note)}
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
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
