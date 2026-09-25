export type DashboardBooking = {
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
  serviceName: string;
  locationName: string;
  clientName: string;
  coachName: string;
  golferName: string;
  isDemo?: boolean;
};

export const demoBookings: DashboardBooking[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    client_id: "20000000-0000-4000-8000-000000000001",
    dependent_id: null,
    coach_id: "30000000-0000-4000-8000-000000000001",
    service_id: "40000000-0000-4000-8000-000000000001",
    location_id: "50000000-0000-4000-8000-000000000001",
    starts_at: "2026-09-26T07:00:00.000Z",
    ends_at: "2026-09-26T07:55:00.000Z",
    status: "confirmed",
    client_notes: "Driver consistency and launch angle.",
    serviceName: "55 minute private lesson",
    locationName: "Durbanville Golf Club",
    clientName: "Michael Adams",
    coachName: "Paul Mackenzie",
    golferName: "Michael Adams",
    isDemo: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    client_id: "20000000-0000-4000-8000-000000000002",
    dependent_id: "60000000-0000-4000-8000-000000000001",
    coach_id: "30000000-0000-4000-8000-000000000002",
    service_id: "40000000-0000-4000-8000-000000000002",
    location_id: "50000000-0000-4000-8000-000000000002",
    starts_at: "2026-09-26T12:30:00.000Z",
    ends_at: "2026-09-26T13:00:00.000Z",
    status: "pending",
    client_notes: "First academy assessment.",
    serviceName: "Junior assessment",
    locationName: "Hazendal Golf",
    clientName: "Sarah Jacobs",
    coachName: "Chanrie van den Berg",
    golferName: "Daniel Jacobs",
    isDemo: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    client_id: "20000000-0000-4000-8000-000000000003",
    dependent_id: null,
    coach_id: "30000000-0000-4000-8000-000000000001",
    service_id: "40000000-0000-4000-8000-000000000003",
    location_id: "50000000-0000-4000-8000-000000000001",
    starts_at: "2026-09-27T08:00:00.000Z",
    ends_at: "2026-09-27T08:30:00.000Z",
    status: "confirmed",
    client_notes: null,
    serviceName: "30 minute private lesson",
    locationName: "Durbanville Golf Club",
    clientName: "Lerato Mokoena",
    coachName: "Paul Mackenzie",
    golferName: "Lerato Mokoena",
    isDemo: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    client_id: "20000000-0000-4000-8000-000000000004",
    dependent_id: "60000000-0000-4000-8000-000000000002",
    coach_id: null,
    service_id: "40000000-0000-4000-8000-000000000002",
    location_id: "50000000-0000-4000-8000-000000000001",
    starts_at: "2026-09-28T13:00:00.000Z",
    ends_at: "2026-09-28T13:30:00.000Z",
    status: "pending",
    client_notes: "Please assign a junior coach.",
    serviceName: "Junior assessment",
    locationName: "Durbanville Golf Club",
    clientName: "James Petersen",
    coachName: "To be assigned",
    golferName: "Mia Petersen",
    isDemo: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    client_id: "20000000-0000-4000-8000-000000000005",
    dependent_id: null,
    coach_id: "30000000-0000-4000-8000-000000000003",
    service_id: "40000000-0000-4000-8000-000000000004",
    location_id: "50000000-0000-4000-8000-000000000002",
    starts_at: "2026-09-29T06:30:00.000Z",
    ends_at: "2026-09-29T08:30:00.000Z",
    status: "confirmed",
    client_notes: "Course management before club championship.",
    serviceName: "On-course lesson",
    locationName: "Hazendal Golf",
    clientName: "Emma Williams",
    coachName: "Carlo Kok",
    golferName: "Emma Williams",
    isDemo: true,
  },
];

export const demoPeople = [
  { id: "20000000-0000-4000-8000-000000000001", first_name: "Michael", last_name: "Adams", email: "michael.adams@example.com", phone: "082 555 0131", is_active: true, roles: ["client"] },
  { id: "20000000-0000-4000-8000-000000000002", first_name: "Sarah", last_name: "Jacobs", email: "sarah.jacobs@example.com", phone: "083 555 0184", is_active: true, roles: ["client"] },
  { id: "30000000-0000-4000-8000-000000000001", first_name: "Paul", last_name: "Mackenzie", email: "paul@example.com", phone: "082 555 0110", is_active: true, roles: ["coach"] },
  { id: "30000000-0000-4000-8000-000000000002", first_name: "Chanrie", last_name: "van den Berg", email: "chanrie@example.com", phone: "084 555 0122", is_active: true, roles: ["coach"] },
  { id: "30000000-0000-4000-8000-000000000003", first_name: "Carlo", last_name: "Kok", email: "carlo@example.com", phone: "072 555 0179", is_active: true, roles: ["coach"] },
  { id: "70000000-0000-4000-8000-000000000001", first_name: "Nicole", last_name: "Botha", email: "reception@example.com", phone: "021 555 0190", is_active: true, roles: ["receptionist"] },
];

export const demoLocations = [
  { id: "50000000-0000-4000-8000-000000000001", name: "Durbanville Golf Club" },
  { id: "50000000-0000-4000-8000-000000000002", name: "Hazendal Golf" },
];

export const demoFamily = [
  { id: "60000000-0000-4000-8000-000000000001", first_name: "Daniel", last_name: "Jacobs", date_of_birth: "2013-04-12", notes: "Junior academy member", isDemo: true },
  { id: "60000000-0000-4000-8000-000000000002", first_name: "Mia", last_name: "Petersen", date_of_birth: "2016-08-03", notes: "New golfer", isDemo: true },
];

export const demoAvailability = [
  { id: "80000000-0000-4000-8000-000000000001", weekday: 1, start_time: "08:00:00", end_time: "16:00:00", location_id: "50000000-0000-4000-8000-000000000001", isDemo: true },
  { id: "80000000-0000-4000-8000-000000000002", weekday: 3, start_time: "10:00:00", end_time: "18:00:00", location_id: "50000000-0000-4000-8000-000000000002", isDemo: true },
  { id: "80000000-0000-4000-8000-000000000003", weekday: 6, start_time: "07:00:00", end_time: "13:00:00", location_id: "50000000-0000-4000-8000-000000000001", isDemo: true },
];

export const demoExceptions = [
  { id: "90000000-0000-4000-8000-000000000001", exception_date: "2026-10-03", is_available: false, start_time: null, end_time: null, note: "Tournament day", isDemo: true },
  { id: "90000000-0000-4000-8000-000000000002", exception_date: "2026-10-09", is_available: true, start_time: "07:00:00", end_time: "11:00:00", note: "Additional morning hours", isDemo: true },
];

export const demoAuditEvents = [
  { id: "a0000000-0000-4000-8000-000000000001", actor_id: "70000000-0000-4000-8000-000000000001", action: "booking.confirmed", entity_type: "booking", entity_id: "10000000-0000-4000-8000-000000000001", created_at: "2026-09-25T06:42:00.000Z" },
  { id: "a0000000-0000-4000-8000-000000000002", actor_id: "30000000-0000-4000-8000-000000000002", action: "availability.updated", entity_type: "coach", entity_id: "30000000-0000-4000-8000-000000000002", created_at: "2026-09-24T13:18:00.000Z" },
  { id: "a0000000-0000-4000-8000-000000000003", actor_id: "20000000-0000-4000-8000-000000000002", action: "booking.created", entity_type: "booking", entity_id: "10000000-0000-4000-8000-000000000002", created_at: "2026-09-24T09:05:00.000Z" },
];
