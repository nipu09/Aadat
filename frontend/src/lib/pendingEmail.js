// Remembers which email is waiting for verification, so a page refresh on
// /verify-email doesn't lose it. Cleared once verified.
const KEY = "aadat:pendingEmail";

export const getPendingEmail = () => {
  try { return sessionStorage.getItem(KEY) || ""; } catch { return ""; }
};
export const setPendingEmail = (email) => {
  try { sessionStorage.setItem(KEY, email); } catch { /* storage unavailable */ }
};
export const clearPendingEmail = () => {
  try { sessionStorage.removeItem(KEY); } catch { /* storage unavailable */ }
};
