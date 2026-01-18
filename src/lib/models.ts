export interface Model {
  id: string
  name: string
  provider: string
  description: string
  inputCost: string
  outputCost: string
  contextWindow: string
  color: string
}

export const PROVIDER_LOGOS: Record<string, string> = {
  Google: "/logos/google.png",
  Anthropic: "/logos/anthropic.png",
  Meta: "/logos/meta.png",
  Zhipu: "/logos/zhipu.png",
  Moonshot: "/logos/moonshot.png",
  Kimi: "/logos/kimi.png",
  OpenAI: "/logos/openai.png",
  DeepSeek: "/logos/deepseek.png",
  xAI: "/logos/xai.png",
  Alibaba: "/logos/alibaba.png",
}

export const MODELS: Model[] = [
  // Google Gemini
  {
    id: "gemini-3-pro-preview",
    name: "Gemini 3 Pro",
    provider: "Google",
    description: "Latest Gemini 3 Pro preview model",
    inputCost: "$2",
    outputCost: "$12",
    contextWindow: "1M tokens",
    color: "text-blue-400",
  },
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    provider: "Google",
    description: "Fast Gemini 3 preview model",
    inputCost: "$0.5",
    outputCost: "$3",
    contextWindow: "1M tokens",
    color: "text-blue-400",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description: "Advanced reasoning and analysis",
    inputCost: "$1.25",
    outputCost: "$10",
    contextWindow: "1M tokens",
    color: "text-blue-400",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    description: "Fast and affordable",
    inputCost: "$0.3",
    outputCost: "$2.5",
    contextWindow: "1M tokens",
    color: "text-blue-400",
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    provider: "Google",
    description: "Ultra-fast lightweight model",
    inputCost: "$0.1",
    outputCost: "$0.4",
    contextWindow: "1M tokens",
    color: "text-blue-400",
  },
  // Anthropic Claude
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    description: "Most intelligent Claude model",
    inputCost: "$3.3",
    outputCost: "$16.5",
    contextWindow: "1M tokens",
    color: "text-orange-400",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    description: "Fast and efficient Claude",
    inputCost: "$1.1",
    outputCost: "$5.5",
    contextWindow: "1M tokens",
    color: "text-orange-400",
  },
  // OpenAI
  {
    id: "gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    description: "Most capable GPT model",
    inputCost: "$1.25",
    outputCost: "$10",
    contextWindow: "400k tokens",
    color: "text-emerald-400",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    description: "Efficient GPT-5 variant",
    inputCost: "$0.25",
    outputCost: "$2",
    contextWindow: "400k tokens",
    color: "text-emerald-400",
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "OpenAI",
    description: "Enhanced GPT-4 model",
    inputCost: "$2",
    outputCost: "$8",
    contextWindow: "1M tokens",
    color: "text-emerald-400",
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    provider: "OpenAI",
    description: "Compact GPT-4.1",
    inputCost: "$0.4",
    outputCost: "$1.6",
    contextWindow: "1M tokens",
    color: "text-emerald-400",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Multimodal GPT-4",
    inputCost: "$2.5",
    outputCost: "$10",
    contextWindow: "128k tokens",
    color: "text-emerald-400",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "Compact multimodal model",
    inputCost: "$0.15",
    outputCost: "$0.6",
    contextWindow: "128k tokens",
    color: "text-emerald-400",
  },
  // xAI
  {
    id: "grok-4-fast-non-reasoning",
    name: "Grok 4 Fast",
    provider: "xAI",
    description: "Fast non-reasoning Grok",
    inputCost: "$0.2",
    outputCost: "$0.5",
    contextWindow: "2M tokens",
    color: "text-red-400",
  },
  // DeepSeek
  {
    id: "deepseek-v3.2",
    name: "DeepSeek V3.2",
    provider: "DeepSeek",
    description: "Advanced open-source model",
    inputCost: "$0.27",
    outputCost: "$0.4",
    contextWindow: "164k tokens",
    color: "text-violet-400",
  },
  // GLM
  {
    id: "glm-4.6",
    name: "GLM 4.6",
    provider: "Zhipu",
    description: "Chinese-English bilingual",
    inputCost: "$0.45",
    outputCost: "$1.9",
    contextWindow: "205k tokens",
    color: "text-pink-400",
  },
  // Kimi
  {
    id: "kimi-k2-thinking",
    name: "Kimi K2 Thinking",
    provider: "Moonshot",
    description: "Reasoning-focused model",
    inputCost: "$0.55",
    outputCost: "$2.5",
    contextWindow: "N/A",
    color: "text-cyan-400",
  },
  // Meta
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    description: "Open-source powerhouse",
    inputCost: "$0.85",
    outputCost: "$1.2",
    contextWindow: "65k tokens",
    color: "text-indigo-400",
  },
  // Qwen
  {
    id: "qwen-3-32",
    name: "Qwen 3 32B",
    provider: "Alibaba",
    description: "Efficient multilingual model",
    inputCost: "$0.4",
    outputCost: "$0.8",
    contextWindow: "N/A",
    color: "text-amber-400",
  },
  {
    id: "qwen3-next",
    name: "Qwen 3 Next",
    provider: "Alibaba",
    description: "Latest Qwen model",
    inputCost: "$0.14",
    outputCost: "$1.1",
    contextWindow: "N/A",
    color: "text-amber-400",
  },
]

export const DEFAULT_MODEL = MODELS.find((m) => m.id === "gemini-2.5-flash") || MODELS[0]
