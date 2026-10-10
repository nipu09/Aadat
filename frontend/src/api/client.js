// Shared fetch wrapper. Every API module goes through this.
// In production, set VITE_API_URL (or leave it empty if /api is proxied on the same domain).
const BASE = (
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : "")
).replace(/\/$/, "");

export async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      credentials: "include", // send/store the auth cookie
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    const error = new Error("Can't reach the server. Check your connection and try again.");
    error.status = 0;
    throw error;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // response had no JSON body
  }

  if (!res.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = res.status;
    error.code = data?.code; // e.g. "EMAIL_NOT_VERIFIED"
    throw error;
  }

  return data;
}

export const post = (path, body) =>
  request(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });
