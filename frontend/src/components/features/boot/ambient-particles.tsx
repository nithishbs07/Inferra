/**
 * Inferra — Ambient Particles
 *
 * 20 tiny, slow, blurred particles that drift upward with natural fade.
 * Seeded positions ensure no visible pattern. No particle.js, no canvas —
 * pure React/Framer Motion for full GPU acceleration.
 *
 * Performance notes:
 * - Each particle uses only transform + opacity (compositor-only properties)
 * - will-change: transform applied via Framer Motion
 * - Reduced motion: component renders null
 */

import React from "react";
import { motion } from "framer-motion";

interface ParticleConfig {
  id: number;
  x: number; // % from left
  y: number; // % from top
  size: number; // px
  blur: number; // px
  delay: number; // s
  duration: number; // s
  driftX: number; // px horizontal drift
  driftY: number; // px vertical drift
  opacity: number; // max opacity (very low)
}

// Deterministic pseudo-random seed — no Math.random() on render
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateParticles(count: number): ParticleConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const r = (n: number) => seededRandom(i * 17 + n);
    return {
      id: i,
      x: 20 + r(1) * 60, // concentrate near center 20–80%
      y: 30 + r(2) * 50, // not at edges
      size: 1.5 + r(3) * 2.5, // 1.5–4px
      blur: 1 + r(4) * 2, // 1–3px blur
      delay: r(5) * 1.8, // staggered entry
      duration: 3.5 + r(6) * 2.5, // 3.5–6s cycle
      driftX: (r(7) - 0.5) * 30, // ±15px horizontal
      driftY: -(20 + r(8) * 40), // 20–60px upward
      opacity: 0.12 + r(9) * 0.18, // 0.12–0.30 (very subtle)
    };
  });
}

const PARTICLES = generateParticles(20);

interface AmbientParticlesProps {
  active: boolean;
}

export function AmbientParticles({ active }: AmbientParticlesProps) {
  // Respect reduced motion at the component level
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            filter: `blur(${p.blur}px)`,
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={
            active
              ? {
                  opacity: [0, p.opacity, p.opacity * 0.6, 0],
                  y: [0, p.driftY * 0.4, p.driftY],
                  x: [0, p.driftX * 0.5, p.driftX],
                }
              : { opacity: 0 }
          }
          transition={
            active
              ? {
                  delay: p.delay,
                  duration: p.duration,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.5 + seededRandom(p.id * 3) * 1.5,
                  repeatType: "loop",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
