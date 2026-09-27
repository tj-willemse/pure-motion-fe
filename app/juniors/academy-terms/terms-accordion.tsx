"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type TermsAccordionContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const TermsAccordionContext = createContext<TermsAccordionContextValue | null>(null);

export function TermsAccordion({
  children,
  defaultOpenId = "safeguarding",
}: {
  children: ReactNode;
  defaultOpenId?: string | null;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);

  return (
    <TermsAccordionContext.Provider value={{ openId, setOpenId }}>
      <div className="academy-terms-disclosures">{children}</div>
    </TermsAccordionContext.Provider>
  );
}

export function TermsItem({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const accordion = useContext(TermsAccordionContext);

  if (!accordion) {
    throw new Error("TermsItem must be rendered inside TermsAccordion");
  }

  const isOpen = accordion.openId === id;
  const panelId = `${id}-panel`;

  return (
    <section className={`academy-terms-disclosure${isOpen ? " is-open" : ""}`} id={id}>
      <button
        type="button"
        className="academy-terms-trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => accordion.setOpenId(isOpen ? null : id)}
      >
        <span>{title}</span>
        <ChevronDown size={19} aria-hidden="true" />
      </button>
      <div className="academy-terms-collapse" id={panelId} aria-hidden={!isOpen}>
        <div className="academy-terms-collapse-inner">
          <div className="academy-terms-disclosure-body">{children}</div>
        </div>
      </div>
    </section>
  );
}
