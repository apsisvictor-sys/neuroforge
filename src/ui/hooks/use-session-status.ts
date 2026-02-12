"use client";

import { useEffect, useState } from "react";
import { getJson } from "@/ui/hooks/use-api";

export function useSessionStatus(): { authenticated: boolean; loading: boolean } {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const response = await getJson<{ authenticated: boolean }>("/api/auth/session");
        if (active) {
          setAuthenticated(response.authenticated);
        }
      } catch {
        if (active) {
          setAuthenticated(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { authenticated, loading };
}
