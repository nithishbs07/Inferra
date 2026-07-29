/**
 * Inferra — Motion System
 *
 * Framer Motion animation presets for consistent, smooth UI transitions.
 * All interactive animations use these presets — never ad-hoc values.
 *
 * Durations: 150–250ms. Nothing flashy. Everything smooth.
 *
 * @module motion
 *
 * Presets:
 * - `spring` — Default spring for snappy interactions
 * - `springGentle` — Softer spring for larger elements
 * - `springStiff` — Quick spring for micro-interactions
 * - `fadeIn` — Simple opacity transition
 * - `slideUp` — Slide up + fade (page enters, list items)
 * - `slideDown` — Slide down + fade (dropdowns, tooltips)
 * - `slideFromRight` — Slide from right + fade (panels, sheets)
 * - `slideFromLeft` — Slide from left + fade (sidebar)
 * - `scaleIn` — Scale + fade (modals, popovers)
 * - `stagger` — Parent preset for staggering children
 * - `collapse` — Height animation for accordions
 *
 * Accessibility:
 * - All presets respect `prefers-reduced-motion: reduce`
 * - Use `getMotionProps()` to wrap any animation for a11y
 *
 * Usage:
 * ```tsx
 * import { slideUp, getMotionProps } from "#/lib/motion";
 * <motion.div {...getMotionProps(slideUp)}>Content</motion.div>
 * ```
 */

import type { Transition, Variants } from "framer-motion";

// ─── Spring Configurations ─────────────────────────────────

/** Default spring — snappy, responsive. Use for most interactions. */
export const spring: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
};

/** Gentle spring — softer deceleration. Use for larger elements, panels. */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

/** Stiff spring — very quick snap. Use for toggles, buttons, micro-interactions. */
export const springStiff: Transition = {
  type: "spring",
  stiffness: 700,
  damping: 35,
  mass: 0.6,
};

// ─── Animation Presets ─────────────────────────────────────

/** Simple fade in/out. Duration: 150ms. */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
} as const;

/** Slide up + fade. Use for page enters, list items, messages. Duration: 200ms. */
export const slideUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
} as const;

/** Slide down + fade. Use for dropdowns, tooltips. Duration: 150ms. */
export const slideDown = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
} as const;

/** Slide from right + fade. Use for side panels, sheets. Duration: 200ms. */
export const slideFromRight = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 8 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
} as const;

/** Slide from left + fade. Use for sidebar expansion. Duration: 200ms. */
export const slideFromLeft = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
} as const;

/** Scale in + fade. Use for modals, popovers, command palette. Duration: 150ms. */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
} as const;

/** Parent preset for staggering child animations. Delay: 50ms between children. */
export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

/** Height collapse/expand. Use for accordions, expandable sections. */
export const collapse: Variants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.15, ease: [0.7, 0, 1, 0.5] },
  },
};

/** Button press — subtle scale down on click. */
export const buttonPress = {
  whileTap: { scale: 0.97 },
  transition: springStiff,
} as const;

/** Hover lift — subtle scale up + shadow on hover. */
export const hoverLift = {
  whileHover: { scale: 1.02, y: -1 },
  transition: springGentle,
} as const;

// ─── Page Transition Variants ──────────────────────────────

/** Page transition variants for AnimatePresence in router. */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

// ─── Layout Transition ─────────────────────────────────────

/** Shared layout transition for tab indicators, selection states. */
export const layoutTransition: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 35,
  mass: 0.8,
};

// ─── Accessibility ─────────────────────────────────────────

/**
 * Wraps animation props with `prefers-reduced-motion` check.
 * Returns empty object if user prefers reduced motion.
 *
 * @example
 * ```tsx
 * <motion.div {...getMotionProps(slideUp)}>Content</motion.div>
 * ```
 */
export function getMotionProps<T extends Record<string, unknown>>(
  props: T,
): T | Record<string, never> {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return {} as Record<string, never>;
  }
  return props;
}

/**
 * Returns whether the user prefers reduced motion.
 * Safe to call during SSR (returns false).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
