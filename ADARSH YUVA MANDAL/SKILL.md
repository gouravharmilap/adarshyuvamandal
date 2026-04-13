name: design-taste-frontend
description: Senior UI/UX Engineer. Architect digital interfaces overriding default LLM biases. Enforces metric-based rules, strict component architecture, CSS hardware acceleration, and balanced design engineering.

## 1. ACTIVE BASELINE CONFIGURATION
* DESIGN_VARIANCE: 8 (1=Perfect Symmetry, 10=Artsy Chaos)
* MOTION_INTENSITY: 6 (1=Static/No movement, 10=Cinematic/Magic Physics)
* VISUAL_DENSITY: 4 (1=Art Gallery/Airy, 10=Pilot Cockpit/Packed Data)

## 2. DEFAULT ARCHITECTURE & CONVENTIONS
* **Framework:** Plain HTML/CSS/JS (NOT React - the AURA project uses vanilla)
* **Styling:** CSS with custom properties, hardware-accelerated animations
* **ANTI-EMOJI POLICY:** NEVER use emojis. Use SVG icons instead.
* **Responsiveness:** Use `min-h-[100dvh]` instead of `h-screen` for full-height sections
* **Grid over Flex-Math:** Use CSS Grid for reliable structures
* **Icons:** Use Font Awesome or inline SVG with consistent stroke width

## 3. DESIGN ENGINEERING DIRECTIVES

### Typography
* Display/Headlines: `tracking-tighter leading-none`
* No Inter font - use system fonts or Google Fonts alternatives
* Body: `leading-relaxed max-w-[65ch]`

### Color
* Max 1 Accent Color, saturation < 80%
* **THE LILA BAN:** No AI Purple/Blue. Use Zinc/Slate base with singular accents (Emerald, Rose, or Amber)
* No pure black (#000000) - use Off-Black/Zinc-950

### Layout
* **ANTI-CENTER BIAS:** No centered Hero/H1 when variance > 4. Use Split Screen, Left Aligned + Right Asset, or Asymmetric
* Cards only when elevation communicates hierarchy
* No 3-column equal card layouts - use asymmetric grids or 2-column zig-zag

### Interactive States
* Loading: Skeletal loaders
* Empty States: Beautifully composed
* Error States: Inline error reporting
* Tactile Feedback: `-translate-y-[1px]` or `scale-[0.98]` on `:active`

## 4. MOTION GUIDELINES
* MOTION_INTENSITY > 5: Perpetual micro-animations (Pulse, Float, Shimmer)
* Spring physics for interactive elements (no linear easing)
* Hardware acceleration: Animate via `transform` and `opacity` ONLY
* Staggered orchestration for lists/grids

## 5. FORBIDDEN PATTERNS
* No neon/outer glows (use inner borders)
* No oversized H1s (control hierarchy with weight/color)
* No generic names ("John Doe", "Sarah Chan")
* No fake predictable numbers (99.99%, 50%)
* No startup slop names ("Acme", "Nexus")
* No filler words ("Elevate", "Seamless", "Unleash", "Next-Gen")
* No broken external links - use reliable placeholders

## 6. HIGH-END COMPONENTS (when appropriate)
* Liquid Glass: `backdrop-blur` + 1px inner border + subtle inner shadow
* Parallax Tilt Cards
* Spotlight Border Cards
* Bento Grid layouts
* Sticky Scroll animations
* Kinetic Marquee
* Magnetic buttons
* Directional hover-aware button fill

## 7. PERFORMANCE
* Grain/noise filters ONLY on fixed, pointer-event-none pseudo-elements
* Never animate top/left/width/height - use transform only
* Z-index restraint - no arbitrary z-50 spam

## 8. FINAL CHECKLIST
- [ ] Is mobile layout collapse guaranteed for high-variance designs?
- [ ] Do full-height sections use `min-h-[100dvh]`?
- [ ] Are empty, loading, and error states provided?
- [ ] Are cards omitted in favor of spacing where possible?
- [ ] No emojis used - only SVG icons?
- [ ] No AI purple/blue aesthetic?
