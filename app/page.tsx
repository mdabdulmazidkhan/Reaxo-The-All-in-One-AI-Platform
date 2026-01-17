"use client"

import { useState, useEffect } from "react"
import LandingPage from "@/components/landing-page"
import Dashboard from "@/components/dashboard"
import AuthModal from "@/components/auth-modal"
import ProfileModal from "@/components/profile-modal"
import { insforgeClient } from "@/lib/insforge-client"

interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<User | null>(null) // Declare profile variable

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem("insforge_token")
    if (storedToken) {
      fetchUser(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async (authToken: string) => {
    const { user, error } = await insforgeClient.getUser(authToken)
    if (user) {
      setUser(user)
      setToken(authToken)
      setProfile(user) // Set profile variable
    } else {
      localStorage.removeItem("insforge_token")
    }
    setIsLoading(false)
  }

  const handleLogout = () => {
    if (isGuestMode) {
      setIsGuestMode(false)
      return
    }
    localStorage.removeItem("insforge_token")
    setUser(null)
    setToken(null)
    setProfile(null) // Reset profile variable
  }

  const handleAuthSuccess = (authToken: string) => {
    setShowAuthModal(false)
    setIsGuestMode(false)
    fetchUser(authToken)
  }

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser)
    setProfile(updatedUser) // Update profile variable
  }

  const handleTryFirst = () => {
    setShowAuthModal(false)
    setIsGuestMode(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 animate-pulse">
          <img src="/images/reaxo-logo.webp" alt="Loading" className="w-full h-full object-contain" />
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <>
        <Dashboard
          user={{
            name: user.full_name || user.email.split("@")[0],
            email: user.email,
            avatar: user.avatar_url || "/images/default-avatar.webp",
          }}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
        />
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={{
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            avatar_url: user.avatar_url,
          }}
          token={token}
          onUpdate={handleProfileUpdate}
        />
      </>
    )
  }

  if (isGuestMode) {
    return (
      <Dashboard
        user={{
          name: "Guest",
          email: "guest@reaxo.ai",
          avatar: "/images/default-avatar.webp",
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
