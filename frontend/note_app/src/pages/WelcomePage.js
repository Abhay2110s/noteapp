export default function WelcomePage({ onEnterLogin, onEnterRegister }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.35),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-white/10 bg-slate-950/40 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Note App</p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Write, organize, and secure your ideas
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Start your journey with a clean, secure workspace. Create an account or
                sign in to manage your notes from anywhere.
              </p>

              <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                <p className="font-medium">What you can do</p>
                <ul className="mt-3 space-y-2 text-cyan-200">
                  <li>• Save notes privately to your account</li>
                  <li>• Access your workspace securely</li>
                  <li>• Keep everything synced with the backend</li>
                </ul>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Welcome</p>
              <h2 className="mt-2 text-2xl font-semibold">Let’s get started</h2>

              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={onEnterLogin}
                  className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Login to your account
                </button>

                <button
                  type="button"
                  onClick={onEnterRegister}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Create a new account
                </button>
              </div>

              <p className="mt-8 text-sm leading-7 text-slate-400">
                Choose login if you already have an account. Choose register if you are
                new here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}