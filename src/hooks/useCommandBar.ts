import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

const RECENT_KEY = 'helmos-command-history'
const MODEL_KEY = 'helmos-selected-model'

export interface Suggestion {
  text: string
  category: string
  icon: string
}

const allSuggestions: Suggestion[] = [
  { text: 'Deep research on...', category: 'Quick Actions', icon: '🔍' },
  { text: 'Run security audit', category: 'Quick Actions', icon: '🛡️' },
  { text: 'Check agent health', category: 'Quick Actions', icon: '❤️' },
  { text: 'Draft email to {recipient} about {topic}', category: 'Templates', icon: '✉️' },
  { text: 'Analyze {file} and summarize', category: 'Templates', icon: '📄' },
  { text: 'Generate weekly report for {team}', category: 'Templates', icon: '📊' },
]

const models = ['Auto-route', 'Claude 4', 'GPT-5', 'DeepSeek V4', 'Local (Ollama)']

function getRecent(): Suggestion[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw).map((text: string) => ({ text, category: 'Recent', icon: '🕐' })) : []
  } catch {
    return []
  }
}

function saveRecent(command: string) {
  const recent = getRecent().map((s) => s.text)
  const next = [command, ...recent.filter((c) => c !== command)].slice(0, 5)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

export function useCommandBar(onSubmit: (command: string, model: string) => void | Promise<void>) {
  const [value, setValue] = useState('')
  const [model, setModel] = useState(() => localStorage.getItem(MODEL_KEY) ?? 'Auto-route')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [flash, setFlash] = useState<'success' | 'error' | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const suggestions = useMemo(() => {
    if (value.length < 2) return []
    const q = value.toLowerCase()
    const recents = getRecent().filter((s) => s.text.toLowerCase().includes(q))
    const matching = allSuggestions.filter((s) => s.text.toLowerCase().includes(q))
    return [...recents, ...matching]
  }, [value])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [suggestions])

  useEffect(() => {
    localStorage.setItem(MODEL_KEY, model)
  }, [model])

  const resize = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 96) + 'px'
  }, [])

  useEffect(() => {
    resize()
  }, [value, resize])

  const handleSubmit = useCallback(async () => {
    const trimmed = value.trim()
    if (!trimmed || isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSubmit(trimmed, model)
      saveRecent(trimmed)
      setValue('')
      setFlash('success')
      setTimeout(() => setFlash(null), 500)
    } catch {
      setFlash('error')
      setTimeout(() => setFlash(null), 500)
    } finally {
      setIsSubmitting(false)
    }
  }, [value, isSubmitting, onSubmit, model])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1))
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault()
          setValue(suggestions[selectedIndex].text)
        } else if (e.key === 'Enter' && !e.shiftKey && selectedIndex === -1) {
          e.preventDefault()
          handleSubmit()
        } else if (e.key === 'Escape') {
          setSelectedIndex(-1)
        } else if (e.key === 'Tab' && suggestions.length > 0) {
          e.preventDefault()
          setValue(suggestions[0].text)
        }
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [suggestions, selectedIndex, handleSubmit]
  )

  const selectSuggestion = useCallback((text: string) => {
    setValue(text)
    inputRef.current?.focus()
  }, [])

  return {
    value,
    setValue,
    model,
    setModel,
    isSubmitting,
    flash,
    selectedIndex,
    suggestions,
    models,
    inputRef,
    handleSubmit,
    handleKeyDown,
    selectSuggestion,
  }
}
