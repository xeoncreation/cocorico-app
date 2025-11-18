// Example: Using ModeTogglePill in a cooking modes selector

'use client'

import { useState } from 'react'
import { ModeTogglePill } from '@/components/ui/ModeTogglePill'

type CookingMode = 'quick' | 'batch' | 'learn'

export function CookingModeSelector() {
  const [activeMode, setActiveMode] = useState<CookingMode>('quick')

  return (
    <div className="coco-glass-card p-6">
      <h3 className="glass-text-strong text-lg font-semibold mb-4">
        Selecciona tu modo de cocina
      </h3>
      <div className="flex flex-wrap gap-3">
        <ModeTogglePill
          active={activeMode === 'quick'}
          label="Cocina Rápida"
          icon="utensils"
          onClick={() => setActiveMode('quick')}
        />
        <ModeTogglePill
          active={activeMode === 'batch'}
          label="Batch Cooking"
          icon="calendar"
          onClick={() => setActiveMode('batch')}
        />
        <ModeTogglePill
          active={activeMode === 'learn'}
          label="Modo Aprender"
          icon="book"
          onClick={() => setActiveMode('learn')}
        />
      </div>
      
      {/* Mode-specific content */}
      <div className="mt-6">
        {activeMode === 'quick' && (
          <p className="text-sm text-muted-foreground">
            Recetas rápidas para el día a día (≤30 minutos)
          </p>
        )}
        {activeMode === 'batch' && (
          <p className="text-sm text-muted-foreground">
            Cocina una vez, come toda la semana (meal prep)
          </p>
        )}
        {activeMode === 'learn' && (
          <p className="text-sm text-muted-foreground">
            Tutoriales paso a paso con técnicas de cocina
          </p>
        )}
      </div>
    </div>
  )
}
