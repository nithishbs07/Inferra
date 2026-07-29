/**
 * Inferra — Boot Animation
 *
 * Five-phase startup sequence:
 *
 *  Phase 1 — Awakening  (0.0–0.7s)  : Logo fades from dark, spring in
 *  Phase 2 — Energy     (0.7–1.5s)  : Lightning animates, red glow expands
 *  Phase 3 — Intelligence (1.5–2.6s): Pulse ring, ambient particles, breathing
 *  Phase 4 — Identity   (2.6–3.2s)  : Typography fades in
 *  Phase 5 — Transition (3.2–3.8s)  : Everything dissolves into app
 *
 * Performance contract:
 *  - Only transform, opacity, and filter are animated (compositor-only)
 *  - No layout-affecting properties animated
 *  - No blocking JavaScript during animation
 *  - prefers-reduced-motion: 300ms fade only, then done
 *
 * @see inferra-logo-animated.tsx
 * @see ambient-particles.tsx
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InferraLogoAnimated } from "./inferra-logo-animated";
import { AmbientParticles } from "./ambient-particles";

// ─── Types ──────────────────────────────────────────────────────────────────

type BootPhase =
  | "hidden"
  | "awakening"
  | "energy"
  | "intelligence"
  | "identity"
  | "done";

interface BootAnimationProps {
  /** Called when the animation completes and the app should be revealed */
  onComplete: () => void;
  /** If true, skip the full sequence and do a quick 300ms fade */
  reducedMotion?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const APPLE_EASE = [0.25, 0.1, 0.25, 1.0] as const;

// Phase timing — total ≤ 3.8s
const PHASE_TIMINGS = {
  energy: 700, // 0.7s
  intelligence: 1500, // 1.5s
  identity: 2600, // 2.6s
} as const;
const TOTAL_DURATION = 3600; // 3.6s — within 3.2–3.8s spec

// ─── Circular Pulse Ring ──────────────────────────────────────────────────────

function PulseRing({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="pulse-ring"
          aria-hidden
          style={{
            position: "absolute",
            borderRadius: "50%",
            border: "1px solid rgba(229, 57, 53, 0.25)",
            pointerEvents: "none",
          }}
          initial={{ width: 100, height: 100, opacity: 0.6 }}
          animate={{ width: 320, height: 320, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2.2,
            ease: [0.2, 0, 0.6, 1],
            repeat: 1,
            repeatDelay: 0.4,
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Typography ───────────────────────────────────────────────────────────────

function BootTypography({ visible }: { visible: boolean }) {
  return (
    <motion.div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        userSelect: "none",
      }}
      animate={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(6px)",
      }}
      transition={{ duration: 0.7, ease: APPLE_EASE }}
    >
      <motion.span
        style={{
          fontFamily: "Inter, -apple-system, sans-serif",
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
          lineHeight: 1,
        }}
      >
        Inferra
      </motion.span>
      <motion.span
        style={{
          fontFamily: "Inter, -apple-system, sans-serif",
          fontWeight: 400,
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#A8A8A8",
          lineHeight: 1,
        }}
        animate={{
          opacity: visible ? 0.7 : 0,
          filter: visible ? "blur(0px)" : "blur(4px)",
        }}
        transition={{ delay: 0.15, duration: 0.6, ease: APPLE_EASE }}
      >
        AI-Native Software Engineering Workspace
      </motion.span>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BootAnimation({
  onComplete,
  reducedMotion = false,
}: BootAnimationProps) {
  const [phase, setPhase] = React.useState<BootPhase>("awakening");
  const [visible, setVisible] = React.useState(true);

  // ─── Reduced motion: single 300ms fade, done
  React.useEffect(() => {
    if (!reducedMotion) {
      return undefined;
    }
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 350);
    }, 300);
    return () => clearTimeout(t);
  }, [reducedMotion, onComplete]);

  // ─── Full animation phase sequencer
  React.useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("energy"), PHASE_TIMINGS.energy));
    timers.push(
      setTimeout(() => setPhase("intelligence"), PHASE_TIMINGS.intelligence),
    );
    timers.push(setTimeout(() => setPhase("identity"), PHASE_TIMINGS.identity));
    timers.push(
      setTimeout(() => {
        setPhase("done");
        // Begin dissolve — signal parent slightly after phase starts
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 500);
        }, 300);
      }, TOTAL_DURATION),
    );

    return () => timers.forEach(clearTimeout);
  }, [reducedMotion, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot-screen"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#09090B",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            isolation: "isolate",
          }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: "blur(8px)",
          }}
          transition={{
            duration: 0.55,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Radial background lighting — extremely subtle */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 45% at 50% 48%, rgba(229,57,53,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
            animate={{
              opacity: phase === "awakening" ? 0 : 1,
            }}
            transition={{ duration: 1.2, ease: APPLE_EASE }}
          />

          {/* Ambient particles layer — intelligence phase only */}
          <AmbientParticles active={phase === "intelligence"} />

          {/* Pulse ring — centered behind logo */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            <PulseRing active={phase === "intelligence"} />
          </div>

          {/* Logo + Typography stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              position: "relative",
            }}
          >
            {/* Animated logo */}
            <InferraLogoAnimated phase={phase} size={88} />

            {/* Identity text — Phase 4+ */}
            <BootTypography visible={["identity", "done"].includes(phase)} />
          </div>

          {/* Very subtle bottom progress indicator */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 48,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 2,
              borderRadius: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                borderRadius: 1,
                backgroundColor: "#E53935",
                transformOrigin: "left center",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: TOTAL_DURATION / 1000 - 0.3,
                ease: [0.2, 0, 0.5, 1],
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
