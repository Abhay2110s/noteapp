export default function WelcomePage({ onEnterLogin, onEnterRegister }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.35),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl backdrop-blur lg:grid-cols-2">
          {/* Left Section */}
          <div className="relative flex flex-col justify-center overflow-hidden bg-slate-950/50 p-10 lg:p-14">
            {/* Decorative Blurs */}
            <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />

            <span className="relative w-fit rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Welcome
            </span>

            <h1 className="relative mt-6 text-5xl font-extrabold leading-tight">
              <span className="text-cyan-400">InkVault</span>
            </h1>

            <p className="relative mt-5 max-w-md text-base leading-8 text-slate-300">
              A beautiful space for your thoughts, ideas, and daily notes.
              Fast, secure, and always available whenever inspiration strikes.
            </p>

            <div className="relative mt-10 flex gap-4">
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 px-6 py-4">
                <p className="text-2xl font-bold text-cyan-400">100%</p>
                <p className="mt-1 text-sm text-slate-400">Private</p>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 px-6 py-4">
                <p className="text-2xl font-bold text-cyan-400">∞</p>
                <p className="mt-1 text-sm text-slate-400">Ideas</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-center p-10 lg:p-14">
            <h2 className="text-3xl font-bold">
              Start your journey
            </h2>

            <p className="mt-3 text-slate-400">
              Sign in to continue or create a new account in seconds.
            </p>

            <div className="mt-10 space-y-5">
              <button
                type="button"
                onClick={onEnterLogin}
                className="w-full rounded-2xl bg-cyan-500 py-3.5 text-base font-semibold text-slate-950 transition duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                Login
              </button>

              <button
                type="button"
                onClick={onEnterRegister}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 py-3.5 text-base font-semibold transition duration-300 hover:border-cyan-400 hover:bg-slate-900 hover:text-cyan-300"
              >
                Create Account
              </button>
            </div>

            <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
              Your thoughts deserve a secure home.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}