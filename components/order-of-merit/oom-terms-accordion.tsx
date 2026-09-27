"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Item = {
  title: string;
  paragraphs: readonly string[];
};

export function OomTermsAccordion({ items }: { items: readonly Item[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="oom-terms-list">
      {items.map((item, index) => {
        const open = index === openIndex;
        const panelId = `oom-term-${index}`;
        return (
          <section className={`oom-term-item${open ? " is-open" : ""}`} key={item.title}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              <span>{item.title}</span>
              <ChevronDown size={20} aria-hidden="true" />
            </button>
            <div className="oom-term-collapse" id={panelId} aria-hidden={!open}>
              <div>
                <div className="oom-term-copy">
                  {item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

