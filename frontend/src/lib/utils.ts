/**
 * Inferra — Utility Functions
 *
 * Core utilities used across the component library.
 *
 * @module utils
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge.
 * Handles conditional classes, arrays, and Tailwind conflicts.
 *
 * @example
 * ```tsx
 * cn("px-4 py-2", isActive && "bg-brand-primary", className)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
