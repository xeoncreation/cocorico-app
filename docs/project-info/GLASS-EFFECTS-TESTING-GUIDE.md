# GLASS EFFECTS VISUAL TESTING GUIDE

## How to Test Premium Effects

### 1. Testing Premium Glow Animation

**Setup**:
1. Open browser DevTools (F12)
2. Navigate to Elements tab
3. Find `<html>` element
4. Manually add class: `coco-premium`

**Expected Result**:
- All elements with `.glass-card`, `.glass-pill`, `.glass-icon-circle` classes should show a subtle breathing glow effect
- Shadow should pulse yellow/golden color every 3 seconds (6s full cycle)
- Effect should be smooth, not jarring

**To Test Without Premium Account**:
```javascript
// Run in Console
document.documentElement.classList.add('coco-premium');
```

**To Test Premium-Specific Components**:
```tsx
// Add `premium-glow` class to any glass element
<Card className="coco-glass-card premium-glow">
  <CardContent>This card will glow when coco-premium is active</CardContent>
</Card>
```

---

### 2. Testing Ripple Effect

**Setup**:
1. Find any button on the page
2. Click and hold (don't release immediately)

**Expected Result**:
- White radial circle expands from click point
- Opacity fades from 0.7 to 0
- Expansion completes in ~450ms
- Effect feels responsive and tactile

**Elements with Ripple**:
- All `<Button>` components (automatic via base className)
- All `<ModeTogglePill>` components
- Custom elements with `.coco-ripple` class

**Test Multiple Clicks**:
- Rapid clicking should trigger multiple overlapping ripples
- No visual glitches or stuttering

---

### 3. Testing Glass Card Variants

**Color Variants to Test**:
```tsx
// Orange variant
<Card className="coco-glass-card glass-card-orange">
  Orange tinted glass
</Card>

// Green variant
<Card className="coco-glass-card glass-card-green">
  Green tinted glass
</Card>

// Red variant
<Card className="coco-glass-card glass-card-red">
  Red tinted glass
</Card>

// Blue variant
<Card className="coco-glass-card glass-card-blue">
  Blue tinted glass
</Card>

// Purple variant
<Card className="coco-glass-card glass-card-purple">
  Purple tinted glass
</Card>
```

**Expected Result**:
- Each variant shows subtle color tint in glass background
- Border color shifts to match tint
- Text remains legible with `glass-text-strong` class
- Highlight gradient (top edge) remains white/subtle

---

### 4. Testing Theme Switching (Free vs Premium)

**Free Theme Test**:
```javascript
// Set data-theme to free
document.documentElement.dataset.theme = 'free';
document.documentElement.classList.remove('coco-premium');
```

**Expected Free Theme Characteristics**:
- Blur: 22px (lighter, softer)
- Tint: White/bright (rgba(255,255,255,0.18))
- Border: Lighter (rgba(255,255,255,0.55))
- No glow animation

**Premium Theme Test**:
```javascript
// Set data-theme to premium
document.documentElement.dataset.theme = 'premium';
document.documentElement.classList.add('coco-premium');
```

**Expected Premium Theme Characteristics**:
- Blur: 26px (heavier, more frosted)
- Tint: Darker slate (rgba(15,23,42,0.28))
- Border: Brighter (rgba(244,244,245,0.65))
- Glow animation active on `.premium-glow` elements

---

### 5. Testing AppBackground Wallpapers

**Variant Tests**:
```tsx
// Home variant
<AppBackground variant="home">
  {/* Content */}
</AppBackground>

// Learn variant
<AppBackground variant="learn">
  {/* Content */}
</AppBackground>

// Stats variant
<AppBackground variant="stats">
  {/* Content */}
</AppBackground>

// Community variant
<AppBackground variant="community">
  {/* Content */}
</AppBackground>

// Profile variant (NEW)
<AppBackground variant="profile">
  {/* Content */}
</AppBackground>
```

**Expected Result**:
- Background image loads with heavy blur (blur-3xl)
- Image scaled to 105% (covers edges during scroll)
- Opacity at 70% (content remains legible)
- Fixed positioning (no scroll parallax)
- Fallback to gradient background if image fails

**Manual Test**:
1. Check Network tab: wallpaper images loading
2. Verify blur applied in Computed styles
3. Test scroll behavior: background stays fixed
4. Test on slow 3G: graceful fallback during load

---

### 6. Testing ModeTogglePill Component

**Basic Usage Test**:
```tsx
<ModeTogglePill
  active={true}
  label="Test Mode"
  icon="utensils"
  onClick={() => console.log('Clicked!')}
/>
```

**Expected Active State**:
- Ring border: `ring-2 ring-yellow-400/60 ring-offset-1`
- Glass pill background with highlight
- Icon inside glass-icon-circle (9x9 size)
- Ripple effect on click

**Expected Inactive State**:
- No ring border
- Hover shows subtle background change (bg-white/5)
- Still has ripple effect

**Icons to Test**:
- `icon="moon"` → Moon icon
- `icon="sun"` → Sun icon
- `icon="utensils"` → Utensils icon
- `icon="calendar"` → Calendar icon
- `icon="book"` → BookOpen icon

---

### 7. Testing XpHud Component

**Setup**:
1. Navigate to dashboard (`/dashboard`)
2. Locate XP display at top of page

**Expected Elements**:
- Trophy icon (Lucide icon)
- Level number: "Nivel {level}"
- XP count: "{xp} XP"
- Progress bar showing XP towards next level
- Gradient bar: yellow → orange → red

**Test XP Progression**:
1. Complete a learn module
2. XP should increment by +25
3. Progress bar should update immediately
4. Level should recalculate if XP crosses threshold (100, 200, 300, etc.)

**Formula Verification**:
```javascript
// Level calculation
const level = Math.floor(xp / 100) + 1;

// Examples:
// 0-99 XP → Level 1
// 100-199 XP → Level 2
// 200-299 XP → Level 3
```

---

### 8. Responsive Testing Checklist

**320px (iPhone SE)**:
```css
/* Test these breakpoints in DevTools */
width: 320px;
```
- [ ] No horizontal scroll
- [ ] Glass cards stack vertically
- [ ] Text size readable (≥14px)
- [ ] Touch targets ≥44px
- [ ] Ripple effect visible on tap

**375px (iPhone 12/13)**:
```css
width: 375px;
```
- [ ] Glass effects render properly
- [ ] Backdrop-filter supported (iOS 9+)
- [ ] Buttons have adequate spacing
- [ ] ModeTogglePill labels don't truncate

**768px (iPad)**:
```css
width: 768px;
```
- [ ] Two-column layouts work
- [ ] Glass not overused (balance with solid elements)
- [ ] Navigation accessible
- [ ] Landscape orientation OK

---

### 9. Performance Testing

**Chrome DevTools Performance Tab**:
1. Start recording
2. Scroll through page with glass elements
3. Stop recording
4. Check for:
   - FPS drops below 60fps
   - Long paint times (>16ms)
   - Layout thrashing

**Expected Benchmarks**:
- Scroll FPS: ≥50fps on mobile, 60fps on desktop
- First Paint: <1.8s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

**If Performance Issues**:
- Reduce glass elements to headers/key components only
- Remove backdrop-filter on long lists
- Use CSS `will-change: backdrop-filter` sparingly

---

### 10. Accessibility Testing

**Keyboard Navigation**:
1. Tab through all interactive elements
2. Check focus visible on:
   - Buttons (ring appears)
   - ModeTogglePill (focus ring)
   - Form inputs
3. Enter/Space activates buttons

**Screen Reader Testing (NVDA/JAWS)**:
1. Navigate to glass cards
2. Verify:
   - Card titles announced
   - Button labels clear
   - Background images ignored (aria-hidden)

**Color Contrast**:
1. Use Chrome DevTools Accessibility panel
2. Check contrast ratios:
   - Normal text: ≥4.5:1 (WCAG AA)
   - Large text (≥18px): ≥3:1
   - `.glass-text-strong` should pass

---

## Quick Test Commands

```javascript
// In browser console:

// 1. Enable premium theme
document.documentElement.dataset.theme = 'premium';
document.documentElement.classList.add('coco-premium');

// 2. Disable premium theme
document.documentElement.dataset.theme = 'free';
document.documentElement.classList.remove('coco-premium');

// 3. Force glow on all glass elements
document.querySelectorAll('.glass-card, .glass-pill, .glass-icon-circle').forEach(el => {
  el.classList.add('premium-glow');
});

// 4. Check computed backdrop-filter
const card = document.querySelector('.glass-card');
console.log(getComputedStyle(card).backdropFilter);
// Expected: blur(22px) for free, blur(26px) for premium

// 5. Test ripple on click
document.querySelectorAll('.coco-ripple').forEach(el => {
  el.addEventListener('click', (e) => {
    console.log('Ripple triggered on:', e.target);
  });
});
```

---

## Visual Comparison Checklist

| Feature | Free Theme | Premium Theme |
|---------|-----------|---------------|
| Blur Amount | 22px | 26px |
| Tint Color | Light (white) | Dark (slate) |
| Border Brightness | Subtle | Brighter |
| Glow Animation | ❌ None | ✅ 6s breathing |
| Overall Feel | Clean, light | Frosted, luxurious |

---

## Common Issues & Fixes

### Issue: Backdrop-filter not working
**Cause**: Browser doesn't support (very old browsers)  
**Fix**: Graceful fallback with solid background color already in place

### Issue: Glow animation not visible
**Cause**: Missing `coco-premium` class on root  
**Fix**: Verify `useTheme` hook in ThemeProvider is running

### Issue: Ripple animation stutters
**Cause**: Too many simultaneous animations  
**Fix**: Reduce animation complexity or debounce rapid clicks

### Issue: Glass text not readable
**Cause**: Missing `glass-text-strong` class  
**Fix**: Add class to all headings/labels on glass surfaces

### Issue: Performance drops on mobile
**Cause**: Too many backdrop-filter elements  
**Fix**: Apply glass only to hero sections and key cards, not entire page

---

**Happy Testing!** ✨
