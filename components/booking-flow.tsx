"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";
import { coaches, formatRand, services } from "@/lib/site";

type BookingFlowProps = {
  initialService?: string;
  initialCoach?: string;
  initialLocation?: string;
};

const locations = [
  { id: "durbanville", name: "Durbanville Golf Club", short: "Durbanville", note: "Northern Suburbs" },
  { id: "hazendal", name: "Hazendal Golf, Stellenbosch", short: "Hazendal", note: "Stellenbosch" },
] as const;

const days = [
  { id: "tue-22", day: "Tue", date: "22", month: "Sep" },
  { id: "wed-23", day: "Wed", date: "23", month: "Sep" },
  { id: "thu-24", day: "Thu", date: "24", month: "Sep" },
  { id: "fri-25", day: "Fri", date: "25", month: "Sep" },
  { id: "sat-26", day: "Sat", date: "26", month: "Sep" },
] as const;

const times = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"];

export function BookingFlow({ initialService, initialCoach, initialLocation }: BookingFlowProps) {
  const validService = services.some((service) => service.id === initialService)
    ? initialService
    : undefined;
  const validCoach = coaches.some((coach) => coach.id === initialCoach) ? initialCoach : undefined;
  const validLocation = locations.some((location) => location.id === initialLocation)
    ? initialLocation
    : undefined;
  const [serviceId, setServiceId] = useState<string | undefined>(validService);
  const [locationId, setLocationId] = useState<string | undefined>(validLocation);
  const [coachId, setCoachId] = useState<string | undefined>(validCoach);
  const [dayId, setDayId] = useState<string>();
  const [time, setTime] = useState<string>();
  const [complete, setComplete] = useState(false);

  const step = !serviceId ? 1 : !locationId ? 2 : !coachId ? 3 : 4;
  const selectedService = services.find((service) => service.id === serviceId);
  const selectedLocation = locations.find((location) => location.id === locationId);
  const selectedCoach = coaches.find((coach) => coach.id === coachId);
  const selectedDay = days.find((day) => day.id === dayId);
  const availableCoaches = useMemo(
    () => coaches.filter((coach) => coach.location.toLowerCase() === locationId),
    [locationId],
  );

  function chooseLocation(id: string) {
    setLocationId(id);
    const currentCoach = coaches.find((coach) => coach.id === coachId);
    if (currentCoach?.location.toLowerCase() !== id) setCoachId(undefined);
    setDayId(undefined);
    setTime(undefined);
  }

  function goBack() {
    if (step === 4) {
      setCoachId(undefined);
      setDayId(undefined);
      setTime(undefined);
    } else if (step === 3) {
      setLocationId(undefined);
      setCoachId(undefined);
    } else if (step === 2) {
      setServiceId(undefined);
    }
  }

  if (complete) {
    return (
      <div className="booking-complete">
        <span className="complete-icon"><Check size={30} strokeWidth={2} /></span>
        <h2>Your selection looks good.</h2>
        <p>
          This interface is ready for the live calendar, customer account, deposit and
          confirmation systems to be connected during backend development.
        </p>
        <button className="button" type="button" onClick={() => setComplete(false)}>
          Review selection
        </button>
      </div>
    );
  }

  return (
    <div className="booking-layout">
      <aside className="booking-summary">
        <div className="booking-summary-head">
          <p>Your booking</p>
          <span>Not confirmed</span>
        </div>
        <div className="summary-items">
          <SummaryRow icon={CalendarDays} label="Lesson" value={selectedService?.shortTitle} />
          <SummaryRow icon={MapPin} label="Location" value={selectedLocation?.short} />
          <SummaryRow icon={UserRound} label="Coach" value={selectedCoach?.name} />
          <SummaryRow
            icon={Clock3}
            label="Date & time"
            value={selectedDay && time ? `${selectedDay.day} ${selectedDay.date} Sep, ${time}` : undefined}
          />
        </div>
        <div className="summary-total">
          <span>Lesson price</span>
          <strong>{selectedService ? formatRand(selectedService.price) : "Not selected"}</strong>
        </div>
        <p className="summary-note">No booking or payment is sent from this UI prototype.</p>
      </aside>

      <section className="booking-panel" aria-live="polite">
        <div className="booking-progress" aria-label={`Step ${step} of 4`}>
          {[1, 2, 3, 4].map((number) => (
            <span key={number} className={number <= step ? "active" : ""} />
          ))}
        </div>
        <div className="booking-panel-heading">
          <div>
            <p>Step {step} of 4</p>
            <h1>
              {step === 1 && "What would you like to book?"}
              {step === 2 && "Where would you like to play?"}
              {step === 3 && "Choose your coach."}
              {step === 4 && "Choose a time that works."}
            </h1>
          </div>
          {step > 1 && (
            <button className="back-button" type="button" onClick={goBack}>
              <ArrowLeft size={17} /> Back
            </button>
          )}
        </div>

        {step === 1 && (
          <div className="option-list">
            {services.map((service) => (
              <button
                className="option-row"
                type="button"
                key={service.id}
                onClick={() => setServiceId(service.id)}
              >
                <span className="option-main">
                  <strong>{service.title}</strong>
                  <small>{service.description}</small>
                </span>
                <span className="option-price">
                  <small>{service.duration}</small>
                  <strong>From {formatRand(service.price)}</strong>
                </span>
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="location-options">
            {locations.map((location) => (
              <button type="button" key={location.id} onClick={() => chooseLocation(location.id)}>
                <span className="location-option-icon"><MapPin size={21} /></span>
                <strong>{location.name}</strong>
                <small>{location.note}</small>
                <span className="choose-label">Choose <ArrowRight size={16} /></span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="coach-options">
            {availableCoaches.map((coach) => (
              <button type="button" key={coach.id} onClick={() => setCoachId(coach.id)}>
                <span className="coach-avatar">{coach.name.split(" ").map((name) => name[0]).join("")}</span>
                <span><strong>{coach.name}</strong><small>{coach.availability}</small></span>
                <ArrowRight size={19} />
              </button>
            ))}
            <button type="button" onClick={() => setCoachId(availableCoaches[0]?.id)}>
              <span className="coach-avatar any"><UserRound size={20} /></span>
              <span><strong>No preference</strong><small>Show the first available coach</small></span>
              <ArrowRight size={19} />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="time-picker">
            <div className="day-strip">
              {days.map((day) => (
                <button
                  type="button"
                  key={day.id}
                  className={dayId === day.id ? "selected" : ""}
                  onClick={() => { setDayId(day.id); setTime(undefined); }}
                >
                  <small>{day.day}</small><strong>{day.date}</strong><small>{day.month}</small>
                </button>
              ))}
            </div>
            {dayId ? (
              <>
                <p className="available-label">Available times</p>
                <div className="time-grid">
                  {times.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={time === slot ? "selected" : ""}
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <button
                  className="button booking-continue"
                  type="button"
                  disabled={!time}
                  onClick={() => setComplete(true)}
                >
                  Continue to details <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <div className="select-day-message"><CalendarDays size={25} /><p>Select a day to see available times.</p></div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value?: string;
}) {
  return (
    <div className={value ? "summary-row complete" : "summary-row"}>
      <Icon size={18} aria-hidden="true" />
      <span><small>{label}</small><strong>{value ?? "To be selected"}</strong></span>
      {value && <Check size={16} className="summary-check" aria-hidden="true" />}
    </div>
  );
}
