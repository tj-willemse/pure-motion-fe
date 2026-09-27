"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { academyRates, academySchedules } from "@/lib/junior-academy-terms";

const formatRand = (value: number) => `R${value.toFixed(2)}`;

export function ScheduleAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="academy-schedule-list">
      {academySchedules.map((schedule, index) => {
        const rate = academyRates[schedule.rate];
        const isOpen = openIndex === index;
        const panelId = `academy-schedule-${index}`;

        return (
          <section className={`academy-schedule-item${isOpen ? " is-open" : ""}`} key={schedule.title}>
            <button
              type="button"
              className="academy-schedule-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{schedule.title}</span>
              <ChevronDown size={19} aria-hidden="true" />
            </button>
            <div
              className="academy-schedule-collapse"
              id={panelId}
              aria-hidden={!isOpen}
            >
              <div className="academy-schedule-collapse-inner">
                <div className="academy-schedule-panel">
                  {schedule.note ? <p>{schedule.note}</p> : null}
                  <div className="academy-schedule-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Day</th><th>Sessions</th><th>Dates</th><th>Grassroots</th>
                          <th>Groups 7+</th><th>Individual</th><th>Family sharing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.rows.map(([day, sessions, dates]) => (
                          <tr key={day}>
                            <th scope="row">{day}</th>
                            <td>{sessions}</td>
                            <td>{dates}</td>
                            <td>{formatRand(rate.grassroots * sessions)}</td>
                            <td>{formatRand(rate.group * sessions)}</td>
                            <td>{formatRand(rate.individual * sessions)}</td>
                            <td>{formatRand(rate.family * sessions)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
