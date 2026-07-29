import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./tailwind.css";
import "./index.css";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "#/components/ui/toast";
import { useInvitation } from "#/hooks/use-invitation";
import { ThemeProvider } from "#/components/providers/theme-provider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Inter + JetBrains Mono — Premium Typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/inferra-mark.svg" />
        <link rel="apple-touch-icon" href="/inferra-mark.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body className="font-[var(--font-sans)] bg-[var(--surface-0)] text-[var(--text-primary)] antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
        <SonnerToaster />
        <div id="modal-portal-exit" />
      </body>
    </html>
  );
}

export const meta: MetaFunction = () => [
  { title: "Inferra" },
  {
    name: "description",
    content: "A premium AI workspace for building what is next.",
  },
  { property: "og:title", content: "Inferra" },
  {
    property: "og:description",
    content: "A premium AI workspace for building what is next.",
  },
  { name: "theme-color", content: "#09090B" },
];

export default function App() {
  // Handle invitation token cleanup when invitation flow completes
  // This runs on all pages to catch redirects from auth callback
  useInvitation();

  return (
    <ThemeProvider defaultTheme="dark">
      <Outlet />
    </ThemeProvider>
  );
}
