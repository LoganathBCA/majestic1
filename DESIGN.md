---
name: SmashPro Elite Performance System
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#44474d'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#75777e'
  outline-variant: '#c5c6cd'
  surface-tint: '#515f78'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0d1c32'
  on-primary-container: '#76849f'
  inverse-primary: '#b9c7e4'
  secondary: '#0050cc'
  on-secondary: '#ffffff'
  secondary-container: '#0266ff'
  on-secondary-container: '#f9f7ff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b1701'
  on-tertiary-container: '#9f7d5b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#dae1ff'
  secondary-fixed-dim: '#b3c5ff'
  on-secondary-fixed: '#001849'
  on-secondary-fixed-variant: '#003fa4'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#e7bf99'
  on-tertiary-fixed: '#2b1701'
  on-tertiary-fixed-variant: '#5d4124'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
  button:
    fontFamily: Archivo Narrow
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for an elite sports audience that values technical precision over flashy aesthetics. The brand personality is authoritative, professional, and high-performance, mirroring the quality of pro-grade equipment used in tennis, golf, or technical athletics.

The visual style follows a **Corporate / Modern** aesthetic with a heavy emphasis on **Minimalism**. By utilizing expansive whitespace and a restrained color palette, the UI builds consumer trust and allows product photography to take center stage. The emotional response should be one of focused confidence—removing "visual noise" to emphasize the performance metrics and engineering behind the gear.

## Colors

The palette is anchored by **Elite Navy**, providing a foundation of authority and institutional trust. **Performance Blue** serves as the primary action color, injecting energy and movement into the interface without the urgency or "danger" associated with warmer tones.

**Pro White** is the primary canvas color to maintain an airy, premium feel. **Technical Gray** is reserved for surface-level containers, input backgrounds, and subtle dividers to define structure without breaking the minimal aesthetic. Status indicators should remain muted: use Performance Blue for information and a deep forest green for success; avoid high-saturation reds unless indicating a critical system error.

## Typography

Typography is a primary tool for establishing the "technical" feel of the design system. **Archivo Narrow** is used for all headings and interactive triggers (buttons). Its condensed nature mimics technical spec sheets and scoreboard aesthetics, conveying speed and efficiency.

**Inter** is utilized for all body copy and data points to ensure maximum legibility at smaller sizes. To maintain the premium feel, use tight tracking for headings and generous line heights for body copy. All labels and buttons should use uppercase Archivo Narrow to differentiate "actions" from "information."

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop to maintain a controlled, editorial appearance. 
- **Desktop (1440px+):** 12-column grid, 1120px max-width container, 24px gutters, and 64px side margins.
- **Tablet (768px - 1024px):** 8-column grid, fluid width, 24px margins.
- **Mobile (below 768px):** 4-column fluid grid, 16px margins.

Spacing follows an 8pt rhythm for structural elements, while 4pt increments are used for fine-tuning internal component padding. High-performance layouts should prioritize "airy" vertical spacing (using the `xl` unit) between major sections to prevent the interface from feeling cluttered or "discount."

## Elevation & Depth

To maintain a clean and professional look, the design system utilizes **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. 

Depth is communicated through:
- **Surface Tiers:** Background is White (#FFFFFF). Cards and secondary sections use Technical Gray (#F8F9FA).
- **Borders:** 1px solid strokes in a slightly darker gray (#E9ECEF) define containers. 
- **Subtle Ambient Shadow:** Only used for floating elements like dropdowns or modals. Use a very soft, multi-layered shadow: `0px 4px 20px rgba(10, 25, 47, 0.05)`. 

Avoid any blurring effects or glow styles; the interface should feel grounded and structural.

## Shapes

The design system uses a **Soft (Level 1)** roundedness profile. A radius of 4px (`0.25rem`) is the standard for buttons, inputs, and small cards. This subtle rounding removes the harshness of a "0px" corner while maintaining a sharp, technical, and precise edge suitable for a pro-grade sports brand.

Large containers or hero sections should never exceed an 8px (`0.5rem`) radius. This consistency reinforces the "engineered" feel of the brand.

## Components

### Buttons
- **Primary:** Solid Elite Navy with white text. High contrast, sharp (4px radius).
- **Secondary:** Solid Performance Blue for "Add to Cart" or energy-focused actions.
- **Ghost:** 1px Elite Navy border with navy text for secondary navigation.
- **Text:** All caps Archivo Narrow for all button labels.

### Input Fields
- Use a 1px Technical Gray border that shifts to Performance Blue on focus.
- Labels are `label-md` in Inter, positioned above the field for clarity.

### Cards
- White background with a 1px border. No shadow by default.
- Use a slight lift (the soft ambient shadow defined in Elevation) only on hover to indicate interactivity.

### Progress & Performance Indicators
- Use Performance Blue for "active" or "filled" states. 
- Technical data should be displayed in monospaced-style Inter for a "measured" look.

### Chips & Tags
- Used for product categories (e.g., "Pro-Grade", "Lightweight"). 
- Small 4px radius, Technical Gray background with Elite Navy text.