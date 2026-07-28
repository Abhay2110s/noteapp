import { useEffect, useState } from 'react'
import WelcomePage from './WelcomePage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import DashboardPage from './DashboardPage'

export default function AppShell() {
  const [view, setView] = useState('loading')

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/profile', {
          credentials: 'include',
        })

        if (response.ok) {
          setView('dashboard')
        } else {
          setView('welcome')
        }
      } catch {
        setView('welcome')
      }
    }

    void checkAuth()
  }, [])

  if (view === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-lg">Loading your workspace...</p>
      </div>
    )
  }

  if (view === 'login') {
    return (
      <LoginPage
        onSwitchToRegister={() => setView('register')}
        onLoginSuccess={() => setView('dashboard')}
      />
    )
  }

  if (view === 'register') {
    return <RegisterPage onSwitchToLogin={() => setView('login')} />
  }

  if (view === 'dashboard') {
    return <DashboardPage onLogout={() => setView('welcome')} />
  }

  return (
    <WelcomePage
      onEnterLogin={() => setView('login')}
      onEnterRegister={() => setView('register')}
    />
  )
}
