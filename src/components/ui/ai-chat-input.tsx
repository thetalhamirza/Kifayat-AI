"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Mic, Send } from "lucide-react"
import { AnimatePresence, motion, Variants } from "motion/react"

const PLACEHOLDERS = [
  "Ask Kifayat AI anything...",
  "Find me the best deals on electronics",
  "Compare prices across platforms",
  "What's the best smartphone under Rs. 50000?",
  "How to find authentic products online?",
  "Summarize my shopping list",
]
// Controls how fast the placeholder letters fade out when typing starts (seconds).
// Decrease for a faster hide, increase for a slower hide.
const PLACEHOLDER_FADE_DURATION = 0.01;
// Header font size class – change this value (e.g., "text-6xl", "text-8xl") to adjust the header size.
const HEADER_TEXT_SIZE = "text-6xl";

export const AIChatInput = () => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const [isSending, setIsSending] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const generateSessionId = () => 'ks_' + Math.random().toString(36).slice(2, 10);
const SESSION_ID = useRef<string>(generateSessionId());

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return
    const interval = setInterval(() => {
      setShowPlaceholder(false)
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
        setShowPlaceholder(true)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [isActive, inputValue])

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (!inputValue) setIsActive(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [inputValue])

  const handleActivate = () => setIsActive(true)

  const sendMessage = async () => {
    if (!inputValue.trim() || isSending) return
    const userMsg = inputValue.trim()
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setInputValue('')
    setIsSending(true)
    try {
      const res = await fetch('https://n8n.autom8n.site/webhook/c6fce477-c75a-4924-8d6d-45a8dbdcddc6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: userMsg, sessionId: SESSION_ID.current, action: 'sendMessage' }),
      })
      const contentType = res.headers.get('content-type') || ''
      let reply = ''
      if (contentType.includes('application/json')) {
        const data = await res.json()
        reply = data?.output ?? data?.message ?? data?.text ?? JSON.stringify(data)
      } else {
        reply = await res.text()
      }
      setMessages((prev) => [...prev, { role: 'ai', content: reply }])
    } catch (e) {
      console.error('Send message error:', e);
      const errorMsg = e instanceof Error ? e.message : 'Error sending request.';
      setMessages((prev) => [...prev, { role: 'ai', content: `Error sending request: ${errorMsg}` }]);
    } finally {
      setIsSending(false)
    }
  }

  const containerVariants: any = {
    collapsed: {
      height: 68,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    expanded: {
      height: 128,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  }

  const placeholderContainerVariants: any = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  }

  const letterVariants: any = {
  // Placeholder letter animation variants, with faster exit based on PLACEHOLDER_FADE_DURATION

    initial: { opacity: 0, filter: "blur(12px)", y: 10 },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: { duration: PLACEHOLDER_FADE_DURATION },
        filter: { duration: PLACEHOLDER_FADE_DURATION },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
  }

  // Helper to render message content with image thumbnails and markdown link buttons
  const renderContent = (text: string) => {
    const imgRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp|svg))/gi
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
    const combinedRegex = new RegExp(`${imgRegex.source}|${linkRegex.source}`, "gi")
    const parts = text.split(combinedRegex)
    return parts.map((part, i) => {
      if (!part) return null

      if (imgRegex.test(part)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="inline-block my-2"
          >
            <img
              src={part}
              alt="attachment"
              className="h-20 w-20 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              loading="lazy"
            />
          </a>
        )
      }

      const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/)
      if (linkMatch) {
        const [, label, url] = linkMatch
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            {label}
          </a>
        )
      }

      // Convert markdown bold (**text**) to <strong>text</strong>
      const boldProcessed = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert newline characters to line breaks
      const lineBreakProcessed = boldProcessed.replace(/\n/g, '<br/>')
      // Use dangerouslySetInnerHTML to render HTML
      return <span key={i} dangerouslySetInnerHTML={{ __html: lineBreakProcessed }} />
    })
  }

  return (
    <div className={`w-full h-screen flex flex-col items-center ${messages.length===0 ? 'justify-center' : 'justify-end'} pb-6 text-black relative overflow-hidden`}>
      {/* Header above input, hidden after first message */}
      {messages.length === 0 && (
        <h1 className={`pt-[180px] ${HEADER_TEXT_SIZE} font-[750] font-codec-pro text-white absolute top-0 inset-x-0 text-center`}>
          What are you looking for?
        </h1>
      )}
      <div
        className={`flex flex-col w-full max-w-3xl flex-1 min-h-0 overflow-hidden ${
          messages.length === 0 ? "justify-center" : ""
        }`}
      >
        {/* Messages area */}
        {messages.length > 0 && (
          <motion.div
            className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl px-4 py-3 max-w-md ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-white/90 backdrop-blur-sm text-black border border-gray-200'}`}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 bg-white/90 backdrop-blur-sm text-gray-400 border border-gray-200">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        )}

        {/* Input area - slides down when messages appear */}
        <motion.div
          ref={wrapperRef}
          className="w-full max-w-3xl self-center"
          initial={{ y: 0 }}
          animate={{ y: messages.length > 0 ? 0 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          <motion.div
            variants={containerVariants}
            animate={isActive || inputValue ? "expanded" : "collapsed"}
            initial="collapsed"
            style={{
              overflow: "hidden",
              borderRadius: 32,
              background: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 24px 0 rgba(0,0,0,0.08)",
            }}
            onClick={handleActivate}
          >
            <div className="flex flex-col items-stretch w-full h-full">
              <div className="flex items-center gap-2 p-3 rounded-full bg-transparent w-full">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal text-black placeholder-gray-500"
                    style={{ position: "relative", zIndex: 1 }}
                    onFocus={handleActivate}
                    placeholder=""
                  />
                  <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center pl-4 pr-3 py-2">
                    <AnimatePresence mode="wait">
                      {showPlaceholder && !inputValue && (
                        <motion.span
                          key={placeholderIndex}
                          className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600/60 select-none pointer-events-none"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            zIndex: 0,
                          }}
                          variants={placeholderContainerVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {PLACEHOLDERS[placeholderIndex].split("").map((char, i) => (
                            <motion.span key={i} variants={letterVariants} style={{ display: "inline-block" }}>
                              {char === " " ? " " : char}
                            </motion.span>
                          ))}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                                <button
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-black p-3 rounded-full font-medium justify-center disabled:opacity-50"
                  title="Send"
                  type="button"
                  tabIndex={-1}
                  onClick={sendMessage}
                  disabled={isSending}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
