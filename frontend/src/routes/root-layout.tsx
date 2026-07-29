/**
 * Inferra — Root Layout (Phase 2)
 *
 * Replaces the legacy layout with the new AppShell design system.
 *
 * Preserves ALL existing business logic:
 * - Authentication flow
 * - Settings management
 * - Analytics consent
 * - Auto-login
 * - Auth callback
 * - Reo tracking
 * - PostHog consent + identify
 * - Auto-organization selection
 * - Auto-invitation acceptance
 * - Language switching
 * - Login redirect logic
 * - Email verification guard
 * - Onboarding guard
 * - Alert banner
 * - Re-auth modal
 *
 * Changes ONLY the visual shell:
 * - Legacy div layout → AppShell component
 * - Legacy Sidebar → SidebarNext (Premium Sidebar)
 * - Adds ThemeProvider
 * - Adds CommandPalette (Cmd+K)
 * - Adds StatusBar
 * - Adds route transition animation
 *
 * @see root-layout.tsx.bak for the original file
 */

import React from "react";
import {
  useRouteError,
  isRouteErrorResponse,
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { I18nKey } from "#/i18n/declaration";
import i18n from "#/i18n";

// ─── Business Logic Hooks (preserved exactly) ────────────
import { useIsAuthed } from "#/hooks/query/use-is-authed";
import { useConfig } from "#/hooks/query/use-config";
import { useSettings } from "#/hooks/query/use-settings";
import { useMigrateUserConsent } from "#/hooks/use-migrate-user-consent";
import { displaySuccessToast } from "#/utils/custom-toast-handlers";
import { useIsOnIntermediatePage } from "#/hooks/use-is-on-intermediate-page";
import { useAutoLogin } from "#/hooks/use-auto-login";
import { useAuthCallback } from "#/hooks/use-auth-callback";
import { useReoTracking } from "#/hooks/use-reo-tracking";
import { useSyncPostHogConsent } from "#/hooks/use-sync-posthog-consent";
import { useAutoSelectOrganization } from "#/hooks/use-auto-select-organization";
import { LOCAL_STORAGE_KEYS } from "#/utils/local-storage";
import { useAppTitle } from "#/hooks/use-app-title";
import { useAutoAcceptInvitation } from "#/hooks/use-auto-accept-invitation";
import { usePostHogIdentify } from "#/hooks/use-posthog-identify";

// ─── Guards & Modals (preserved exactly) ──────────────────
import { EmailVerificationGuard } from "#/components/features/guards/email-verification-guard";
import { OnboardingGuard } from "#/components/features/guards/onboarding-guard";
import { ReauthModal } from "#/components/features/waitlist/reauth-modal";
import { AnalyticsConsentFormModal } from "#/components/features/analytics/analytics-consent-form-modal";
import { AlertBanner } from "#/components/features/alerts/alert-banner";

import { AppShell } from "#/components/layout/app-shell";
import { StatusBar, StatusDot } from "#/components/layout/status-bar";
import { SidebarNext } from "#/components/features/sidebar/sidebar-next";
import { CommandPalette } from "#/components/features/command-palette/command-palette";
import { WorkspaceHeader } from "#/components/features/workspace/workspace-header";
import { Spinner } from "#/components/ui/spinner";
import { pageTransition } from "#/lib/motion";
import { SplashScreen } from "#/components/features/boot";

export function ErrorBoundary() {
  const error = useRouteError();
  const { t } = useTranslation();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-0)] text-[var(--text-primary)]">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-[var(--brand-primary)]">
            {error.status}
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            {error.statusText}
          </p>
          <pre className="text-sm text-[var(--text-tertiary)] max-w-md mx-auto">
            {error.data instanceof Object
              ? JSON.stringify(error.data)
              : error.data}
          </pre>
        </div>
      </div>
    );
  }
  if (error instanceof Error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-0)] text-[var(--text-primary)]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t(I18nKey.ERROR$GENERIC)}</h1>
          <pre className="text-sm text-[var(--text-tertiary)]">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-0)] text-[var(--text-primary)]">
      <h1 className="text-2xl font-bold">{t(I18nKey.ERROR$UNKNOWN)}</h1>
    </div>
  );
}

export default function MainApp() {
  // ─── ALL existing hooks preserved exactly ────────────
  const appTitle = useAppTitle();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const isOnIntermediatePage = useIsOnIntermediatePage();
  const { data: settings } = useSettings();
  const { migrateUserConsent } = useMigrateUserConsent();
  const { t } = useTranslation();

  const config = useConfig();
  const {
    data: isAuthed,
    isFetching: isFetchingAuth,
    isLoading: isAuthLoading,
    isError: isAuthError,
  } = useIsAuthed();

  const [consentFormIsOpen, setConsentFormIsOpen] = React.useState(false);

  // ─── ALL existing side effects preserved exactly ─────
  useAutoAcceptInvitation();
  useAutoLogin();
  useAuthCallback();
  useReoTracking();
  useSyncPostHogConsent();
  usePostHogIdentify();
  useAutoSelectOrganization();

  React.useEffect(() => {
    if (!isOnIntermediatePage && settings?.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings?.language, isOnIntermediatePage]);

  React.useEffect(() => {
    if (!isOnIntermediatePage) {
      const consentFormModalIsOpen =
        settings?.user_consents_to_analytics === null;
      setConsentFormIsOpen(consentFormModalIsOpen);
    }
  }, [settings, isOnIntermediatePage]);

  React.useEffect(() => {
    if (!isOnIntermediatePage) {
      migrateUserConsent({
        handleAnalyticsWasPresentInLocalStorage: () => {
          setConsentFormIsOpen(false);
        },
      });
    }
  }, [isOnIntermediatePage]);

  React.useEffect(() => {
    if (settings?.is_new_user && config.data?.app_mode === "saas") {
      displaySuccessToast(t(I18nKey.BILLING$YOURE_IN));
    }
  }, [settings?.is_new_user, config.data?.app_mode]);

  // ─── Login redirect logic (preserved exactly) ───────
  const checkLoginMethodExists = React.useCallback(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.LOGIN_METHOD) !== null;
    }
    return false;
  }, []);

  const [loginMethodExists, setLoginMethodExists] = React.useState(
    checkLoginMethodExists(),
  );

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEYS.LOGIN_METHOD) {
        setLoginMethodExists(checkLoginMethodExists());
      }
    };
    const handleWindowFocus = () => {
      setLoginMethodExists(checkLoginMethodExists());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [checkLoginMethodExists]);

  React.useEffect(() => {
    setLoginMethodExists(checkLoginMethodExists());
  }, [isAuthed, checkLoginMethodExists]);

  const isLoading = config.isLoading || isAuthLoading;

  const shouldRedirectToLogin =
    !isLoading &&
    !isAuthed &&
    !isAuthError &&
    !isOnIntermediatePage &&
    config.data?.app_mode === "saas" &&
    !loginMethodExists;

  React.useEffect(() => {
    if (shouldRedirectToLogin) {
      const searchString = searchParams.toString();
      let fullPath = "";
      if (pathname !== "/") {
        fullPath = searchString ? `${pathname}?${searchString}` : pathname;
      }
      const loginUrl = fullPath
        ? `/login?returnTo=${encodeURIComponent(fullPath)}`
        : "/login";
      navigate(loginUrl, { replace: true });
    }
  }, [shouldRedirectToLogin, pathname, searchParams, navigate]);

  // ─── Loading State (kept for redirect logic, hidden behind splash) ───
  if (shouldRedirectToLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-0)]">
        <Spinner size="lg" aria-label="Loading application" />
      </div>
    );
  }

  // ─── Modal Conditions (preserved exactly) ────────────
  const renderReAuthModal =
    !isAuthed &&
    !isAuthError &&
    !isFetchingAuth &&
    !isOnIntermediatePage &&
    config.data?.app_mode === "saas" &&
    loginMethodExists;

  // ─── NEW: Premium Layout with Boot Animation ────────────
  return (
    <SplashScreen appReady={!isLoading}>
      <AppShell
        sidebar={<SidebarNext />}
        statusBar={
          <StatusBar
            leftContent={<StatusDot status="connected" label="Connected" />}
            rightContent={
              <span className="text-[var(--text-tertiary)] text-[10px] font-mono">
                Inferra
              </span>
            }
          />
        }
      >
        <title>{appTitle}</title>

        {/* Alert Banner — preserved */}
        {config.data &&
          (config.data.maintenance_start_time ||
            (config.data.faulty_models && config.data.faulty_models.length > 0) ||
            config.data.error_message) && (
            <AlertBanner
              maintenanceStartTime={config.data.maintenance_start_time}
              faultyModels={config.data.faulty_models}
              errorMessage={config.data.error_message}
              updatedAt={config.data.updated_at}
            />
          )}

        {/* Main Content with Route Transition */}
        <div
          id="root-outlet"
          className="flex-1 relative overflow-auto custom-scrollbar h-full"
        >
          <OnboardingGuard>
            <EmailVerificationGuard>
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  variants={pageTransition}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="h-full"
                >
                  <WorkspaceHeader>
                    <Outlet />
                  </WorkspaceHeader>
                </motion.div>
              </AnimatePresence>
            </EmailVerificationGuard>
          </OnboardingGuard>
        </div>

        {/* Command Palette — Cmd+K */}
        <CommandPalette />

        {/* Modals — preserved exactly */}
        {renderReAuthModal && <ReauthModal />}
        {config.data?.app_mode === "oss" && consentFormIsOpen && (
          <AnalyticsConsentFormModal
            onClose={() => {
              setConsentFormIsOpen(false);
            }}
          />
        )}
      </AppShell>
    </SplashScreen>
  );
}
