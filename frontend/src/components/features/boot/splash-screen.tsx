/**
 * Inferra — Splash Screen
 *
 * Wraps the BootAnimation and controls when the app content is revealed.
 *
 * Strategy:
 * - Show BootAnimation on first visit (sessionStorage flag prevents repeat)
 * - Accept `appReady` prop — if the app finishes loading during animation,
 *   the animation completes gracefully before revealing
 * - If animation finishes before app is ready, waits for appReady
 *
 * Usage:
 * ```tsx
 * <SplashScreen appReady={!isLoading}>
 *   <App />
 * </SplashScreen>
 * ```
 */

import React from "react";
import { BootAnimation } from "./boot-animation";

// Only show boot animation once per browser session
const SESSION_KEY = "inferra_boot_shown";

function hasShownBoot(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markBootShown(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ignore (private browsing)
  }
}

interface SplashScreenProps {
  /** When true, the application is ready to be shown after animation */
  appReady: boolean;
  children: React.ReactNode;
}

export function SplashScreen({ appReady, children }: SplashScreenProps) {
  // Detect reduced motion preference
  const [reducedMotion] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Determine if we should show the animation
  const [showBoot] = React.useState(() => !hasShownBoot());

  // Track whether animation has completed its dissolve
  const [animationDone, setAnimationDone] = React.useState(!showBoot);

  // Track readiness — both animation AND app must be done
  const [appReadyInternal, setAppReadyInternal] = React.useState(appReady);

  // Update when app becomes ready
  React.useEffect(() => {
    if (appReady) setAppReadyInternal(true);
  }, [appReady]);

  // Animation complete callback
  const handleAnimationComplete = React.useCallback(() => {
    markBootShown();
    setAnimationDone(true);
  }, []);

  // Show app when both animation AND app are ready
  const showApp = animationDone && appReadyInternal;

  return (
    <>
      {/* Boot animation — renders on top of everything via fixed positioning */}
      {showBoot && !animationDone && (
        <BootAnimation
          onComplete={handleAnimationComplete}
          reducedMotion={reducedMotion}
        />
      )}

      {/*
        App content — always mounted so React Query and hooks initialise
        immediately during animation. Hidden via visibility until ready.
        This ensures zero delay when the animation completes.
      */}
      <div
        style={{
          visibility: showApp ? "visible" : "hidden",
          // Keep in DOM so the app can fully initialize during animation
          pointerEvents: showApp ? "auto" : "none",
        }}
        aria-hidden={!showApp}
      >
        {children}
      </div>
    </>
  );
}
