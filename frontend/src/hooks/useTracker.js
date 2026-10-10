import { useEffect, useMemo, useState } from "react";
import { habits as habitsApi, entries } from "../api/index.js";
import { DONE, HALF, fmt } from "../utils.js";

// All data + business logic for the tracker page. The page component only renders.
export default function useTracker() {
  const thisYear = new Date().getFullYear();
  const todayKey = fmt(new Date());

  const [habits, setHabits] = useState([]);
  const [sel, setSel] = useState(null);
  const [log, setLog] = useState({});
  const [year, setYear] = useState(thisYear);
  const [view, setView] = useState("year");
  const [err, setErr] = useState("");

  useEffect(() => {
    habitsApi
      .list()
      .then((h) => { setHabits(h); setSel(h[0]?.id ?? null); })
      .catch(() => setErr("Couldn't load your habits."));
  }, []);

  useEffect(() => {
    if (sel == null) { setLog({}); return; }
    let stale = false;
    setLog({}); // don't show the previous habit's data while loading
    entries
      .forYear(sel, year)
      .then((l) => !stale && setLog(l))
      .catch(() => !stale && setErr("Couldn't load this year."));
    return () => { stale = true; };
  }, [sel, year]);

  const habit = habits.find((h) => h.id === sel);

  const setDay = async (key, v) => {
    const prev = log[key] || 0;
    const inView = key.startsWith(`${year}-`);

    // optimistic update, only for the year currently on screen
    if (inView) {
      setLog((l) => { const n = { ...l }; if (v) n[key] = v; else delete n[key]; return n; });
    }

    try {
      await entries.set(sel, key, v);
    } catch {
      // roll back to what it was before
      if (inView) {
        setLog((l) => { const n = { ...l }; if (prev) n[key] = prev; else delete n[key]; return n; });
      }
      setErr("Couldn't save that day. Try again.");
    }
  };

  const cycle = (key) => setDay(key, !log[key] ? DONE : log[key] === DONE ? HALF : 0);

  // returns true when the habit was added (so the form can clear itself)
  const addHabit = async (name) => {
    try {
      const h = await habitsApi.create(name);
      setHabits((x) => [...x, h]);
      setSel(h.id);
      return true;
    } catch {
      setErr("Couldn't add that habit.");
      return false;
    }
  };

  const removeHabit = async () => {
    try {
      await habitsApi.remove(habit.id);
      const rest = habits.filter((h) => h.id !== habit.id);
      setHabits(rest);
      setSel(rest[0]?.id ?? null);
    } catch {
      setErr("Couldn't delete that habit.");
    }
  };

  const stats = useMemo(() => {
    const vals = Object.values(log);
    let streak = 0;
    const d = new Date();
    if (!log[fmt(d)]) d.setDate(d.getDate() - 1);
    while (log[fmt(d)] === DONE) { streak++; d.setDate(d.getDate() - 1); }
    return {
      done: vals.filter((v) => v === DONE).length,
      half: vals.filter((v) => v === HALF).length,
      streak,
    };
  }, [log]);

  return {
    habits, sel, setSel, habit,
    log, year, setYear, view, setView,
    err, setErr,
    setDay, cycle, addHabit, removeHabit,
    stats, thisYear, todayKey, todayV: log[todayKey] || 0,
  };
}
