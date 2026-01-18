'use client';

import { useState, useEffect } from 'react'
import LandingPage from './components/landing-page'
import Dashboard from './components/dashboard'
import AuthModal from './components/auth-modal'

interface User {
  name: string
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false)

  useEffect(() => {
    const userName = localStorage.getItem('reaxo_user_name')
    if (userName) {
      setUser({ name: userName })
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    if (isGuestMode) {
      setIsGuestMode(false)
      return
    }
    localStorage.removeItem('reaxo_user_name')
    setUser(null)
  }

  const handleAuthSuccess = (name: string) => {
    setShowAuthModal(false)
    setIsGuestMode(false)
    setUser({ name })
  }

  const handleTryFirst = () => {
    setShowAuthModal(false)
    setIsGuestMode(true)
  }

  if (user) {
    return (
      <Dashboard
        user={{
          name: user.name,
          email: `${user.name}@reaxo.ai`,
          avatar: '/images/default-avatar.webp',
        }}
        onLogout={handleLogout}
        onOpenProfile={() => {}}
      />
    )
  }

  if (isGuestMode) {
    return (
      <Dashboard
        user={{
          name: 'Guest',
          email: 'guest@reaxo.ai',
          avatar: '/images/default-avatar.webp',
        }}
        onLogout={handleLogout}
        onOpenProfile={() => setShowAuthModal(true)}
        isGuest={true}
      />
    )
  }

  return (
    <>
      <LandingPage onLogin={() => setShowAuthModal(true)} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        onTryFirst={handleTryFirst}
      />
    </>
  )
}
