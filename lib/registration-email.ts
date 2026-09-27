import "server-only";

type RegistrationEmail = {
  reference: string;
  parentName: string;
  parentEmail: string;
  playerName: string;
  division: string;
  roundDates: string[];
  totalCents: number;
  paymentUrl?: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[character] ?? character);
}

function money(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

async function sendEmail(to: string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.REGISTRATION_FROM_EMAIL;
  if (!apiKey || !from || !to.length) return { sent: false, reason: "Email delivery is not configured." };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!response.ok) return { sent: false, reason: `Email provider returned ${response.status}.` };
  return { sent: true as const };
}

export async function sendRegistrationReceivedEmails(registration: RegistrationEmail) {
  const dates = registration.roundDates.map((date) => `<li>${escapeHtml(date)}</li>`).join("");
  const details = `
    <p><strong>Reference:</strong> ${escapeHtml(registration.reference)}</p>
    <p><strong>Player:</strong> ${escapeHtml(registration.playerName)}</p>
    <p><strong>Division:</strong> ${escapeHtml(registration.division)}</p>
    <p><strong>Amount:</strong> ${escapeHtml(money(registration.totalCents))}</p>
    <p><strong>Selected rounds:</strong></p><ul>${dates}</ul>`;

  const customer = await sendEmail(
    [registration.parentEmail],
    `${registration.reference} — Order of Merit registration received`,
    `<p>Hello ${escapeHtml(registration.parentName)},</p><p>We have received the Order of Merit registration.</p>${details}<p>Complete checkout on the website payment page. This receipt does not confirm payment or a place in the competition.</p>${registration.paymentUrl ? `<p><a href="${escapeHtml(registration.paymentUrl)}">View payment status and continue checkout</a></p><p>Keep this private link secure.</p>` : ""}`,
  );

  const teamEmail = process.env.REGISTRATION_TEAM_EMAIL;
  const team = teamEmail
    ? await sendEmail(
        [teamEmail],
        `New Order of Merit registration — ${registration.reference}`,
        `<p>A new Order of Merit registration needs review.</p>${details}<p>Parent: ${escapeHtml(registration.parentName)} · ${escapeHtml(registration.parentEmail)}</p>`,
      )
    : { sent: false, reason: "Team email is not configured." };

  return { customer, team };
}

export async function sendRegistrationStatusEmail(registration: Pick<RegistrationEmail, "reference" | "parentName" | "parentEmail" | "playerName"> & {
  registrationStatus: string;
  paymentStatus: string;
}) {
  const readableRegistration = registration.registrationStatus.replaceAll("_", " ");
  const readablePayment = registration.paymentStatus.replaceAll("_", " ");
  return sendEmail(
    [registration.parentEmail],
    `${registration.reference} — registration status updated`,
    `<p>Hello ${escapeHtml(registration.parentName)},</p><p>The Order of Merit registration for ${escapeHtml(registration.playerName)} has been updated.</p><p><strong>Registration:</strong> ${escapeHtml(readableRegistration)}</p><p><strong>Payment:</strong> ${escapeHtml(readablePayment)}</p><p><strong>Reference:</strong> ${escapeHtml(registration.reference)}</p>`,
  );
}
