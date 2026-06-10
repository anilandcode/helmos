export function focusTrap(container: HTMLElement) {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  function handleKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKey)

  return () => container.removeEventListener('keydown', handleKey)
}

export function announce(message: string) {
  const el = document.createElement('div')
  el.setAttribute('aria-live', 'assertive')
  el.setAttribute('aria-atomic', 'true')
  el.className = 'sr-only'
  el.textContent = message
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 3000)
}
