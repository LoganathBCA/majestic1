---
name: mobile-optimizer
description: >
  Optimize web apps, React/Vue components, and HTML pages for mobile devices with deep UI and UX precision.
  Activate this skill whenever the user mentions: mobile responsiveness, touch interactions, small screens,
  mobile layout issues, viewport problems, tap targets, mobile performance, swipe gestures, bottom navigation,
  thumb-zone design, safe area insets, iOS/Android-specific bugs, mobile typography, or wants to "make it
  look good on mobile". Also trigger when reviewing a component for production readiness — mobile quality
  is part of that standard. Don't wait for the user to explicitly say "mobile skill"; if the context
  involves a real-world UI and mobile quality matters, use this skill.
---

# Mobile Optimizer

A precision skill for transforming web interfaces into world-class mobile experiences. Mobile is not a
degraded version of desktop — it is a distinct interaction paradigm with its own physics, ergonomics,
and user expectations. This skill bridges that gap through systematic, expert-level optimization.

---

## Phase 1 — Mobile Audit

Before making any changes, audit the current state. Understand what exists before prescribing fixes.

### 1.1 Visual & Layout Audit

Inspect the component or page for these common failure modes:

| Problem | Symptoms |
|---|---|
| Fixed pixel widths | Horizontal scroll, clipped content |
| No viewport meta tag | Browser zooms out to fit desktop layout |
| Overflow not hidden | Ghost scroll / invisible horizontal space |
| Absolute positioning without bounds | Elements float off-screen |
| Desktop-only grid/flex | 3–4 col grid that crushes on mobile |
| Unresponsive images | Images overflow or stretch |
| Z-index layering failures | Modals hidden behind navbars on mobile |

**Run this audit checklist mentally or by reading the code:**

- [ ] Is `<meta name="viewport" content="width=device-width, initial-scale=1">` present in `index.html`?
- [ ] Are widths defined in `px` instead of `%`, `vw`, `rem`, or `clamp()`?
- [ ] Does the layout use `overflow-x: hidden` at the root where needed?
- [ ] Are images declared with `max-width: 100%` and `height: auto`?
- [ ] Are there any hard-coded heights that will break on small screens?
- [ ] Is text readable without zooming (min 16px base, 14px secondary)?

### 1.2 Interaction Audit

Evaluate all interactive elements:

- [ ] Are tap targets at least **44×44px** (Apple HIG) / **48×48dp** (Material Design)?
- [ ] Is there sufficient spacing between tappable elements (min 8px gap)?
- [ ] Do hover-only states exist with no touch equivalent?
- [ ] Are form inputs large enough (min `height: 48px`, `font-size: 16px` to prevent iOS auto-zoom)?
- [ ] Does any element rely on `cursor: pointer` hover as the only affordance?
- [ ] Are custom scroll areas scrollable with touch (check `overflow: auto` vs `hidden`)?
- [ ] Does the interface use `pointer: fine` media query assumptions without `pointer: coarse` fallback?

### 1.3 Performance Audit (Mobile-First)

Mobile devices have slower CPUs and throttled connections. Check:

- [ ] Are large images unoptimized or not lazy-loaded?
- [ ] Are heavy animations running on non-composited properties (avoid animating `width`, `height`, `top`, `left`)?
- [ ] Are there layout-thrashing reads/writes inside scroll/resize listeners?
- [ ] Is `will-change` used sparingly and only on animated elements?
- [ ] Are fonts loaded with `font-display: swap`?

---

## Phase 2 — Responsive Layout Restructuring

Apply these patterns when restructuring for mobile. Always use a **mobile-first** CSS approach: write base
styles for mobile, then add `min-width` media queries for larger screens.

### 2.1 Breakpoint System

Use a consistent 4-tier breakpoint system:

```css
/* Mobile first — no media query needed for base styles */
/* sm: Small tablets */
@media (min-width: 480px) { ... }
/* md: Tablets / large phones landscape */
@media (min-width: 768px) { ... }
/* lg: Desktop */
@media (min-width: 1024px) { ... }
/* xl: Wide desktop */
@media (min-width: 1280px) { ... }
```

For React/Tailwind projects, map these to `sm:`, `md:`, `lg:`, `xl:` prefixes.

### 2.2 Fluid Typography

Replace fixed `px` font sizes with fluid scaling using `clamp()`:

```css
/* Pattern: clamp(min, preferred, max) */
h1 { font-size: clamp(1.5rem, 5vw, 3rem); }
h2 { font-size: clamp(1.25rem, 4vw, 2.25rem); }
p  { font-size: clamp(0.9rem, 2.5vw, 1rem); }
```

Never set `font-size` below `14px` on mobile. Use `16px` on all `<input>` elements to prevent iOS Safari
auto-zoom on focus.

### 2.3 Spacing Scale

Use a consistent spacing scale based on `rem` or CSS custom properties:

```css
:root {
  --space-xs:  0.25rem;  /* 4px  */
  --space-sm:  0.5rem;   /* 8px  */
  --space-md:  1rem;     /* 16px */
  --space-lg:  1.5rem;   /* 24px */
  --space-xl:  2rem;     /* 32px */
  --space-2xl: 3rem;     /* 48px */
}
```

On mobile, section padding should be at least `var(--space-md)` (16px) on each side. Never use `0` padding
on mobile containers — content should breathe.

### 2.4 Layout Patterns

**Card grids** — switch from multi-column to single or 2-column:

```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr;            /* mobile: 1 col */
  gap: var(--space-md);
}
@media (min-width: 480px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
```

**Navigation** — convert desktop horizontal nav to mobile-friendly pattern:

- Use a hamburger menu or bottom navigation bar for main nav
- Sticky bottom nav works best for apps (thumb-zone reachable)
- Sticky top header should be compact (max `56px` height on mobile)

**Tables** — make responsive:

```css
/* Option 1: Horizontal scroll wrapper */
.table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* Option 2: Card-style transform at mobile */
@media (max-width: 600px) {
  table, thead, tbody, th, td, tr { display: block; }
  td::before { content: attr(data-label); font-weight: bold; }
  thead tr { position: absolute; top: -9999px; left: -9999px; }
}
```

---

## Phase 3 — Touch Interaction Design

### 3.1 Touch Target Sizing

All interactive elements must meet minimum touch target standards:

```css
/* Minimum tap target for any button, link, or interactive element */
.btn, a, button, [role="button"] {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;  /* generous padding */
}
```

For icon-only buttons (close, menu, back), ensure the touchable area is large even if the icon is small:

```css
.icon-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* icon inside may be 20px — the button is 44px */
}
```

### 3.2 Thumb Zone Awareness

Design interactive elements according to the thumb ergonomics of one-handed phone use:

```
┌────────────────┐
│  ❌ Hard reach  │  ← Danger zone: back buttons, secondary actions
│                │
│  ⚠️ Stretch    │  ← Neutral zone: secondary CTAs, nav items
│                │
│  ✅ Easy reach  │  ← Comfort zone: primary CTA, main nav, FAB
└────────────────┘
    (bottom 35%)
```

**Rules:**
- Place primary CTAs and FABs in the bottom comfort zone
- Use bottom navigation bars for frequently accessed routes
- Avoid placing critical actions at the very top of a long screen

### 3.3 Gesture Conflicts

Avoid custom swipe gestures that conflict with browser/OS gestures:

| System Gesture | Direction | Avoid custom conflict |
|---|---|---|
| iOS back swipe | Left-edge → right | Don't add left-swipe on full width |
| Android back | System back | Don't block `popstate` |
| Pull-to-refresh | Top → down | Disable if implementing custom pull-to-refresh |
| Tab bar swipe | Left/right between tabs | Coordinate with router |

For swipe-based carousels and drawers, constrain gesture areas and use `touch-action` CSS:

```css
/* Allow vertical scroll but intercept horizontal swipe for carousel */
.carousel { touch-action: pan-y; }

/* Allow horizontal scroll but not vertical (e.g., horizontal scroll list) */
.scroll-row { touch-action: pan-x; }
```

### 3.4 Fast Tap (Remove 300ms Delay)

Eliminate tap delay on older mobile browsers:

```css
/* Modern fix: touch-action tells browser not to wait for double-tap */
html { touch-action: manipulation; }
```

Or in JS for older support:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

### 3.5 Active/Pressed States

Mobile has no hover — use `:active` and focus states:

```css
.btn:active {
  transform: scale(0.97);
  opacity: 0.85;
  transition: transform 0.1s ease, opacity 0.1s ease;
}

/* Remove ugly default tap highlight on Android */
* { -webkit-tap-highlight-color: transparent; }

/* But keep visible focus for keyboard/accessibility */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}
```

---

## Phase 4 — Mobile UX Patterns

### 4.1 Forms on Mobile

Forms are where mobile UX most commonly breaks. Apply all of these:

```css
/* Inputs must be large enough on mobile */
input, textarea, select {
  font-size: 16px;          /* Prevents iOS auto-zoom on focus */
  min-height: 48px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}
```

**Input type optimization** — use correct `type` to trigger native keyboard:

| Field | Input type | Mobile keyboard |
|---|---|---|
| Email | `type="email"` | Shows @ symbol |
| Phone | `type="tel"` | Numeric keypad |
| Number | `type="number"` | Numeric keypad |
| URL | `type="url"` | Shows .com button |
| Search | `type="search"` | Shows search key |
| Password | `type="password"` | Masks input |

**`inputmode` attribute** — finer keyboard control:

```html
<!-- Currency: numeric keyboard without arrows -->
<input inputmode="decimal" type="text" placeholder="0.00">
<!-- OTP: large numeric keyboard -->
<input inputmode="numeric" type="text" maxlength="6">
```

**Autocomplete** — use `autocomplete` attributes to help password managers and autofill:

```html
<input autocomplete="name" />
<input autocomplete="email" />
<input autocomplete="new-password" />
<input autocomplete="cc-number" inputmode="numeric" />
```

**Submit button placement:** Put the submit/CTA button at the **bottom** of the form so it's reachable after filling fields. Always show it above the fold if the form is short.

### 4.2 Navigation Patterns

**Bottom Tab Bar** — best for apps with 3–5 main sections:

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--surface);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid var(--border);
  padding-bottom: env(safe-area-inset-bottom); /* iPhone notch */
  z-index: 100;
}
```

**Hamburger Drawer** — use for complex nav trees. Animate from left:

```css
.drawer {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: min(320px, 85vw);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 200;
}
.drawer.open { transform: translateX(0); }
```

Always add a backdrop overlay and allow tapping outside to close.

### 4.3 Loading & Skeleton States

Mobile users on slow connections need visual feedback immediately:

```css
/* Skeleton shimmer animation */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 4px;
}
```

Use skeleton screens instead of spinners for content areas. Use a spinner only for brief actions (< 1s).

### 4.4 Modals & Sheets on Mobile

Full-screen modals are disorienting on mobile. Prefer bottom sheets:

```css
.bottom-sheet {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  border-radius: 20px 20px 0 0;
  max-height: 90vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 1.5rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom));
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.bottom-sheet.open { transform: translateY(0); }
```

Add a drag handle at the top of the sheet:

```css
.sheet-handle {
  width: 40px; height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin: 0 auto 1.25rem;
}
```

### 4.5 Scroll Experience

```css
/* Smooth momentum scrolling on iOS */
.scroll-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain; /* prevent scroll chaining */
}

/* Hide scrollbar but keep scroll functionality */
.scroll-container::-webkit-scrollbar { display: none; }
.scroll-container { scrollbar-width: none; ms-overflow-style: none; }
```

**Infinite scroll or pagination?** On mobile, prefer "Load More" button over auto-loading infinite scroll
to avoid scroll-position loss on back navigation.

---

## Phase 5 — Safe Area & Device-Specific Fixes

### 5.1 Safe Area Insets (Notch / Dynamic Island / Home Indicator)

```css
/* Always add this to root layout */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* For fixed bottom elements, add inset to their padding */
.fixed-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

The viewport meta tag must include `viewport-fit=cover` to enable these insets:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

### 5.2 iOS-Specific Quirks

| Issue | Fix |
|---|---|
| `position: fixed` jittering in Safari | Use `position: sticky` where possible; add `-webkit-overflow-scrolling: touch` to scroll containers |
| Input zoom on focus | Set `font-size: 16px` on all inputs |
| Overscroll rubber-band on body | `body { overscroll-behavior: none; }` — use cautiously |
| Tap delay on links | `html { touch-action: manipulation; }` |
| `vh` unit includes address bar | Use `dvh` (dynamic viewport height) or `100svh` instead of `100vh` |
| Focus scroll jumps | Set `scroll-behavior: smooth` and check `scrollIntoView()` options |

### 5.3 Android-Specific Quirks

| Issue | Fix |
|---|---|
| Soft keyboard pushes layout | Use `window.visualViewport` resize event instead of `window.resize` |
| `position: fixed` jumps when keyboard opens | Listen to `visualViewport.resize` and reposition manually |
| Chrome pull-to-refresh conflicts | Add `overscroll-behavior-y: contain` on scrollable containers |
| Text size adjustment | `text-size-adjust: 100%; -webkit-text-size-adjust: 100%;` |

### 5.4 PWA / Standalone Mode

If the app is installable as a PWA, add:

```css
/* Hide browser chrome (Safari iOS, Chrome Android) */
@media (display-mode: standalone) {
  /* Apply safe-area padding, hide browser-only UI elements */
  .browser-only-banner { display: none; }
}
```

```html
<!-- Manifest + theme color for browser chrome -->
<meta name="theme-color" content="#your-brand-color">
<link rel="manifest" href="/manifest.json">
```

---

## Phase 6 — Mobile Performance

### 6.1 Image Optimization

```html
<!-- Use srcset for responsive images -->
<img
  src="product-400.webp"
  srcset="product-400.webp 400w, product-800.webp 800w, product-1200.webp 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 400px"
  loading="lazy"
  decoding="async"
  alt="Product name"
>
```

Always use **WebP** format. For hero images above the fold, use `loading="eager"` and `fetchpriority="high"`.

### 6.2 Animation Performance

Only animate **composited properties** to avoid layout/paint overhead:

```css
/* ✅ Composited: GPU-accelerated */
transform: translateX(), translateY(), scale(), rotate()
opacity

/* ❌ Non-composited: triggers layout */
width, height, top, left, margin, padding, border
```

For complex animations, promote the element to its own compositing layer:

```css
.animated-element {
  will-change: transform;       /* use sparingly */
  transform: translateZ(0);     /* fallback */
}
```

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

### 6.3 Critical CSS & Render Blocking

```html
<!-- Inline critical above-the-fold CSS directly in <style> tag -->
<style>
  /* Critical path CSS — no layout shift on first paint */
  body { margin: 0; font-family: sans-serif; }
  .hero { ... }
</style>

<!-- Load non-critical CSS async -->
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
```

---

## Phase 7 — Accessibility on Mobile

### 7.1 Touch Accessibility

- Ensure all interactive elements are reachable via swipe navigation (screen reader) with proper `aria-label`
- Don't rely on `title` attributes — not accessible on touch
- Ensure modals trap focus and return focus on close
- Use `aria-live` regions for dynamic content updates

### 7.2 Color Contrast on Small Screens

Mobile screens are often used outdoors in bright sunlight. Ensure contrast ratios exceed:

- **Normal text**: 4.5:1 minimum (7:1 recommended)
- **Large text** (18px+ or 14px+ bold): 3:1 minimum
- **UI components**: 3:1 against adjacent colors

### 7.3 Screen Reader & VoiceOver

```html
<!-- Landmark regions for navigation -->
<header role="banner">...</header>
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<footer>...</footer>

<!-- Icon buttons need accessible labels -->
<button aria-label="Close menu">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Skip link for keyboard users -->
<a href="#main" class="skip-link">Skip to content</a>
```

---

## Output Format

When applying this skill, structure your response as follows:

### 🔍 Mobile Audit Summary

List what was found (2–5 key issues). Be specific — quote CSS properties or component names.

### 🛠 Changes Applied

Group by phase. For each change:
- **What changed**: Brief description
- **Why**: The UX/performance/accessibility reason
- **Code**: Diff or full updated code block

### ✅ Mobile Checklist Status

After changes, show which items from the audit checklist are now resolved.

### 🧪 Testing Recommendations

Always end with at least 3 concrete testing steps:
1. Test on real device (iPhone SE + Android mid-range)
2. Use Chrome DevTools mobile emulation for breakpoints
3. Test with keyboard and VoiceOver/TalkBack enabled
4. Run Lighthouse Mobile audit (target 90+ Performance)
5. Test with throttled network: Slow 4G preset

---

## Quick Reference

### Mobile-Critical CSS Snippet

```css
/* === MOBILE FOUNDATION — paste into root stylesheet === */

/* 1. Viewport */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; overflow-x: hidden; -webkit-text-size-adjust: 100%; }

/* 2. Images */
img, video, svg { max-width: 100%; height: auto; display: block; }

/* 3. Tap behavior */
html { touch-action: manipulation; }
* { -webkit-tap-highlight-color: transparent; }
:focus-visible { outline: 2px solid var(--color-focus, #0066cc); outline-offset: 3px; }

/* 4. Safe areas */
.safe-area-padding {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }

/* 5. Touch targets */
button, a, [role="button"], input[type="submit"] { min-height: 44px; min-width: 44px; }

/* 6. Inputs (prevent iOS zoom) */
input, select, textarea { font-size: max(16px, 1rem); }

/* 7. Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### Device Dimensions Cheat Sheet

| Device | Screen (CSS px) | Device Pixel Ratio |
|---|---|---|
| iPhone SE (2022) | 375 × 667 | @2x |
| iPhone 14 / 15 | 390 × 844 | @3x |
| iPhone 14 Pro Max | 430 × 932 | @3x |
| Samsung Galaxy S23 | 360 × 780 | @3x |
| Google Pixel 7 | 412 × 915 | @2.6x |
| iPad Mini | 768 × 1024 | @2x |
| iPad Pro 12.9" | 1024 × 1366 | @2x |
