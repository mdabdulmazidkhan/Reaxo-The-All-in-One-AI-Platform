'use client';

import { useState, useEffect, useMemo } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { MODELS, PROVIDER_LOGOS } from "../lib/models"

interface LandingPageProps {
  onLogin: () => void
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const words = ["Parallelly", "Efficiently", "Easily"]

  const shuffledModels = useMemo(() => {
    const models = [...MODELS]
    // Fisher-Yates shuffle
    for (let i = models.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[models[i], models[j]] = [models[j], models[i]]
    }
    return models
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const currentWord = words[wordIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (typedText.length < currentWord.length) {
            setTypedText(currentWord.slice(0, typedText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 1500)
          }
        } else {
          if (typedText.length > 0) {
            setTypedText(typedText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )
    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, wordIndex])

  const providers = [...new Set(MODELS.map((m) => m.provider))]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/reaxo-logo.webp" alt="Reaxo" className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">Reaxo</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#models" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Models
            </a>
            <div className="w-px h-4 bg-white/10" />
            <button onClick={onLogin} className="text-sm text-zinc-400 hover:text-white transition-colors">
              Sign In
            </button>
            <Button onClick={onLogin} className="bg-white text-black hover:bg-zinc-200 rounded-full px-6">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-black z-40 p-6 flex flex-col gap-6">
            <a href="#features" className="text-lg" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#models" className="text-lg" onClick={() => setMobileMenuOpen(false)}>
              Models
            </a>
            <button onClick={onLogin} className="text-lg text-left">
              Sign In
            </button>
            <Button onClick={onLogin} className="bg-white text-black rounded-full w-full mt-4">
              Get Started
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section - Updated messaging */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 mb-8">
            <span className="text-sm text-zinc-300">Build for</span>
            <img src="https://zeabur.com/logo.svg" alt="Zeabur" className="h-4 w-auto" />
            <span className="text-sm font-semibold text-white">Zeabur Ship It Hackathon</span>
          </div>

          {/* Headline - Updated */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="block text-balance">Use all AI models</span>
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-white italic">
              {typedText}
              <span className="animate-pulse text-white">|</span>
            </span>
          </h1>

          {/* Subheadline - Updated for AI Fiesta style */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 text-pretty">
            Stop juggling tabs. Get answers from GPT-5, Claude, Gemini, Grok, and {MODELS.length - 4}+ AI models
            side-by-side with a single prompt. Compare instantly, pick the best.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onLogin}
              className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 py-6 text-lg font-medium group"
            >
              Sign Up Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={onLogin}
              className="rounded-full px-8 py-6 text-lg border-white/10 bg-zinc-900 hover:bg-zinc-800"
            >
              Login
            </Button>
          </div>
        </div>

        {/* Visual Interface Mockup - Updated to show grid */}
        <div className="relative z-10 mt-20 w-full max-w-6xl mx-auto perspective-1000">
          <div className="transform transition-all duration-500 hover:rotate-x-0 rotate-x-12 origin-bottom">
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
              {/* Browser Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-950/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-zinc-500">reaxo.app</span>
                </div>
              </div>

              {/* Dashboard Layout */}
              <div className="flex min-h-[480px]">
                {/* Sidebar */}
                <div className="w-56 bg-zinc-950/80 border-r border-white/5 p-4 hidden md:block">
                  {/* Logo */}
                  <div className="flex items-center gap-2.5 mb-6">
                    <img src="/images/reaxo-logo.webp" alt="Reaxo" className="w-7 h-7" />
                    <span className="font-semibold text-sm">Reaxo</span>
                  </div>

                  {/* Model Toggles */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2 px-2">Models</div>
                    {[
                      { name: "GPT-4o", provider: "OpenAI", logo: PROVIDER_LOGOS.OpenAI, bg: "bg-white", active: true },
                      {
                        name: "Claude 4.5",
                        provider: "Anthropic",
                        logo: PROVIDER_LOGOS.Anthropic,
                        bg: "bg-[#D97757]",
                        active: true,
                      },
                      {
                        name: "Gemini 2.5",
                        provider: "Google",
                        logo: PROVIDER_LOGOS.Google,
                        bg: "bg-white",
                        active: true,
                      },
                      { name: "Grok 3", provider: "xAI", logo: PROVIDER_LOGOS.xAI, bg: "bg-black", active: true },
                      {
                        name: "DeepSeek",
                        provider: "DeepSeek",
                        logo: PROVIDER_LOGOS.DeepSeek,
                        bg: "bg-white",
                        active: false,
                      },
                    ].map((model, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${model.active ? "bg-white/5" : "opacity-40"}`}
                      >
                        <div className={`w-5 h-5 rounded-full overflow-hidden ${model.bg} flex-shrink-0`}>
                          <img
                            src={model.logo || "/placeholder.svg"}
                            alt={model.provider}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-medium truncate">{model.name}</div>
                        </div>
                        <div
                          className={`w-7 h-4 rounded-full ${model.active ? "bg-emerald-500" : "bg-zinc-700"} flex items-center ${model.active ? "justify-end" : "justify-start"} px-0.5`}
                        >
                          <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex gap-2">
                      <div className="flex-1 text-[10px] text-center py-1.5 rounded bg-emerald-500/20 text-emerald-400">
                        All On
                      </div>
                      <div className="flex-1 text-[10px] text-center py-1.5 rounded bg-zinc-800 text-zinc-400">
                        All Off
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-gradient-to-b from-zinc-950 to-black relative">
                  {/* Response Grid */}
                  <div className="flex-1 p-4 overflow-hidden">
                    {/* User Prompt */}
                    <div className="max-w-xl mx-auto mb-4 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                        <img src="/images/image.png" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-zinc-800/60 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-zinc-200">
                        Explain quantum computing in simple terms
                      </div>
                    </div>

                    {/* AI Responses Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        {
                          name: "GPT-4o",
                          provider: "OpenAI",
                          logo: PROVIDER_LOGOS.OpenAI,
                          bg: "bg-white",
                          text: "Quantum computers use qubits that exist in multiple states at once, enabling them to solve certain problems exponentially faster than classical computers.",
                          words: 28,
                        },
                        {
                          name: "Claude 4.5",
                          provider: "Anthropic",
                          logo: PROVIDER_LOGOS.Anthropic,
                          bg: "bg-[#D97757]",
                          text: "Imagine a maze where you could explore all paths simultaneously instead of one at a time. That's the power of quantum computing.",
                          words: 26,
                        },
                        {
                          name: "Gemini 2.5",
                          provider: "Google",
                          logo: PROVIDER_LOGOS.Google,
                          bg: "bg-white",
                          text: "While regular computers use bits (0 or 1), quantum computers use qubits that leverage superposition to process vast amounts of data.",
                          words: 24,
                        },
                        {
                          name: "Grok 3",
                          provider: "xAI",
                          logo: PROVIDER_LOGOS.xAI,
                          bg: "bg-black",
                          text: 'Think of a coin spinning in the air - both heads and tails at once. Quantum computers harness this "both at once" property.',
                          words: 27,
                        },
                      ].map((model, i) => (
                        <div
                          key={i}
                          className="bg-zinc-900/80 rounded-xl border border-white/10 overflow-hidden group hover:border-white/20 transition-all"
                        >
                          {/* Card Header */}
                          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-zinc-800/40">
                            <div className={`w-5 h-5 rounded-full overflow-hidden ${model.bg} flex-shrink-0`}>
                              <img
                                src={model.logo || "/placeholder.svg"}
                                alt={model.provider}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-medium truncate">{model.name}</div>
                              <div className="text-[9px] text-zinc-500">{model.provider}</div>
                            </div>
                          </div>
                          {/* Card Body */}
                          <div className="p-3 h-24">
                            <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-5">{model.text}</p>
                          </div>
                          {/* Card Footer */}
                          <div className="px-3 py-1.5 border-t border-white/5 flex items-center justify-between bg-zinc-900/50">
                            <span className="text-[9px] text-zinc-600">{model.words} words</span>
                            <div className="flex gap-1">
                              <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg
                                  className="w-2.5 h-2.5 text-zinc-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating Input Bar */}
                  <div className="p-4 pt-0">
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-zinc-800/80 rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3 shadow-lg">
                        <div className="w-8 h-8 rounded-xl bg-zinc-700/80 flex items-center justify-center">
                          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 text-sm text-zinc-500">Ask anything to multiple AIs...</div>
                        <div className="flex items-center gap-2">
                          <div className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-600 bg-zinc-700/50 px-2 py-1 rounded">
                            <span>⌘</span>
                            <span>K</span>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[10px] text-amber-500/60 mt-2">
                        Reaxo AI can make mistakes. Consider checking important information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Marquee */}
      <section id="models" className="py-20 border-y border-white/5 overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{MODELS.length}+ AI Models Available</h2>
        </div>
        <div className="flex animate-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-8">
              {shuffledModels.slice(0, 12).map((model) => (
                <div
                  key={`${i}-${model.id}`}
                  className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors whitespace-nowrap"
                >
                  <div
                    className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${
                      model.provider === "Anthropic"
                        ? "bg-[#D97757]"
                        : model.provider === "xAI" || model.provider === "Zhipu" || model.provider === "Kimi"
                          ? "bg-black border border-white/20"
                          : "bg-white"
                    }`}
                  >
                    <img
                      src={PROVIDER_LOGOS[model.provider] || "/placeholder.svg"}
                      alt={model.provider}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{model.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-32 px-6 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm text-zinc-500 uppercase tracking-widest mb-4">Why Reaxo</p>
            <h2 className="text-3xl md:text-4xl font-medium text-balance">The smarter way to use AI</h2>
          </div>

          {/* Minimal 3-column grid */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="text-center md:text-left group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-5 mx-auto md:mx-0 relative overflow-hidden">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <circle
                    cx="6"
                    cy="6"
                    r="2"
                    className="fill-cyan-400 animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  />
                  <circle
                    cx="12"
                    cy="6"
                    r="2"
                    className="fill-cyan-400 animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <circle
                    cx="18"
                    cy="6"
                    r="2"
                    className="fill-cyan-400 animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                  <circle
                    cx="6"
                    cy="12"
                    r="2"
                    className="fill-cyan-400 animate-pulse"
                    style={{ animationDelay: "100ms" }}
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="2"
                    className="fill-cyan-400 animate-pulse"
                    style={{ animationDelay: "250ms" }}
                  />
                  <circle
                    cx="18"
                    cy="12"
                    r="2"
                    className="fill-cyan-400 animate-pulse"
                    style={{ animationDelay: "400ms" }}
                  />
                  <circle
                    cx="6"
                    cy="18"
                    r="2"
                    className="fill-cyan-400 animate-pulse"
                    style={{ animationDelay: "200ms" }}
                  />
                  <circle
                    cx="12"
                    cy="18"
                    r="2"
                    className="fill-cyan-400 animate-pulse"
                    style={{ animationDelay: "350ms" }}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="2"
                    className="fill-cyan-400 animate-pulse"
                    style={{ animationDelay: "500ms" }}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">One Prompt, Many Minds</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Send a single question and receive answers from {MODELS.length}+ AI models simultaneously. No more tab
                switching.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center md:text-left group">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-5 mx-auto md:mx-0 relative">
                <svg viewBox="0 0 24 24" className="w-6 h-6 animate-icon-pulse">
                  <defs>
                    <linearGradient id="bolt-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    fill="url(#bolt-gradient)"
                    className="drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]"
                  />
                </svg>
                <div
                  className="absolute inset-0 rounded-2xl bg-violet-400/20 animate-ping opacity-0 group-hover:opacity-100"
                  style={{ animationDuration: "1.5s" }}
                />
              </div>
              <h3 className="text-lg font-medium mb-3">Instant Parallel Responses</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                All models respond at once. Compare GPT, Claude, Gemini, and Grok side-by-side in seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center md:text-left group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5 mx-auto md:mx-0 relative overflow-hidden">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  {/* Toggle track */}
                  <rect x="3" y="5" width="18" height="4" rx="2" className="fill-emerald-400/30" />
                  <rect x="3" y="10" width="18" height="4" rx="2" className="fill-emerald-400/30" />
                  <rect x="3" y="15" width="18" height="4" rx="2" className="fill-emerald-400/30" />
                  {/* Animated toggle dots */}
                  <circle cx="17" cy="7" r="2.5" className="fill-emerald-400 animate-toggle-1" />
                  <circle cx="7" cy="12" r="2.5" className="fill-emerald-400 animate-toggle-2" />
                  <circle cx="17" cy="17" r="2.5" className="fill-emerald-400 animate-toggle-3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">Toggle What You Need</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Enable or disable any AI model with one click. Customize your comparison view your way.
              </p>
            </div>
          </div>

          {/* Minimal CTA */}
          <div className="mt-20 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <p className="text-zinc-400 text-sm">Ready to find the best AI answer?</p>
              <Button
                onClick={onLogin}
                className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 py-3 text-sm font-medium"
              >
                Start Comparing Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/reaxo-logo.webp" alt="Reaxo" className="w-8 h-8" />
              <span className="font-bold text-xl">Reaxo</span>
            </div>
            <p className="text-zinc-500 text-sm">
              Compare {MODELS.length}+ AI models side-by-side. Powered by Zeabur AI Hub.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-sm text-zinc-600">
          &copy; 2026 Reaxo. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-x-12 {
          transform: rotateX(12deg);
        }
        .rotate-x-0 {
          transform: rotateX(0deg);
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        /* New animations for feature icons */
        @keyframes icon-pulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 4px rgba(167,139,250,0.3));
          }
          50% {
            transform: scale(1.1);
            filter: drop-shadow(0 0 12px rgba(167,139,250,0.6));
          }
        }
        .animate-icon-pulse {
          animation: icon-pulse 2s ease-in-out infinite;
        }
        @keyframes toggle-slide-1 {
          0%, 100% { cx: 17; }
          50% { cx: 7; }
        }
        @keyframes toggle-slide-2 {
          0%, 100% { cx: 7; }
          50% { cx: 17; }
        }
        @keyframes toggle-slide-3 {
          0%, 100% { cx: 17; }
          50% { cx: 7; }
        }
        .animate-toggle-1 {
          animation: toggle-slide-1 3s ease-in-out infinite;
        }
        .animate-toggle-2 {
          animation: toggle-slide-2 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .animate-toggle-3 {
          animation: toggle-slide-3 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
