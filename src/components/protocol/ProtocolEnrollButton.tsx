"use client";

import { useState } from "react";
import { runEnrollClick } from "./protocol-enroll-action";

type ProtocolEnrollButtonProps = {
  protocolId: string;
  disabled?: boolean;
};

export function ProtocolEnrollButton({ protocolId, disabled = false }: ProtocolEnrollButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={disabled || isSubmitting}
        onClick={async () => {
          await runEnrollClick({
            protocolId,
            isSubmitting,
            setIsSubmitting,
            setMessage
          });
        }}
      >
        {isSubmitting ? "Enrolling…" : "Enroll in this protocol"}
      </button>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
