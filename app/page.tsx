"use client"

import { useState, useEffect } from "react"
import LandingPage from "@/components/landing-page"
import Dashboard from "@/components/dashboard"
import AuthModal from "@/components/auth-modal"
import ProfileModal from "@/components/profile-modal"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false) // Added guest mode state

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      }
      setIsLoading(false)
    }

    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
        setIsGuestMode(false) // Exit guest mode when user logs in
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (!error && data) {
      setProfile(data)
    }
  }

  const handleLogout = async () => {
    if (isGuestMode) {
      setIsGuestMode(false)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const handleAuthSuccess = async () => {
    setShowAuthModal(false)
    setIsGuestMode(false) // Exit guest mode on successful auth
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) {
      setUser(session.user)
      await fetchProfile(session.user.id)
    }
  }

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile)
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

  if (user && profile) {
    return (
      <>
        <Dashboard
          user={{
            name: profile.full_name || profile.email.split("@")[0],
            email: profile.email,
            avatar: profile.avatar_url || "/images/default-avatar.webp",
          }}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
        />
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={profile}
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
        onOpenProfile={() => setShowAuthModal(true)} // Open auth modal instead of profile for guests
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
        onTryFirst={handleTryFirst} // Pass try first handler
      />
    </>
  )
}
