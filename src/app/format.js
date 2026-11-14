/**
 * Escape dynamic text for safe insertion into HTML templates.
 * @param {string|number|null|undefined} value
 * @returns {string}
 */
export const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

/**
 * Format an ISO date string into French short ledger format (e.g. "4 Avr. 04").
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (!dateStr || Number.isNaN(date.getTime())) {
    return dateStr ? String(dateStr) : "";
  }
  const ye = new Intl.DateTimeFormat("fr", { year: "numeric" }).format(date);
  const mo = new Intl.DateTimeFormat("fr", { month: "short" }).format(date);
  const da = new Intl.DateTimeFormat("fr", { day: "2-digit" }).format(date);
  const month = mo.charAt(0).toUpperCase() + mo.slice(1);
  return `${parseInt(da, 10)} ${month.substr(0, 3)}. ${ye.toString().substr(2, 4)}`;
};

/**
 * Map a bill status key to its localized French label.
 * @param {string} status
 * @returns {string}
 */
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente";
    case "accepted":
      return "Validée";
    case "refused":
      return "Refusée";
    default:
      return status ? String(status) : "En attente";
  }
};

/**
 * Return status metadata for badge styling and French labels.
 * @param {string} status
 * @returns {{ label: string, modifier: string }}
 */
export const getStatusMeta = (status) => {
  if (status === "accepted") {
    return { label: "Validée", modifier: "status-pill--accepted" };
  }
  if (status === "refused") {
    return { label: "Refusée", modifier: "status-pill--refused" };
  }
  return { label: "En attente", modifier: "status-pill--pending" };
};

/**
 * Format a numeric euro amount cleanly without trailing noise.
 * @param {number|string} value
 * @returns {string}
 */
export const formatEuro = (value) => {
  const n = Number(value) || 0;
  return `${Number.isInteger(n) ? n : n.toFixed(2).replace(".", ",")} €`;
};

/**
 * Compute counts and euro totals per status from a bill list.
 * @param {Array<object>} bills
 * @returns {{ counts: Record<string, number>, sums: Record<string, number> }}
 */
export const computeBillSummary = (bills) => {
  const counts = { pending: 0, accepted: 0, refused: 0 };
  const sums = { pending: 0, accepted: 0, refused: 0 };
  (bills || []).forEach((bill) => {
    const key =
      bill && (bill.status === "accepted" || bill.status === "refused")
        ? bill.status
        : "pending";
    counts[key] += 1;
    sums[key] += Number(bill?.amount) || 0;
  });
  return { counts, sums };
};

/**
 * Extract readable display name from an email or name fields.
 * @param {object} bill
 * @returns {string}
 */
export const formatEmployeeName = (bill) => {
  const email = bill?.email || "";
  if (email === "employee@test.tld") return "Employé démo";
  const local = email.split("@")[0] || "Collaborateur";
  if (local.includes(".")) {
    return local
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  return local;
};

/**
 * Read and consume a JSON flash message stored in sessionStorage.
 * Safe in environments where sessionStorage is unavailable.
 * @param {string} key
 * @returns {object|null}
 */
export const consumeFlash = (key) => {
  try {
    const raw = window.sessionStorage?.getItem(key);
    if (!raw) return null;
    window.sessionStorage.removeItem(key);
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Store a temporary flash message in sessionStorage.
 * @param {string} key
 * @param {object} payload
 */
export const setFlash = (key, payload) => {
  try {
    window.sessionStorage?.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore storage errors in restricted test contexts
  }
};
