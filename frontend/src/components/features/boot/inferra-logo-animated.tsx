/**
 * Inferra — Animated Logo Mark
 *
 * SVG logo with sequenced path animation for the boot sequence.
 * The "I" body draws first, then the lightning bolt sweeps downward.
 *
 * Performance: GPU-accelerated via transform/opacity only.
 * Accessibility: aria-hidden on the SVG; text label in parent.
 */

import React from "react";
import type { Transition } from "framer-motion";
import { motion } from "framer-motion";

interface InferraLogoAnimatedProps {
  /** Phase 1→2 complete: logo is fully visible */
  phase:
    | "hidden"
    | "awakening"
    | "energy"
    | "intelligence"
    | "identity"
    | "done";
  /** Size in pixels (both width and height) */
  size?: number;
  className?: string;
}

/**
 * Cubic bezier for Apple-like easing — decelerating, never bouncy.
 */
const APPLE_EASE = [0.25, 0.1, 0.25, 1.0] as const;
const SPRING_SMOOTH: Transition = {
  type: "spring",
  stiffness: 160,
  damping: 28,
  mass: 1,
};

export function InferraLogoAnimated({
  phase,
  size = 80,
  className,
}: InferraLogoAnimatedProps) {
  const isVisible = phase !== "hidden";
  const energyActive = ["energy", "intelligence", "identity", "done"].includes(
    phase,
  );
  const breathing = phase === "intelligence";

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
      // Phase 1: Awakening — scale + opacity + blur spring in
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.92,
        filter: isVisible ? "blur(0px)" : "blur(12px)",
      }}
      transition={SPRING_SMOOTH}
      aria-hidden
    >
      {/* Subtle ambient glow behind logo — fades in with energy phase */}
      <motion.div
        style={{
          position: "absolute",
          inset: -size * 0.4,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(229,57,53,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
        animate={{ opacity: energyActive ? 1 : 0 }}
        transition={{ duration: 0.8, ease: APPLE_EASE }}
      />

      {/* Logo SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle — deep matte */}
        <circle cx="40" cy="40" r="40" fill="#09090B" />

        {/* Subtle inner ring — appears during energy phase */}
        <motion.circle
          cx="40"
          cy="40"
          r="38"
          stroke="#FFFFFF"
          strokeWidth="0.4"
          animate={{ opacity: energyActive ? 0.08 : 0 }}
          transition={{ duration: 0.6, ease: APPLE_EASE }}
        />

        {/* ── "I" vertical bar ──────────────────────────────────── */}
        {/* Top cap */}
        <motion.rect
          x="29"
          y="16"
          width="22"
          height="6"
          rx="3"
          fill="#FFFFFF"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            isVisible ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
          }
          style={{ transformOrigin: "40px 19px" }}
          transition={{ delay: 0.05, duration: 0.45, ease: APPLE_EASE }}
        />

        {/* Center vertical stem */}
        <motion.rect
          x="36.5"
          y="22"
          width="7"
          height="36"
          rx="3.5"
          fill="#FFFFFF"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={
            isVisible ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }
          }
          style={{ transformOrigin: "40px 22px" }}
          transition={{ delay: 0.12, duration: 0.5, ease: APPLE_EASE }}
        />

        {/* Bottom cap */}
        <motion.rect
          x="29"
          y="58"
          width="22"
          height="6"
          rx="3"
          fill="#FFFFFF"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            isVisible ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
          }
          style={{ transformOrigin: "40px 61px" }}
          transition={{ delay: 0.22, duration: 0.45, ease: APPLE_EASE }}
        />

        {/* ── Lightning bolt (red accent) ───────────────────────── */}
        {/*
          Path: starts from center-right of the "I", sweeps diagonally
          downward-right, cuts back left, then tip.
          Drawn with strokeDasharray trick for the "energy sweep" effect.
        */}
        <motion.path
          d="M 44 30 L 54 42 L 47 42 L 53 54 L 36 44 L 43 44 Z"
          fill="#E53935"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            energyActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }
          }
          style={{ transformOrigin: "45px 42px" }}
          transition={{
            delay: energyActive ? 0 : 0,
            duration: 0.55,
            ease: [0.34, 1.12, 0.64, 1],
          }}
        />

        {/* Lightning glow overlay — subtle red bloom */}
        <motion.path
          d="M 44 30 L 54 42 L 47 42 L 53 54 L 36 44 L 43 44 Z"
          fill="#FF4D4F"
          opacity={0}
          style={{ transformOrigin: "45px 42px", filter: "blur(4px)" }}
          animate={
            energyActive
              ? { opacity: 0.35, scale: 1 }
              : { opacity: 0, scale: 0.6 }
          }
          transition={{ delay: 0.1, duration: 0.5, ease: APPLE_EASE }}
        />
      </svg>

      {/* Breathing animation overlay during intelligence phase */}
      {breathing && (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(229,57,53,0.06) 0%, transparent 65%)",
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 2.8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      )}
    </motion.div>
  );
}
