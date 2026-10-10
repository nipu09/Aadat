const env = require("../config/env");

function isValidDateString(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

// "en-CA" formats as YYYY-MM-DD
function getTodayString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: env.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

module.exports = { isValidDateString, getTodayString };
