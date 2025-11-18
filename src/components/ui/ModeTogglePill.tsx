'use client'

import { Moon, Sun, Utensils, Calendar, BookOpen } from 'lucide-react'

interface ModeTogglePillProps {
  active?: boolean
  label: string
  icon: 'moon' | 'sun' | 'utensils' | 'calendar' | 'book'
  className?: string
  onClick?: () => void
}

const iconMap = {
  moon: Moon,
  sun: Sun,
  utensils: Utensils,
  calendar: Calendar,
  book: BookOpen,
}

export function ModeTogglePill({
  active = false,
  label,
  icon,
  className = '',
  onClick,
}: ModeTogglePillProps) {
  const Icon = iconMap[icon]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        coco-glass-pill coco-ripple
        px-4 py-2.5
        flex items-center gap-2.5
        transition-all duration-300
        ${active ? 'ring-2 ring-yellow-400/60 ring-offset-1' : 'hover:bg-white/5'}
        ${className}
      `.trim()}
    >
      <span className="glass-icon-circle w-9 h-9 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </span>
      <span className="glass-text-strong text-sm font-medium">
        {label}
      </span>
    </button>
  )
}
