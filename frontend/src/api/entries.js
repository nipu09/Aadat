import { request } from "./client.js";

// status: 0 = not done, 1 = half done, 2 = done. Dates are "YYYY-MM-DD".
export const entries = {
  // → { "2026-10-09": 2, ... } (only non-zero days)
  async forYear(habitId, year) {
    const data = await request(`/api/habits/${habitId}/entries/${year}`);
    return Object.fromEntries(data.entries.map((e) => [e.date, e.status]));
  },

  // status 0 clears the day
  async set(habitId, date, status) {
    await request(`/api/habits/${habitId}/entries/${date}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};
