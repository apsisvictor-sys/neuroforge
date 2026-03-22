"use client";
import { useState, useEffect } from "react";
import { SupplementDisclaimerModal } from "@/components/supplement/SupplementDisclaimerModal";

const DISCLAIMER_VERSION = "1.0";
const STORAGE_KEY = "supplement_disclaimer_ack";

export function SupplementLayoutClient({ children }: { children: React.ReactNode }) {
  const [acknowledged, setAcknowledged] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setAcknowledged(stored === DISCLAIMER_VERSION);
  }, []);

  function handleAcknowledge() {
    localStorage.setItem(STORAGE_KEY, DISCLAIMER_VERSION);
    setAcknowledged(true);
  }

  // Wait for client hydration before rendering (avoids SSR mismatch)
  if (acknowledged === null) return null;

  return (
    <>
      <SupplementDisclaimerModal isOpen={!acknowledged} onAcknowledge={handleAcknowledge} />
      {children}
    </>
  );
}
