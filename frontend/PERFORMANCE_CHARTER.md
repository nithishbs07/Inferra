# Inferra — Performance & Motion Charter

> This charter governs every UI implementation across all phases.
> Performance regressions are **blockers** — they must be fixed before merging.

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Lighthouse Performance** | ≥ 95 | Chrome DevTools audit |
| **Cumulative Layout Shift (CLS)** | < 0.05 | Chrome DevTools / web-vitals |
| **Interaction to Next Paint (INP)** | < 200ms | Chrome DevTools / web-vitals |
| **Dropped frames during streaming** | 0 | Performance monitor during AI response |
| **Frame rate (120 Hz displays)** | Smooth at 120 FPS | No jank on ProMotion / high-refresh displays |
| **Frame rate (60 Hz displays)** | Stable at 60 FPS | No dropped frames on standard displays |
| **First Contentful Paint** | < 1.2s | Lighthouse |
| **Largest Contentful Paint** | < 2.0s | Lighthouse |
| **Total Blocking Time** | < 150ms | Lighthouse |

---

## Motion Rules

### 1. Hardware Acceleration Only

**Animate ONLY GPU-composited properties:**
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`
- ✅ `filter` (blur, brightness — use sparingly)

**NEVER animate layout-affecting properties:**
- ❌ `width`, `height`
- ❌ `top`, `right`, `bottom`, `left`
- ❌ `margin`, `padding`
- ❌ `border-width`
- ❌ `font-size`

**Exception**: Accordion/collapse animations may use `height: auto` via Framer Motion's layout animation — but must use `will-change: transform` and be tested for jank.

### 2. Duration Constraints

| Animation Type | Duration | Justification Required? |
|---------------|----------|------------------------|
| Micro-interactions (button press, toggle) | 100–150ms | No |
| Standard transitions (fade, slide, scale) | 150–250ms | No |
| Layout transitions (sidebar, panel resize) | 200–300ms | If > 250ms |
| Page transitions | 200ms enter / 100ms exit | If > 250ms |
| Streaming text cursor | Continuous | N/A |
| Loading animations | Continuous (≤ 1.5s cycle) | N/A |

Any animation exceeding 250ms requires a documented UX justification.

### 3. Framer Motion Standards

```typescript
// All interactive animations MUST use Framer Motion
// Never use CSS transitions/animations for interactive elements
// CSS transitions are acceptable ONLY for:
//   - Color transitions on hover (trivial, no layout impact)
//   - Opacity transitions on hover (trivial)

// ❌ WRONG — CSS animation for interaction
button { transition: transform 0.2s ease; }
button:active { transform: scale(0.97); }

// ✅ CORRECT — Framer Motion for interaction
<motion.button whileTap={{ scale: 0.97 }} transition={springStiff}>

// ❌ WRONG — Animating width
<motion.div animate={{ width: isOpen ? 260 : 72 }}>

// ✅ CORRECT — Using transform for sidebar
<motion.div
  animate={{ x: isOpen ? 0 : -188 }}
  style={{ width: 260 }}
>
```

### 4. Every Animation Must Have Purpose

| Purpose | Example |
|---------|---------|
| **State feedback** | Button press scale, toggle thumb position |
| **Spatial orientation** | Page slide direction, sidebar expand/collapse |
| **Attention direction** | Toast entering, error shake |
| **Continuity** | Shared layout transitions between tabs |
| **Loading indication** | Skeleton shimmer, spinner rotation |

**No decorative animations.** If an animation doesn't serve one of these purposes, remove it.

---

## React Performance Rules

### 1. Memoization

```typescript
// Memoize list item components
const MessageItem = React.memo(({ message }: Props) => { ... });

// Memoize expensive computations
const filteredItems = useMemo(() =>
  items.filter(predicate), [items, predicate]
);

// Memoize callbacks passed to children
const handleClick = useCallback(() => { ... }, [dependency]);
```

### 2. Virtualization

All scrollable lists with > 20 items **MUST** use `@tanstack/react-virtual`:
- Message list (chat)
- Conversation list (sidebar)
- File tree
- Command palette results
- Settings lists
- Activity feeds

### 3. Code Splitting

```typescript
// Every workspace tab MUST be lazy-loaded
const FilesTab = React.lazy(() => import("./tabs/files-tab"));
const BrowserTab = React.lazy(() => import("./tabs/browser-tab"));
const TerminalTab = React.lazy(() => import("./tabs/terminal-tab"));

// Wrap in Suspense with skeleton fallback
<Suspense fallback={<TabSkeleton />}>
  <FilesTab />
</Suspense>
```

### 4. Streaming Performance

During AI response streaming:
- **No layout shifts** — message container must not resize unexpectedly
- **No re-renders of non-changing components** — parent components must not re-render
- **Batch DOM updates** — use `requestAnimationFrame` for text insertion if needed
- **Virtual scroll must handle growing lists** — message list must not re-measure all items on each new token

---

## Button Standards

Every button in the application must have these states:

| State | Visual Treatment |
|-------|-----------------|
| **Default** | Token-based background, clear label |
| **Hover** | Subtle background lightening, 150ms ease |
| **Focus** | 2px brand-primary ring, 2px offset, visible outline |
| **Press** | `scale(0.97)` via Framer Motion spring, 100ms |
| **Loading** | Spinner icon, disabled state, reduced opacity |
| **Disabled** | 50% opacity, `cursor-not-allowed`, no hover/press |

Focus states must be visible for keyboard navigation but can be hidden for mouse interaction using `:focus-visible`.

---

## Visual Style

### Color Palette

The Inferra visual identity uses a **red, white, black, and neutral gray** palette:

| Role | Color | Usage |
|------|-------|-------|
| **Primary accent** | Red spectrum (`--brand-primary`) | CTAs, active states, brand marks |
| **Surface dark** | Near-black (`--surface-0: #09090B`) | App background |
| **Surface light** | Dark grays (`--surface-1` through `--surface-3`) | Cards, panels, inputs |
| **Text primary** | Near-white (`--text-primary: #F0F2F7`) | Headings, body |
| **Text secondary** | Medium gray (`--text-secondary: #9099AC`) | Labels, secondary |
| **Borders** | Translucent white (`rgba(255,255,255,0.06–0.16)`) | Subtle structure |

> [!IMPORTANT]
> Update the design token `--brand-primary` from gold (#FFE165) to the red spectrum to match this palette decision. This should be done as part of Phase 2 token migration.

### Aesthetic Principles

- **Apple-level polish**: Precise spacing, consistent radius, quality shadows
- **Modern AI workspace**: Dark, focused, professional — not playful
- **Premium feel**: Subtle glassmorphism on overlays, smooth springs, no jarring transitions
- **Information density**: Show relevant data without clutter — use progressive disclosure

---

## Enforcement

1. **Code review**: Every PR must verify animation durations, GPU properties, and memoization
2. **Lighthouse CI**: Run on every build — fail if Performance < 95
3. **Visual regression**: Screenshot tests for layout shift detection
4. **Performance monitor**: Chrome Performance panel check during streaming scenarios
5. **Accessibility audit**: axe-core check on every new component

---

*This charter applies to all current and future phases of Inferra.*
