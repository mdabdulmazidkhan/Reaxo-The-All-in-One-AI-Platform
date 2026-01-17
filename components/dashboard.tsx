"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Send,
  Loader2,
  LogOut,
  Menu,
  X,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Plus,
  Command,
  UserPlus,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MODELS, PROVIDER_LOGOS, type Model } from "@/lib/models"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface DashboardProps {
  user: {
    name: string
    email: string
    avatar: string
  }
  onLogout: () => void
  onOpenProfile?: () => void // Added onOpenProfile prop
  isGuest?: boolean // Added isGuest prop
}

interface ModelResponse {
  modelId: string
  content: string
  isLoading: boolean
  error?: string
}

interface ConversationTurn {
  id: string
  prompt: string
  responses: ModelResponse[]
}

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a haiku about technology",
  "What are 3 startup ideas for AI?",
  "How do I learn to code?",
]

const DEFAULT_AVATAR = "/images/default-avatar.webp"

function ProviderLogo({ provider, size = "md" }: { provider: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  }

  const logoUrl = PROVIDER_LOGOS[provider]

  const bgColors: Record<string, string> = {
    Google: "bg-white",
    Anthropic: "bg-[#d97757]",
    OpenAI: "bg-white",
    xAI: "bg-black",
    DeepSeek: "bg-white",
    Zhipu: "bg-black",
    Moonshot: "bg-[#f5f5f0]",
    Meta: "bg-[#e8f0fe]",
    Kimi: "bg-black",
    Alibaba: "bg-gradient-to-br from-amber-500 to-orange-600",
  }

  const bg = bgColors[provider] || "bg-zinc-700"

  if (logoUrl) {
    return (
      <div
        className={`${sizeClasses[size]} ${bg} rounded-full flex items-center justify-center overflow-hidden ring-1 ring-zinc-700/50 shadow-lg`}
      >
        <img src={logoUrl || "/placeholder.svg"} alt={`${provider} logo`} className="w-full h-full object-cover" />
      </div>
    )
  }

  // Fallback for providers without logos (like Alibaba)
  return (
    <div
      className={`${sizeClasses[size]} ${bg} rounded-full flex items-center justify-center font-bold text-white shadow-lg ring-1 ring-zinc-700/50`}
    >
      {provider.charAt(0)}
    </div>
  )
}

export default function Dashboard({ user, onLogout, onOpenProfile, isGuest = false }: DashboardProps) {
  const [enabledModels, setEnabledModels] = useState<Set<string>>(() => {
    const defaultProviders = ["Google", "Anthropic", "OpenAI", "xAI", "DeepSeek"]
    const defaultModelIds: string[] = []

    for (const provider of defaultProviders) {
      const model = MODELS.find((m) => m.provider === provider)
      if (model) {
        defaultModelIds.push(model.id)
      }
    }

    return new Set(defaultModelIds)
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [conversations, setConversations] = useState<ConversationTurn[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const toggleModel = (modelId: string) => {
    setEnabledModels((prev) => {
      const next = new Set(prev)
      if (next.has(modelId)) {
        next.delete(modelId)
      } else {
        next.add(modelId)
      }
      return next
    })
  }

  const enableAllModels = () => {
    setEnabledModels(new Set(MODELS.map((m) => m.id)))
  }

  const disableAllModels = () => {
    setEnabledModels(new Set())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || enabledModels.size === 0) return

    const prompt = input.trim()
    setInput("")
    setIsLoading(true)

    const turnId = Date.now().toString()
    const enabledModelIds = Array.from(enabledModels)

    const initialResponses: ModelResponse[] = enabledModelIds.map((modelId) => ({
      modelId,
      content: "",
      isLoading: true,
    }))

    setConversations((prev) => [...prev, { id: turnId, prompt, responses: initialResponses }])

    const conversationHistory: { role: "user" | "assistant"; content: string }[] = []

    // Get the last conversation turn for context (if exists)
    if (conversations.length > 0) {
      const lastTurn = conversations[conversations.length - 1]
      conversationHistory.push({ role: "user", content: lastTurn.prompt })
      // Use first successful response as assistant context
      const successfulResponse = lastTurn.responses.find((r) => r.content && !r.error)
      if (successfulResponse) {
        conversationHistory.push({ role: "assistant", content: successfulResponse.content })
      }
    }

    // Add current prompt
    conversationHistory.push({ role: "user", content: prompt })

    const fetchPromises = enabledModelIds.map(async (modelId) => {
      try {
        let modelMessages = [...conversationHistory]

        // If we have previous turns, try to use this model's specific response
        if (conversations.length > 0) {
          const lastTurn = conversations[conversations.length - 1]
          const modelPrevResponse = lastTurn.responses.find((r) => r.modelId === modelId && r.content && !r.error)
          if (modelPrevResponse) {
            // Replace the generic assistant response with model-specific one
            modelMessages = [
              { role: "user" as const, content: lastTurn.prompt },
              { role: "assistant" as const, content: modelPrevResponse.content },
              { role: "user" as const, content: prompt },
            ]
          }
        }

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: modelMessages,
            model: modelId,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Error ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullContent = ""

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ""
                if (content) {
                  fullContent += content
                  setConversations((prev) =>
                    prev.map((turn) =>
                      turn.id === turnId
                        ? {
                            ...turn,
                            responses: turn.responses.map((r) =>
                              r.modelId === modelId ? { ...r, content: fullContent, isLoading: true } : r,
                            ),
                          }
                        : turn,
                    ),
                  )
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }

        setConversations((prev) =>
          prev.map((turn) =>
            turn.id === turnId
              ? {
                  ...turn,
                  responses: turn.responses.map((r) => (r.modelId === modelId ? { ...r, isLoading: false } : r)),
                }
              : turn,
          ),
        )
      } catch (error) {
        setConversations((prev) =>
          prev.map((turn) =>
            turn.id === turnId
              ? {
                  ...turn,
                  responses: turn.responses.map((r) =>
                    r.modelId === modelId
                      ? {
                          ...r,
                          content: "",
                          error: error instanceof Error ? error.message : "Failed",
                          isLoading: false,
                        }
                      : r,
                  ),
                }
              : turn,
          ),
        )
      }
    })

    await Promise.allSettled(fetchPromises)
    setIsLoading(false)
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversations])

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClearChat = () => {
    setConversations([])
  }

  const getModelById = (id: string): Model | undefined => {
    return MODELS.find((m) => m.id === id)
  }

  const groupedModels = MODELS.reduce(
    (acc, model) => {
      if (!acc[model.provider]) acc[model.provider] = []
      acc[model.provider].push(model)
      return acc
    },
    {} as Record<string, Model[]>,
  )

  const getGridCols = () => {
    const count = enabledModels.size
    if (count <= 2) return "grid-cols-1 md:grid-cols-2"
    if (count <= 4) return "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  }

  const removeModelFromTurn = (turnId: string, modelId: string) => {
    setConversations(
      (prev) =>
        prev
          .map((turn) =>
            turn.id === turnId
              ? {
                  ...turn,
                  responses: turn.responses.filter((r) => r.modelId !== modelId),
                }
              : turn,
          )
          .filter((turn) => turn.responses.length > 0), // Remove turn if no responses left
    )
    // Also disable the model from future queries
    setEnabledModels((prev) => {
      const next = new Set(prev)
      next.delete(modelId)
      return next
    })
  }

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-40 w-72 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <img src="/images/reaxo-logo.webp" alt="Reaxo" className="w-10 h-10" />
              <div>
                <h1 className="font-bold text-lg">Reaxo</h1>
                <p className="text-xs text-zinc-500">Multi-AI Chat Platform</p>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Models ({enabledModels.size}/{MODELS.length})
              </span>
              <div className="flex gap-2">
                <button onClick={enableAllModels} className="text-xs text-cyan-500 hover:text-cyan-400 font-medium">
                  All
                </button>
                <span className="text-zinc-700">|</span>
                <button onClick={disableAllModels} className="text-xs text-zinc-500 hover:text-zinc-400 font-medium">
                  None
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
              {Object.entries(groupedModels).map(([provider, models]) => (
                <div key={provider}>
                  <div className="flex items-center gap-2 mb-2 sticky top-0 bg-zinc-950 py-1">
                    <ProviderLogo provider={provider} size="sm" />
                    <span className="text-xs font-semibold text-zinc-400">{provider}</span>
                  </div>
                  <div className="space-y-1 ml-1">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => toggleModel(model.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                          enabledModels.has(model.id)
                            ? "bg-zinc-800/80 text-white border border-zinc-700"
                            : "bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent"
                        }`}
                      >
                        <span className="truncate font-medium">{model.name}</span>
                        {enabledModels.has(model.id) ? (
                          <ToggleRight className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 flex-1">
            <Button
              onClick={handleClearChat}
              variant="outline"
              className="w-full justify-start gap-3 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-zinc-800">
            {isGuest ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <img
                    src={DEFAULT_AVATAR || "/placeholder.svg"}
                    alt="Guest"
                    className="w-10 h-10 rounded-full object-cover opacity-60"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-400">Guest Mode</div>
                    <div className="text-xs text-zinc-600">Chat history not saved</div>
                  </div>
                </div>
                <Button
                  onClick={onOpenProfile}
                  className="w-full bg-white hover:bg-zinc-200 text-black rounded-xl py-2.5 text-sm font-medium transition-all group"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up to Save Chats
                </Button>
                <button
                  onClick={onLogout}
                  className="w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1"
                >
                  Exit Guest Mode
                </button>
              </div>
            ) : (
              // Existing logged-in user UI
              <div
                className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
                onClick={onOpenProfile}
              >
                <img
                  src={user.avatar || DEFAULT_AVATAR}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onLogout()
                  }}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              {/* Main heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 tracking-tight">
                What will you create?
              </h1>

              {/* Subtitle */}
              <p className="text-zinc-400 text-center max-w-xl text-lg mb-10 leading-relaxed">
                Unleash your imagination with Reaxo&apos;s state-of-the-art AI models. Compare responses from multiple
                AIs instantly.
              </p>

              {enabledModels.size === 0 && (
                <div className="mb-8 px-5 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium">
                  Enable at least one model from the sidebar
                </div>
              )}

              {/* Suggestion pills */}
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestion(suggestion)}
                    className="px-5 py-3 bg-zinc-900/60 hover:bg-zinc-800/80 rounded-full text-sm text-zinc-300 hover:text-white border border-zinc-700/50 hover:border-zinc-600 transition-all duration-200 backdrop-blur-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-10 max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8 pb-40">
              {conversations.map((turn) => (
                <div key={turn.id} className="space-y-6">
                  {/* User Prompt */}
                  <div className="flex justify-center">
                    <div className="max-w-3xl w-full bg-zinc-900 rounded-2xl px-6 py-5 border border-zinc-800">
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        Your Prompt
                      </div>
                      <div className="text-lg font-medium text-white">{turn.prompt}</div>
                    </div>
                  </div>

                  <div className={`grid ${getGridCols()} gap-4`}>
                    {turn.responses.map((response) => {
                      const model = getModelById(response.modelId)
                      if (!model) return null

                      return (
                        <div
                          key={`${turn.id}-${response.modelId}`}
                          className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col hover:border-zinc-700 transition-colors"
                        >
                          {/* Model Header - Styled like AI Fiesta */}
                          <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
                            <ProviderLogo provider={model.provider} size="md" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate">{model.name}</h3>
                              <p className="text-xs text-zinc-500">{model.provider}</p>
                            </div>
                            {response.isLoading && (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/10 rounded-full">
                                <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />
                                <span className="text-xs text-cyan-500 font-medium">Generating</span>
                              </div>
                            )}
                            {!response.isLoading && (
                              <button
                                onClick={() => removeModelFromTurn(turn.id, model.id)}
                                className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title={`Remove ${model.name}`}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Response Content */}
                          <div className="p-5 flex-1 min-h-[180px] max-h-[450px] overflow-y-auto custom-scrollbar">
                            {response.error ? (
                              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-red-400 text-sm">{response.error}</span>
                              </div>
                            ) : response.content ? (
                              <MarkdownRenderer content={response.content} className="text-sm leading-relaxed" />
                            ) : response.isLoading ? (
                              <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                                <div className="flex gap-1.5">
                                  <span
                                    className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                  />
                                  <span
                                    className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                  />
                                  <span
                                    className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-500">Thinking...</span>
                              </div>
                            ) : null}
                          </div>

                          {/* Actions Footer */}
                          {response.content && !response.isLoading && (
                            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
                              <span className="text-xs text-zinc-600">{response.content.split(" ").length} words</span>
                              <button
                                onClick={() => handleCopy(response.content, `${turn.id}-${response.modelId}`)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all rounded-lg text-xs font-medium"
                                title="Copy response"
                              >
                                {copiedId === `${turn.id}-${response.modelId}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-emerald-500">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent pt-20">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-700/50 shadow-2xl shadow-black/50">
              {/* Plus button */}
              <button
                type="button"
                className="flex-shrink-0 p-3 ml-2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Input field */}
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Describe what you want to create..."
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-zinc-500 px-3 py-4 focus:outline-none resize-none text-base"
                disabled={isLoading}
              />

              {/* Keyboard shortcut indicator */}
              <div className="hidden md:flex items-center gap-1 text-zinc-600 mr-3">
                <Command className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">K</span>
              </div>

              {/* Send button */}
              <button
                type="submit"
                disabled={isLoading || !input.trim() || enabledModels.size === 0}
                className="flex-shrink-0 p-3 mr-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>

            {/* Disclaimer text */}
            <p className="text-center text-xs text-amber-600/70 mt-3">
              Reaxo AI can make mistakes. Consider checking important information.
            </p>
          </form>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }
      `}</style>
    </div>
  )
}
