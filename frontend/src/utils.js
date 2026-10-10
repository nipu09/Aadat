export const DONE = 2, HALF = 1;
export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const LABEL = { 0: "Not done", [HALF]: "Half done", [DONE]: "Done" };
const pad = (n) => String(n).padStart(2, "0");
export const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`