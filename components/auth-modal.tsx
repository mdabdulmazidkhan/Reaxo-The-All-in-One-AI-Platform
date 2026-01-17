"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { X, Mail, Lock, User, Loader2, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onTryFirst?: () => void // Added onTryFirst callback for guest mode
}

type AuthMode = "signin" | "signup" | "forgot"

export default function AuthModal({ isOpen, onClose, onSuccess, onTryFirst }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = getSupabaseBrowserClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      onSuccess()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      setMessage("Check your email to confirm your account!")
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Check your email for the password reset link!")
    }
    setIsLoading(false)
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFullName("")
    setError(null)
    setMessage(null)
  }

  const switchMode = (newMode: AuthMode) => {
    resetForm()
    setMode(newMode)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-600 hover:text-white transition-colors z-10 rounded-full hover:bg-zinc-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/images/reaxo-logo.webp" alt="Reaxo" width={48} height={48} className="w-12 h-12" />
          </div>
          <h2 className="font-semibold text-xl text-white mb-1">
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset password"}
          </h2>
          <p className="text-sm text-zinc-500">
            {mode === "signin" && "Sign in to continue"}
            {mode === "signup" && "Start comparing AI models"}
            {mode === "forgot" && "We'll email you a reset link"}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-10">
          {message ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Mail className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="text-emerald-400 text-sm mb-6">{message}</p>
              <Button
                onClick={() => switchMode("signin")}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl py-2.5 text-sm"
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={mode === "signin" ? handleSignIn : mode === "signup" ? handleSignUp : handleForgotPassword}>
              {mode === "forgot" && (
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white mb-5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}

              {error && (
                <div className="mb-5 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {mode === "signup" && (
                  <div>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name"
                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 transition-all"
                      required
                    />
                  </div>
                </div>

                {mode !== "forgot" && (
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "signin" && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {/* Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-5 bg-white hover:bg-zinc-200 text-black rounded-xl py-3 text-sm font-medium transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === "signin" ? (
                  "Sign In"
                ) : mode === "signup" ? (
                  "Create Account"
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              {mode !== "forgot" && onTryFirst && (
                <Button
                  type="button"
                  onClick={onTryFirst}
                  variant="ghost"
                  className="w-full mt-3 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/50 rounded-xl py-3 text-sm font-medium transition-all group"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-emerald-500 group-hover:text-emerald-400" />
                  Try First Without Account
                </Button>
              )}

              {mode !== "forgot" && (
                <p className="mt-5 text-center text-xs text-zinc-600">
                  {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                    className="text-white hover:text-zinc-300 font-medium transition-colors"
                  >
                    {mode === "signin" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
