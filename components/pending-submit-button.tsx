"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type PendingSubmitButtonProps = {
  children: ReactNode;
  pendingLabel: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
};

export function PendingSubmitButton({
  children,
  pendingLabel,
  className = "button",
  disabled = false,
  name,
  value,
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={className}
      type="submit"
      name={name}
      value={value}
      disabled={disabled || pending}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <span className="button-spinner" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
