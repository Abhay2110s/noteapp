import { useState } from 'react'
import WelcomePage from './pages/WelcomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

function App() {
  const [view, setView] = useState('welcome')

  if (view === 'login') {
    return (
      <LoginPage
        onSwitchToRegister={() => setView('register')}
        onLoginSuccess={() => setView('dashboard')}
      />
    )
  }

  if (view === 'register') {
    return (
      <RegisterPage
        onSwitchToLogin={() => setView('login')}
        onRegisterSuccess={() => setView('dashboard')}
      />
    )
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

export default App