# Modern Navbar Redesign Plan

## Design Principles (Based on 2025 Trends)

### 1. Visual Hierarchy & Spacing
- **Logo**: Standalone, no glass background (differentiator)
- **Main Nav**: Tight group (gap-2)
- **Features**: Separated group with visual divider (gap-2)
- **Actions**: Separated group with divider (gap-3)
- **Between groups**: 32px (gap-8)

### 2. Glassmorphism Updates
- **Reduce blur**: 12px instead of 16px (less aggressive)
- **Subtle borders**: 1px rgba(255,255,255,0.2)
- **No heavy shadows**: Use ring-1 for hover states
- **Smooth transitions**: 200ms ease-out

### 3. Typography
- **Font weight**: Bold (700) instead of Extrabold (800)
- **Tracking**: tight (-0.025em) for clean look
- **Size**: text-sm for consistency

### 4. Interactive States
- **Active**: ring-2 with brand color
- **Hover**: ring-1 with white/20
- **Scale**: 1.02 (subtle, not 1.05)
- **Duration**: 200ms (snappier)

### 5. Split Buttons
- **Unified design**: Single glass container
- **Border separator**: 1px white/10 between parts
- **Width for arrow**: Fixed 40px (10 units)
- **No negative margin**: Clean separation

## Implementation Steps

1. Update coco-glass to reduce blur
2. Redesign navbar layout with proper grouping
3. Add visual separators (gradient lines)
4. Update button styles (reduce extrabold to bold)
5. Refine hover/active states
6. Test responsiveness

## Expected Outcome
- Clean, modern, professional appearance
- Clear visual hierarchy
- Elements don't touch
- Breathing room throughout
- Commercially irresistible UI
