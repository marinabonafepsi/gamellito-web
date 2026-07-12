'use client';

import { useEffect } from 'react';

const SESSION_KEY = 'gamellito_visit_tracked';

// Fires one "visita" product event per browser session (any page, logged in
// or not), so platform/device_type on product_events reflect real traffic
// mix — not just users who complete a specific action.
export function VisitTracker() {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');

    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
