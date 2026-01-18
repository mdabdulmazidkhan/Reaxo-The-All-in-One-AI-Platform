'use client';

import type React from "react"
import { useState } from "react"
import { X, User, Sparkles, Mail, EyeOff, Eye, Loader2, Lock } from "lucide-react"
import { Button } from "./ui/button"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (name: string) => void
  onTryFirst?: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess, onTryFirst }: AuthModalProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !password.trim()) return
    setIsLoading(true)
    localStorage.setItem("reaxo_user_name", fullName)
    localStorage.setItem("reaxo_user_email", email)
    localStorage.setItem("reaxo_user_password", password)
    onSuccess(fullName)
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setIsLoading(true)
    // Simulate sign-in process
    if (email === "test@example.com" && password === "password") {
      onSuccess("Test User")
    } else {
      setError("Invalid email or password")
    }
    setIsLoading(false)
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !password.trim()) return
    setIsLoading(true)
    // Simulate sign-up process
    setMessage("Account created successfully")
    setIsLoading(false)
  }

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
  }

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode)
    setError(null)
    setMessage(null)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-600 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-8 pt-10 pb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/images/reaxo-logo.webp" alt="Reaxo" className="w-12 h-12" />
          </div>
          <h2 className="font-semibold text-xl text-white mb-2">Welcome to Reaxo</h2>
          <p className="text-sm text-zinc-500">Enter your name to start comparing AI models</p>
        </div>

        <form onSubmit={handleEnter} className="px-8 pb-10">
          <div className="relative mb-5">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 transition-all"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !fullName.trim()}
            className="w-full bg-white hover:bg-zinc-200 text-black rounded-xl py-3 text-sm font-medium transition-all"
          >
            {isLoading ? "Loading..." : "Enter"}
          </Button>

          {onTryFirst && (
            <Button
              type="button"
              onClick={onTryFirst}
              className="w-full mt-3 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/50 rounded-xl py-3 text-sm font-medium transition-all group"
            >
              <Sparkles className="w-4 h-4 mr-2 text-emerald-500 group-hover:text-emerald-400" />
              Try First Without Account
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
