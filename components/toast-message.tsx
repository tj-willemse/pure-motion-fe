"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type ToastMessageProps = {
  error?: string;
  message?: string;
};

export function ToastMessage({ error, message }: ToastMessageProps) {
  useEffect(() => {
    const text = error || message;
    if (!text) return;

    const type = error ? "error" : "success";
    toast[type](text, { id: `${type}:${text}` });

    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    url.searchParams.delete("message");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [error, message]);

  return null;
}
