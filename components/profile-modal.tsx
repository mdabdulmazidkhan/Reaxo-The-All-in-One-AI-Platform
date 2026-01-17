"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Camera, Loader2, User, Mail, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const DEFAULT_AVATAR = "/images/default-avatar.webp"

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile
  onUpdate: (profile: Profile) => void
}

export default function ProfileModal({ isOpen, onClose, profile, onUpdate }: ProfileModalProps) {
  const [fullName, setFullName] = useState(profile.full_name || "")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || DEFAULT_AVATAR)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = getSupabaseBrowserClient()

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
    } catch (err) {
      setError("Failed to upload avatar. Please try again.")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      onUpdate({
        ...profile,
        full_name: fullName,
        avatar_url: avatarUrl,
      })
      setTimeout(() => {
        onClose()
      }, 1000)
    }

    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <h2 className="font-bold text-xl text-white">Edit Profile</h2>
          <p className="text-sm text-zinc-500">Update your personal information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-8">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
              Profile updated successfully!
            </div>
          )}

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={avatarUrl || DEFAULT_AVATAR}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-2 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white shadow-lg transition-colors"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-12 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-12 py-3 text-zinc-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-zinc-600">Email cannot be changed</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl py-3 font-medium shadow-lg shadow-cyan-500/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
