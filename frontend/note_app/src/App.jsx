import { useState } from 'react'
import WelcomePage from './WelcomePage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'

function App() {
  const [view, setView] = useState('welcome')

  if (view === 'login') {
    return (
      <LoginPage
        onSwitchToRegister={() => setView('register')}
        onLoginSuccess={() => setView('notes')}
      />
    )
  }

  if (view === 'register') {
    return (
      <RegisterPage
        onSwitchToLogin={() => setView('login')}
      />
    )
  }

  return (
    <WelcomePage
      onEnterLogin={() => setView('login')}
      onEnterRegister={() => setView('register')}
    />
  )
}

export default App