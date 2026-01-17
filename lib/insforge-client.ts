// InsForge API Client
const INSFORGE_URL = "https://2m29djnq.us-west.insforge.app"
const INSFORGE_KEY = "ik_a06f6e5b8ea2f168f832c01dd9df0f24"

interface InsForgeUser {
  id: string
  email: string
  full_name: string
  avatar_url: string
  created_at: string
}

export const insforgeClient = {
  async signUp(email: string, password: string, fullName: string): Promise<{ user?: InsForgeUser; error?: string }> {
    try {
      const response = await fetch(`${INSFORGE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${INSFORGE_KEY}`,
        },
        body: JSON.stringify({ email, password, full_name: fullName }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.message || "Sign up failed" }
      }

      return { user: data.user }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "An error occurred" }
    }
  },

  async signIn(email: string, password: string): Promise<{ user?: InsForgeUser; token?: string; error?: string }> {
    try {
      const response = await fetch(`${INSFORGE_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${INSFORGE_KEY}`,
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.message || "Sign in failed" }
      }

      return { user: data.user, token: data.token }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "An error occurred" }
    }
  },

  async getUser(token: string): Promise<{ user?: InsForgeUser; error?: string }> {
    try {
      const response = await fetch(`${INSFORGE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: "Failed to fetch user" }
      }

      return { user: data.user }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "An error occurred" }
    }
  },

  async updateProfile(
    token: string,
    fullName?: string,
    avatarUrl?: string
  ): Promise<{ user?: InsForgeUser; error?: string }> {
    try {
      const response = await fetch(`${INSFORGE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ full_name: fullName, avatar_url: avatarUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.message || "Profile update failed" }
      }

      return { user: data.user }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "An error occurred" }
    }
  },
}
