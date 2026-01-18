"use client"

import type React from "react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const renderMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    let codeBlockLang = ""
    let listItems: string[] = []
    let listType: "ul" | "ol" | null = null

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const ListTag = listType
        elements.push(
          <ListTag
            key={`list-${elements.length}`}
            className={`my-3 ml-6 space-y-1 ${listType === "ul" ? "list-disc" : "list-decimal"}`}
          >
            {listItems.map((item, i) => (
              <li key={i} className="text-zinc-300">
                {parseInline(item)}
              </li>
            ))}
          </ListTag>,
        )
        listItems = []
        listType = null
      }
    }

    const parseInline = (text: string): React.ReactNode => {
      const parts: React.ReactNode[] = []
      let remaining = text
      let key = 0

      while (remaining.length > 0) {
        // Bold **text** or __text__
        const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/)
        if (boldMatch) {
          parts.push(
            <strong key={key++} className="font-semibold text-white">
              {boldMatch[2]}
            </strong>,
          )
          remaining = remaining.slice(boldMatch[0].length)
          continue
        }

        // Italic *text* or _text_
        const italicMatch = remaining.match(/^(\*|_)(.+?)\1/)
        if (italicMatch) {
          parts.push(
            <em key={key++} className="italic text-zinc-200">
              {italicMatch[2]}
            </em>,
          )
          remaining = remaining.slice(italicMatch[0].length)
          continue
        }

        // Inline code `code`
        const codeMatch = remaining.match(/^`([^`]+)`/)
        if (codeMatch) {
          parts.push(
            <code key={key++} className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-400 text-[0.9em] font-mono">
              {codeMatch[1]}
            </code>,
          )
          remaining = remaining.slice(codeMatch[0].length)
          continue
        }

        // Link [text](url)
        const linkMatch = remaining.match(/^\[([^\]]+)\]$$([^)]+)$$/)
        if (linkMatch) {
          parts.push(
            <a
              key={key++}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
              {linkMatch[1]}
            </a>,
          )
          remaining = remaining.slice(linkMatch[0].length)
          continue
        }

        // Regular text - take one character at a time until we hit a special char
        const nextSpecial = remaining.search(/[*_`[]/)
        if (nextSpecial === -1) {
          parts.push(remaining)
          break
        } else if (nextSpecial === 0) {
          parts.push(remaining[0])
          remaining = remaining.slice(1)
        } else {
          parts.push(remaining.slice(0, nextSpecial))
          remaining = remaining.slice(nextSpecial)
        }
      }

      return parts.length === 1 ? parts[0] : <>{parts}</>
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Code block start/end
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          flushList()
          inCodeBlock = true
          codeBlockLang = line.slice(3).trim()
          codeBlockContent = []
        } else {
          elements.push(
            <div key={`code-${elements.length}`} className="my-3 rounded-xl overflow-hidden">
              {codeBlockLang && (
                <div className="px-4 py-2 bg-zinc-800 text-xs text-zinc-400 font-mono border-b border-zinc-700">
                  {codeBlockLang}
                </div>
              )}
              <pre className="p-4 bg-zinc-800/80 overflow-x-auto">
                <code className="text-sm font-mono text-zinc-300">{codeBlockContent.join("\n")}</code>
              </pre>
            </div>,
          )
          inCodeBlock = false
          codeBlockContent = []
          codeBlockLang = ""
        }
        continue
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        continue
      }

      // Headers
      const h1Match = line.match(/^# (.+)$/)
      if (h1Match) {
        flushList()
        elements.push(
          <h1 key={`h1-${elements.length}`} className="text-2xl font-bold text-white mt-6 mb-3">
            {parseInline(h1Match[1])}
          </h1>,
        )
        continue
      }

      const h2Match = line.match(/^## (.+)$/)
      if (h2Match) {
        flushList()
        elements.push(
          <h2 key={`h2-${elements.length}`} className="text-xl font-bold text-white mt-5 mb-2">
            {parseInline(h2Match[1])}
          </h2>,
        )
        continue
      }

      const h3Match = line.match(/^### (.+)$/)
      if (h3Match) {
        flushList()
        elements.push(
          <h3 key={`h3-${elements.length}`} className="text-lg font-semibold text-white mt-4 mb-2">
            {parseInline(h3Match[1])}
          </h3>,
        )
        continue
      }

      const h4Match = line.match(/^#### (.+)$/)
      if (h4Match) {
        flushList()
        elements.push(
          <h4 key={`h4-${elements.length}`} className="text-base font-semibold text-white mt-3 mb-1">
            {parseInline(h4Match[1])}
          </h4>,
        )
        continue
      }

      // Horizontal rule
      if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
        flushList()
        elements.push(<hr key={`hr-${elements.length}`} className="my-4 border-zinc-700" />)
        continue
      }

      // Blockquote
      const blockquoteMatch = line.match(/^> (.+)$/)
      if (blockquoteMatch) {
        flushList()
        elements.push(
          <blockquote
            key={`bq-${elements.length}`}
            className="my-3 pl-4 border-l-2 border-cyan-500/50 text-zinc-400 italic"
          >
            {parseInline(blockquoteMatch[1])}
          </blockquote>,
        )
        continue
      }

      // Unordered list
      const ulMatch = line.match(/^[*\-+] (.+)$/)
      if (ulMatch) {
        if (listType !== "ul") {
          flushList()
          listType = "ul"
        }
        listItems.push(ulMatch[1])
        continue
      }

      // Ordered list
      const olMatch = line.match(/^\d+\. (.+)$/)
      if (olMatch) {
        if (listType !== "ol") {
          flushList()
          listType = "ol"
        }
        listItems.push(olMatch[1])
        continue
      }

      // Empty line
      if (line.trim() === "") {
        flushList()
        elements.push(<div key={`br-${elements.length}`} className="h-3" />)
        continue
      }

      // Regular paragraph
      flushList()
      elements.push(
        <p key={`p-${elements.length}`} className="text-zinc-300 leading-relaxed">
          {parseInline(line)}
        </p>,
      )
    }

    flushList()

    // Handle unclosed code block
    if (inCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <pre key={`code-${elements.length}`} className="my-3 p-4 bg-zinc-800/80 rounded-xl overflow-x-auto">
          <code className="text-sm font-mono text-zinc-300">{codeBlockContent.join("\n")}</code>
        </pre>,
      )
    }

    return elements
  }

  return <div className={`markdown-content ${className}`}>{renderMarkdown(content)}</div>
}
