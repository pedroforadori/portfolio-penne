"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

// Visitas ao painel interno não entram nas métricas do site.
export function Analytics() {
  return (
    <VercelAnalytics
      beforeSend={(event) =>
        new URL(event.url).pathname.startsWith("/admin-internal") ? null : event
      }
    />
  );
}
