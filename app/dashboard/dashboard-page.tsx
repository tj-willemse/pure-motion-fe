import { redirect } from "next/navigation";
import { ToastMessage } from "@/components/toast-message";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { dashboardNavigation } from "@/lib/dashboard-navigation";
import { requireDashboardUser } from "@/lib/dashboard";
import {
  demoAuditEvents,
  demoAvailability,
  demoBookings,
  demoExceptions,
  demoFamily,
  demoLocations,
  demoPeople,
  type DashboardBooking,
} from "@/lib/dashboard-demo-data";
import {
  addAvailability,
  addAvailabilityException,
  addDependent,
  assignBookingCoach,
  cancelBooking,
  createBooking,
  removeAvailability,
  removeAvailabilityException,
  removeDependent,
  setUserRole,
  updateBookingStatus,
  updateProfile,
  updateService,
} from "@/app/dashboard/actions";

type DashboardPageProps = {
  section?: string;
  error?: string;
  message?: string;
};

type BookingRow = {
  id: string;
  client_id: string;
  dependent_id: string | null;
  coach_id: string | null;
  service_id: string;
  location_id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  client_notes: string | null;
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

async function loadBookings(user: Awaited<ReturnType<typeof requireDashboardUser>>): Promise<DashboardBooking[]> {
  const { data = [] } = await user.supabase
    .from("bookings")
    .select("id,client_id,dependent_id,coach_id,service_id,location_id,starts_at,ends_at,status,client_notes")
    .order("starts_at", { ascending: true });

  const bookings = data as BookingRow[];
  if (!bookings.length) return demoBookings;
  const serviceIds = [...new Set(bookings.map((item) => item.service_id))];
  const locationIds = [...new Set(bookings.map((item) => item.location_id))];
  const profileIds = [...new Set(bookings.flatMap((item) => [item.client_id, item.coach_id].filter(Boolean) as string[]))];
  const dependentIds = [...new Set(bookings.map((item) => item.dependent_id).filter(Boolean) as string[])];

  const [servicesResult, locationsResult, profilesResult, dependentsResult] = await Promise.all([
    serviceIds.length ? user.supabase.from("services").select("id,name").in("id", serviceIds) : Promise.resolve({ data: [] }),
    locationIds.length ? user.supabase.from("locations").select("id,name").in("id", locationIds) : Promise.resolve({ data: [] }),
    profileIds.length ? user.supabase.from("profiles").select("id,first_name,last_name,email").in("id", profileIds) : Promise.resolve({ data: [] }),
    dependentIds.length ? user.supabase.from("dependents").select("id,first_name,last_name").in("id", dependentIds) : Promise.resolve({ data: [] }),
  ]);

  const services = new Map((servicesResult.data ?? []).map((item) => [item.id, item.name]));
  const locations = new Map((locationsResult.data ?? []).map((item) => [item.id, item.name]));
  const profiles = new Map((profilesResult.data ?? []).map((item) => [item.id, [item.first_name, item.last_name].filter(Boolean).join(" ") || item.email]));
  const dependents = new Map((dependentsResult.data ?? []).map((item) => [item.id, `${item.first_name} ${item.last_name}`]));

  return bookings.map((booking) => ({
    ...booking,
    serviceName: services.get(booking.service_id) ?? "Lesson",
    locationName: locations.get(booking.location_id) ?? "Location pending",
    clientName: profiles.get(booking.client_id) ?? "Client",
    coachName: booking.coach_id ? profiles.get(booking.coach_id) ?? "Coach" : "To be assigned",
    golferName: booking.dependent_id ? dependents.get(booking.dependent_id) ?? "Junior golfer" : profiles.get(booking.client_id) ?? "Client",
    isDemo: false,
  }));
}

export async function DashboardPage({ section = "overview", error, message }: DashboardPageProps) {
  const user = await requireDashboardUser();
  const allowedSections = dashboardNavigation[user.role].map((item) =>
    item.href === "/dashboard" ? "overview" : item.href.split("/").pop() || "overview",
  );
  if (!allowedSections.includes(section)) redirect("/dashboard");

  return (
    <main id="main-content" className="dashboard-content">
      <ToastMessage error={error} message={message} />
      {section === "overview" && <Overview user={user} />}
      {section === "bookings" && <Bookings user={user} />}
      {section === "family" && user.role === "client" && <Family user={user} />}
      {section === "profile" && <Profile user={user} />}
      {section === "schedule" && user.role === "coach" && <Schedule user={user} />}
      {section === "availability" && user.role === "coach" && <Availability user={user} />}
      {section === "clients" && user.role === "coach" && <Clients user={user} />}
      {section === "people" && ["admin", "receptionist"].includes(user.role) && <People user={user} />}
      {section === "services" && ["admin", "receptionist"].includes(user.role) && <Services user={user} />}
      {section === "audit" && user.role === "admin" && <Audit user={user} />}
    </main>
  );
}

async function Overview({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  const bookings = await loadBookings(user);
  const showingDemo = bookings.some((item) => item.isDemo);
  const upcoming = bookings.filter((item) => new Date(item.starts_at) >= new Date() && !["cancelled", "no_show"].includes(item.status));

  if (user.role === "client") {
    const { count: familyCount = 0 } = await user.supabase.from("dependents").select("id", { count: "exact", head: true });
    return (
      <>
        {showingDemo && <DemoNotice />}
        <div className="dashboard-stats">
          <Stat label="Upcoming bookings" value={String(upcoming.length)} />
          <Stat label="Pending requests" value={String(bookings.filter((item) => item.status === "pending").length)} />
          <Stat label="Family golfers" value={String(showingDemo ? demoFamily.length : familyCount ?? 0)} />
        </div>
        <Panel title="Next booking">
          {upcoming[0] ? <BookingSummary booking={upcoming[0]} /> : <Empty text="No upcoming booking. Use Bookings to request a lesson." />}
        </Panel>
      </>
    );
  }

  if (user.role === "coach") {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Johannesburg" });
    const todayBookings = bookings.filter((item) => item.starts_at.slice(0, 10) === today && !["cancelled", "no_show"].includes(item.status));
    const clientCount = new Set(bookings.map((item) => item.client_id)).size;
    return (
      <>
        {showingDemo && <DemoNotice />}
        <div className="dashboard-stats">
          <Stat label="Today" value={String(todayBookings.length)} />
          <Stat label="Upcoming" value={String(upcoming.length)} />
          <Stat label="Clients" value={String(clientCount)} />
        </div>
        <Panel title="Next session">
          {upcoming[0] ? <BookingSummary booking={upcoming[0]} showClient /> : <Empty text="No upcoming sessions." />}
        </Panel>
      </>
    );
  }

  const [{ count: livePeopleCount = 0 }, { count: liveCoachCount = 0 }, { count: livePendingCount = 0 }] = await Promise.all([
    user.supabase.from("profiles").select("id", { count: "exact", head: true }),
    user.supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "coach"),
    user.supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  const peopleCount = showingDemo ? demoPeople.length + 22 : livePeopleCount;
  const coachCount = showingDemo ? demoPeople.filter((person) => person.roles.includes("coach")).length : liveCoachCount;
  const pendingCount = showingDemo ? bookings.filter((booking) => booking.status === "pending").length : livePendingCount;
  return (
    <>
      {showingDemo && <DemoNotice />}
      <div className="dashboard-stats">
        <Stat label="People" value={String(peopleCount ?? 0)} />
        <Stat label="Coaches" value={String(coachCount ?? 0)} />
        <Stat label="Pending bookings" value={String(pendingCount ?? 0)} />
      </div>
      <Panel title="Upcoming bookings">
        {upcoming.length ? <BookingTable bookings={upcoming.slice(0, 6)} staff /> : <Empty text="No upcoming bookings." />}
      </Panel>
    </>
  );
}

async function Bookings({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  const bookings = await loadBookings(user);
  const showingDemo = bookings.some((item) => item.isDemo);
  if (user.role !== "client") {
    const { data: coachRoles = [] } = await user.supabase.from("user_roles").select("user_id").eq("role", "coach");
    const coachIds = (coachRoles ?? []).map((item) => item.user_id);
    const { data: liveCoaches = [] } = coachIds.length
      ? await user.supabase.from("profiles").select("id,first_name,last_name").in("id", coachIds).eq("is_active", true)
      : { data: [] };
    const coaches = liveCoaches?.length
      ? liveCoaches
      : demoPeople.filter((person) => person.roles.includes("coach")).map(({ id, first_name, last_name }) => ({ id, first_name, last_name }));
    return (
      <>
        {showingDemo && <DemoNotice />}
        <Panel title="All bookings">
          {bookings.length ? <BookingTable bookings={bookings} staff coaches={coaches ?? []} /> : <Empty text="No bookings have been created." />}
        </Panel>
      </>
    );
  }

  const [servicesResult, locationsResult, dependentsResult, coachRolesResult] = await Promise.all([
    user.supabase.from("services").select("id,name,duration_minutes,price_cents").eq("is_active", true).order("name"),
    user.supabase.from("locations").select("id,name").eq("is_active", true).order("name"),
    user.supabase.from("dependents").select("id,first_name,last_name").order("first_name"),
    user.supabase.from("user_roles").select("user_id").eq("role", "coach"),
  ]);
  const coachIds = coachRolesResult.data?.map((item) => item.user_id) ?? [];
  const { data: coaches = [] } = coachIds.length
    ? await user.supabase.from("profiles").select("id,first_name,last_name").in("id", coachIds).eq("is_active", true)
    : { data: [] };
  return (
      <>
      {showingDemo && <DemoNotice />}
      <div className="dashboard-two-column">
        <Panel title="Request a booking">
          <form action={createBooking} className="dashboard-form">
            <Field label="Service">
              <select name="serviceId" required defaultValue="">
                <option value="" disabled>Choose a service</option>
                {(servicesResult.data ?? []).map((service) => <option key={service.id} value={service.id}>{service.name} · {formatMoney(service.price_cents)}</option>)}
              </select>
            </Field>
            <Field label="Golfer">
              <select name="dependentId" defaultValue="">
                <option value="">Myself</option>
                {(dependentsResult.data ?? []).map((dependent) => <option key={dependent.id} value={dependent.id}>{dependent.first_name} {dependent.last_name}</option>)}
              </select>
            </Field>
            <Field label="Location">
              <select name="locationId" required defaultValue="">
                <option value="" disabled>Choose a location</option>
                {(locationsResult.data ?? []).map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
              </select>
            </Field>
            <Field label="Coach">
              <select name="coachId" defaultValue="">
                <option value="">Assign the best available coach</option>
                {(coaches ?? []).map((coach) => <option key={coach.id} value={coach.id}>{coach.first_name} {coach.last_name}</option>)}
              </select>
            </Field>
            <div className="dashboard-form-row">
              <Field label="Date"><input name="date" type="date" required /></Field>
              <Field label="Preferred time"><input name="time" type="time" min="07:00" max="18:00" required /></Field>
            </div>
            <Field label="Notes"><textarea name="notes" rows={3} placeholder="Anything the coach should know?" /></Field>
            <PendingSubmitButton pendingLabel="Sending request…">Request booking</PendingSubmitButton>
          </form>
        </Panel>
        <Panel title="Your bookings">
          {bookings.length ? <BookingCards bookings={bookings} /> : <Empty text="You have no bookings yet." />}
        </Panel>
      </div>
    </>
  );
}

async function Family({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  const { data } = await user.supabase
    .from("dependents")
    .select("id,first_name,last_name,date_of_birth,notes")
    .order("first_name");
  const showingDemo = !data?.length;
  const dependents = data?.length ? data.map((item) => ({ ...item, isDemo: false })) : demoFamily;
  return (
    <>
      {showingDemo && <DemoNotice />}
      <div className="dashboard-two-column">
        <Panel title="Add family member">
          <form action={addDependent} className="dashboard-form">
            <div className="dashboard-form-row">
              <Field label="First name"><input name="firstName" required /></Field>
              <Field label="Surname"><input name="lastName" required /></Field>
            </div>
            <Field label="Date of birth"><input name="dateOfBirth" type="date" /></Field>
            <Field label="Notes"><textarea name="notes" rows={3} placeholder="Optional coaching or medical context" /></Field>
            <PendingSubmitButton pendingLabel="Adding…">Add family member</PendingSubmitButton>
          </form>
        </Panel>
        <Panel title="Family members">
          {dependents.length ? (
            <div className="dashboard-list">
              {dependents.map((dependent) => (
                <div key={dependent.id} className="dashboard-list-row">
                  <div><strong>{dependent.first_name} {dependent.last_name}</strong><span>{dependent.date_of_birth || "Date of birth not set"}</span></div>
                  {!dependent.isDemo && <form action={removeDependent}>
                    <input type="hidden" name="dependentId" value={dependent.id} />
                    <PendingSubmitButton className="dashboard-text-button" pendingLabel="Removing…">Remove</PendingSubmitButton>
                  </form>}
                </div>
              ))}
            </div>
          ) : <Empty text="No family members have been added." />}
        </Panel>
      </div>
    </>
  );
}

function Profile({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  return (
    <>
      <Panel title="Personal details" narrow>
        <form action={updateProfile} className="dashboard-form">
          <div className="dashboard-form-row">
            <Field label="First name"><input name="firstName" defaultValue={user.profile.firstName} required /></Field>
            <Field label="Surname"><input name="lastName" defaultValue={user.profile.lastName} required /></Field>
          </div>
          <Field label="Email"><input value={user.email} disabled /><small>Email changes are handled through account support.</small></Field>
          <Field label="Phone"><input name="phone" type="tel" defaultValue={user.profile.phone} autoComplete="tel" /></Field>
          <PendingSubmitButton pendingLabel="Saving…">Save profile</PendingSubmitButton>
        </form>
      </Panel>
    </>
  );
}

async function Schedule({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  const bookings = await loadBookings(user);
  const showingDemo = bookings.some((item) => item.isDemo);
  return (
    <>
      {showingDemo && <DemoNotice />}
      <Panel title="Sessions">
        {bookings.length ? <BookingTable bookings={bookings} staff /> : <Empty text="No sessions are assigned to you." />}
      </Panel>
    </>
  );
}

async function Availability({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  const [availabilityResult, exceptionsResult, locationsResult] = await Promise.all([
    user.supabase.from("coach_availability").select("id,weekday,start_time,end_time,location_id").eq("coach_id", user.userId).order("weekday"),
    user.supabase.from("availability_exceptions").select("id,exception_date,is_available,start_time,end_time,note").eq("coach_id", user.userId).order("exception_date"),
    user.supabase.from("locations").select("id,name").eq("is_active", true).order("name"),
  ]);
  const showingDemo = !availabilityResult.data?.length && !exceptionsResult.data?.length;
  const availability = availabilityResult.data?.length
    ? availabilityResult.data.map((item) => ({ ...item, isDemo: false }))
    : demoAvailability;
  const exceptions = exceptionsResult.data?.length
    ? exceptionsResult.data.map((item) => ({ ...item, isDemo: false }))
    : demoExceptions;
  const locations = new Map([...(locationsResult.data ?? []), ...demoLocations].map((location) => [location.id, location.name]));
  return (
    <>
      {showingDemo && <DemoNotice />}
      <div className="dashboard-two-column">
        <Panel title="Add weekly hours">
          <form action={addAvailability} className="dashboard-form">
            <Field label="Day"><select name="weekday" defaultValue="1">{dayNames.map((day, index) => <option value={index} key={day}>{day}</option>)}</select></Field>
            <Field label="Location"><select name="locationId" required defaultValue=""><option value="" disabled>Choose a location</option>{(locationsResult.data ?? []).map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></Field>
            <div className="dashboard-form-row">
              <Field label="From"><input name="startTime" type="time" required /></Field>
              <Field label="Until"><input name="endTime" type="time" required /></Field>
            </div>
            <PendingSubmitButton pendingLabel="Saving…">Add availability</PendingSubmitButton>
          </form>
        </Panel>
        <Panel title="Weekly hours">
          <div className="dashboard-list">{availability.map((item) => <div className="dashboard-list-row" key={item.id}><div><strong>{dayNames[item.weekday]}</strong><span>{item.start_time.slice(0, 5)}–{item.end_time.slice(0, 5)} · {locations.get(item.location_id)}</span></div>{!item.isDemo && <form action={removeAvailability}><input type="hidden" name="availabilityId" value={item.id} /><PendingSubmitButton className="dashboard-text-button" pendingLabel="Removing…">Remove</PendingSubmitButton></form>}</div>)}</div>
        </Panel>
      </div>
      <div className="dashboard-two-column dashboard-section-gap">
        <Panel title="Change a specific date">
          <form action={addAvailabilityException} className="dashboard-form">
            <Field label="Date"><input name="date" type="date" required /></Field>
            <Field label="Change"><select name="exceptionMode" defaultValue="blocked"><option value="blocked">Unavailable all day</option><option value="available">Add extra working hours</option></select></Field>
            <div className="dashboard-form-row">
              <Field label="From (for extra hours)"><input name="startTime" type="time" /></Field>
              <Field label="Until"><input name="endTime" type="time" /></Field>
            </div>
            <Field label="Note"><input name="note" placeholder="Optional reason" /></Field>
            <PendingSubmitButton pendingLabel="Saving…">Save date change</PendingSubmitButton>
          </form>
        </Panel>
        <Panel title="Date changes">
          <div className="dashboard-list">{exceptions.map((item) => <div className="dashboard-list-row" key={item.id}><div><strong>{item.exception_date}</strong><span>{item.is_available ? `${item.start_time?.slice(0, 5)}–${item.end_time?.slice(0, 5)} extra hours` : "Unavailable all day"}{item.note ? ` · ${item.note}` : ""}</span></div>{!item.isDemo && <form action={removeAvailabilityException}><input type="hidden" name="exceptionId" value={item.id} /><PendingSubmitButton className="dashboard-text-button" pendingLabel="Removing…">Remove</PendingSubmitButton></form>}</div>)}</div>
        </Panel>
      </div>
    </>
  );
}

async function Clients({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  const bookings = await loadBookings(user);
  const showingDemo = bookings.some((item) => item.isDemo);
  const clients = [...new Map(bookings.map((booking) => [booking.client_id, { id: booking.client_id, name: booking.clientName }])).values()];
  return (
    <>
      {showingDemo && <DemoNotice />}
      <Panel title="Client list">
        {clients.length ? <div className="dashboard-list">{clients.map((client) => <div className="dashboard-list-row" key={client.id}><div><strong>{client.name}</strong><span>{bookings.filter((booking) => booking.client_id === client.id).length} booking(s)</span></div></div>)}</div> : <Empty text="No clients are assigned yet." />}
      </Panel>
    </>
  );
}

async function People({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  const [profilesResult, rolesResult] = await Promise.all([
    user.supabase.from("profiles").select("id,first_name,last_name,email,phone,is_active").order("first_name"),
    user.supabase.from("user_roles").select("user_id,role"),
  ]);
  const roleMap = new Map<string, string[]>();
  (rolesResult.data ?? []).forEach((item) => roleMap.set(item.user_id, [...(roleMap.get(item.user_id) ?? []), item.role]));
  const showingDemo = !profilesResult.data?.length || profilesResult.data.length === 1;
  const profiles = showingDemo
    ? [...(profilesResult.data ?? []).map((profile) => ({ ...profile, isDemo: false })), ...demoPeople.map((profile) => ({ ...profile, isDemo: true }))]
    : (profilesResult.data ?? []).map((profile) => ({ ...profile, isDemo: false }));
  demoPeople.forEach((person) => roleMap.set(person.id, person.roles));
  return (
    <>
      {showingDemo && <DemoNotice />}
      <Panel title="Accounts">
        <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>Name</th><th>Contact</th><th>Access</th>{user.role === "admin" && <th>Change access</th>}</tr></thead><tbody>{profiles.map((profile) => <tr key={profile.id}><td><strong>{[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Unnamed account"}</strong></td><td>{profile.email}<small>{profile.phone || "No phone"}</small></td><td>{(roleMap.get(profile.id) ?? ["client"]).join(", ")}</td>{user.role === "admin" && <td>{profile.isDemo ? <span className="dashboard-demo-row">Sample account</span> : <form action={setUserRole} className="role-form"><input type="hidden" name="userId" value={profile.id} /><select name="role" defaultValue="coach"><option value="client">Client</option><option value="coach">Coach</option><option value="receptionist">Receptionist</option><option value="admin">Admin</option></select><PendingSubmitButton className="dashboard-table-action" pendingLabel="Saving…" name="mode" value="add">Add</PendingSubmitButton><PendingSubmitButton className="dashboard-table-action is-muted" pendingLabel="Saving…" name="mode" value="remove">Remove</PendingSubmitButton></form>}</td>}</tr>)}</tbody></table></div>
      </Panel>
    </>
  );
}

async function Services({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  const { data } = await user.supabase.from("services").select("id,name,duration_minutes,price_cents,is_active").order("name");
  const services = data ?? [];
  return (
    <>
      <div className="dashboard-service-grid">{services.map((service) => <Panel key={service.id} title={service.name}><form action={updateService} className="dashboard-form compact"><input type="hidden" name="serviceId" value={service.id} /><Field label="Name"><input name="name" defaultValue={service.name} required /></Field><div className="dashboard-form-row"><Field label="Minutes"><input name="duration" type="number" min="15" defaultValue={service.duration_minutes} required /></Field><Field label="Price (R)"><input name="price" type="number" min="0" step="0.01" defaultValue={(service.price_cents / 100).toFixed(2)} required /></Field></div><label className="dashboard-checkbox"><input name="active" type="checkbox" defaultChecked={service.is_active} />Available for booking</label><PendingSubmitButton pendingLabel="Saving…">Save service</PendingSubmitButton></form></Panel>)}</div>
    </>
  );
}

async function Audit({ user }: { user: Awaited<ReturnType<typeof requireDashboardUser>> }) {
  const { data } = await user.supabase.from("audit_events").select("id,actor_id,action,entity_type,entity_id,created_at").order("created_at", { ascending: false }).limit(100);
  const showingDemo = !data?.length;
  const events = data?.length ? data : demoAuditEvents;
  return (
    <>
      {showingDemo && <DemoNotice />}
      <Panel title="Recent activity">
        {events.length ? <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>Date</th><th>Action</th><th>Entity</th><th>Actor</th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td>{formatDateTime(event.created_at)}</td><td>{event.action.replaceAll(".", " ")}</td><td>{event.entity_type}{event.entity_id ? ` · ${event.entity_id.slice(0, 8)}` : ""}</td><td>{event.actor_id?.slice(0, 8) || "System"}</td></tr>)}</tbody></table></div> : <Empty text="No audit activity yet." />}
      </Panel>
    </>
  );
}

function BookingCards({ bookings }: { bookings: Awaited<ReturnType<typeof loadBookings>> }) {
  return <div className="booking-card-list">{bookings.map((booking) => <article className="booking-card" key={booking.id}><div><strong>{booking.serviceName}</strong><span>{formatDateTime(booking.starts_at)}</span></div><dl><div><dt>Golfer</dt><dd>{booking.golferName}</dd></div><div><dt>Coach</dt><dd>{booking.coachName}</dd></div><div><dt>Location</dt><dd>{booking.locationName}</dd></div><div><dt>Status</dt><dd className={`status-${booking.status}`}>{booking.status}</dd></div></dl>{!booking.isDemo && ["pending", "confirmed"].includes(booking.status) && <form action={cancelBooking}><input type="hidden" name="bookingId" value={booking.id} /><PendingSubmitButton className="dashboard-text-button" pendingLabel="Cancelling…">Cancel booking</PendingSubmitButton></form>}</article>)}</div>;
}

function BookingTable({ bookings, staff = false, coaches = [] }: { bookings: Awaited<ReturnType<typeof loadBookings>>; staff?: boolean; coaches?: { id: string; first_name: string | null; last_name: string | null }[] }) {
  return <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>Date</th>{staff && <th>Client</th>}<th>Service</th><th>Coach</th><th>Location</th><th>Status</th>{staff && <th>Update</th>}</tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id}><td>{formatDateTime(booking.starts_at)}</td>{staff && <td>{booking.clientName}<small>{booking.golferName !== booking.clientName ? booking.golferName : ""}</small></td>}<td>{booking.serviceName}</td><td>{booking.coachName}{!booking.isDemo && coaches.length > 0 && <form action={assignBookingCoach} className="assignment-form"><input type="hidden" name="bookingId" value={booking.id} /><select name="coachId" defaultValue={booking.coach_id ?? ""} required><option value="" disabled>Assign coach</option>{coaches.map((coach) => <option key={coach.id} value={coach.id}>{coach.first_name} {coach.last_name}</option>)}</select><PendingSubmitButton className="dashboard-table-action" pendingLabel="Assigning…">Assign</PendingSubmitButton></form>}</td><td>{booking.locationName}</td><td className={`status-${booking.status}`}>{booking.status}</td>{staff && <td>{booking.isDemo ? <span className="dashboard-demo-row">Sample booking</span> : <form action={updateBookingStatus} className="status-form"><input type="hidden" name="bookingId" value={booking.id} /><select name="status" defaultValue={booking.status}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No show</option></select><PendingSubmitButton className="dashboard-table-action" pendingLabel="Saving…">Save</PendingSubmitButton></form>}</td>}</tr>)}</tbody></table></div>;
}

function BookingSummary({ booking, showClient = false }: { booking: Awaited<ReturnType<typeof loadBookings>>[number]; showClient?: boolean }) {
  return <div className="booking-summary"><div><span>Date</span><strong>{formatDateTime(booking.starts_at)}</strong></div>{showClient && <div><span>Client</span><strong>{booking.clientName}</strong></div>}<div><span>Service</span><strong>{booking.serviceName}</strong></div><div><span>Coach</span><strong>{booking.coachName}</strong></div><div><span>Location</span><strong>{booking.locationName}</strong></div></div>;
}

function DemoNotice() {
  return <p className="dashboard-demo-notice">Showing realistic sample records until live data is available.</p>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="dashboard-stat"><span>{label}</span><strong>{value}</strong></div>;
}

function Panel({ title, children, narrow = false }: { title: string; children: React.ReactNode; narrow?: boolean }) {
  return <section className={`dashboard-panel${narrow ? " is-narrow" : ""}`}><h2>{title}</h2>{children}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="dashboard-field"><span>{label}</span>{children}</label>;
}

function Empty({ text }: { text: string }) {
  return <p className="dashboard-empty">{text}</p>;
}
