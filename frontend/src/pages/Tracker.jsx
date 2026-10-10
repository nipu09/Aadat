import { useState } from "react";
import { DONE, HALF, LABEL } from "../utils.js";
import LoopVideo from "../components/LoopVideo.jsx";
import Heatmap, { cellCls } from "../components/Heatmap.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useTracker from "../hooks/useTracker.js";

const card = "mb-6 border-[3px] border-ink bg-card p-5 shadow-hard";
const press = "cursor-pointer border-2 border-ink shadow-hard-sm transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";
const PICK = { 0: "bg-tan", [HALF]: "bg-mustard", [DONE]: "bg-rust text-cream" };

export default function Tracker() {
  const { user, logout } = useAuth();
  const {
    habits, sel, setSel, habit, log, year, setYear, view, setView, err, setErr,
    setDay, cycle, addHabit, removeHabit, stats, thisYear, todayKey, todayV,
  } = useTracker();
  const [name, setName] = useState("");

  const addHabitSubmit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    if (await addHabit(n)) setName("");
  };

  const removeHabitClick = () => {
    if (confirm(`Delete "${habit.name}" and all its history?`)) removeHabit();
  };

  return (
    <main className="mx-auto max-w-345 px-5 pt-8 pb-45 sm:pb-52.5 motion-reduce:pb-16">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(56px,11vw,96px)] leading-[.95] tracking-[1px] text-rust [text-shadow:4px_4px_0_var(--color-ink)]">AAdat</h1>
          <p className="mt-3 text-sm">आदत · small days, stacked up</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="hidden w-30 flex-col gap-[5px] sm:flex" aria-hidden="true">
            <i className="h-[11px] border-2 border-ink bg-rust" />
            <i className="h-[11px] border-2 border-ink bg-mustard" />
            <i className="h-[11px] border-2 border-ink bg-olive" />
          </div>
          <div className="flex items-center gap-2.5 text-[13px]">
            <span>Hi, {user.name}</span>
            <button onClick={logout} className={`${press} rounded-full bg-paper2 px-3 py-1 hover:bg-rust hover:text-cream`}>Log out</button>
          </div>
        </div>
      </header>

      {err && (
        <p role="alert" className="mb-5 flex justify-between gap-3 border-2 border-rust bg-[#f6c9b8] px-3 py-2 text-[13px]">
          {err}<button onClick={() => setErr("")} className="cursor-pointer font-bold" aria-label="Dismiss">×</button>
        </p>
      )}

      <div className="grid items-start gap-7 md:grid-cols-[250px_minmax(0,1fr)]">
        <nav aria-label="Habits" className="flex flex-col gap-2.5 md:sticky md:top-5">
          {habits.map((h) => (
            <button
              key={h.id}
              onClick={() => setSel(h.id)}
              className={`w-full cursor-pointer rounded-md border-2 border-ink px-3.5 py-2.5 text-left wrap-anywhere transition active:translate-x-0.5 active:translate-y-0.5 ${h.id === sel ? "bg-ink text-paper shadow-[4px_4px_0_var(--color-rust)]" : "bg-paper2 shadow-hard-sm"}`}
            >
              {h.name}
            </button>
          ))}
          <form onSubmit={addHabitSubmit} className="mt-2 flex flex-col gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New habit…" maxLength={40}
              aria-label="New habit name" className="w-full rounded-md border-2 border-ink bg-cream px-3 py-2" />
            <button type="submit" className={`${press} rounded-md bg-mustard px-3.5 py-2 font-bold`}>Add</button>
          </form>
          <LoopVideo name="workout" className="h-auto w-full border-[3px] border-paper2 [image-rendering:pixelated]" />

        </nav>

        <div className="min-w-0">
          {!habit ? (
            <section className={`${card} text-center`}><p>No habits yet. Type one on the left and press Add.</p></section>
          ) : (
            <>
              <section className={`${card} flex flex-wrap items-center justify-between gap-4`}>
                <div>
                  <h2 className="mb-1.5 font-display text-[28px] font-normal">{habit.name}</h2>
                  <p>How did today go? <b>{LABEL[todayV]}</b></p>
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Mark today">
                  {[[DONE, "Done"], [HALF, "Half done"], [0, "Not done"]].map(([v, t]) => (
                    <button key={t} onClick={() => setDay(todayKey, v)}
                      className={`${press} rounded-full px-3.5 py-1.5 font-bold ${PICK[v]} ${todayV === v ? "outline-3 outline-offset-2 outline-ink" : ""}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </section>

              <section className={`${card} mb-0`}>
                <div className="mb-4 flex flex-wrap justify-between gap-3">
                  <div className="flex items-center gap-3 text-[22px]">
                    <button onClick={() => setYear(year - 1)} aria-label="Previous year" className={`${press} rounded-full bg-paper2 px-3 text-xl`}>‹</button>
                    <strong>{year}</strong>
                    <button onClick={() => setYear(year + 1)} aria-label="Next year" className={`${press} rounded-full bg-paper2 px-3 text-xl`}>›</button>
                  </div>
                  <div className="flex overflow-hidden rounded-full border-2 border-ink shadow-hard-sm" role="group" aria-label="View">
                    {[["year", "Year"], ["months", "Months"]].map(([v, t]) => (
                      <button key={v} onClick={() => setView(v)} className={`cursor-pointer border-ink px-4 py-1.5 first:border-r-2 ${view === v ? "bg-ink text-paper" : "bg-paper2"}`}>{t}</button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4.5">
                    <span><b className="text-xl text-rust">{stats.done}</b> done</span>
                    <span><b className="text-xl text-rust">{stats.half}</b> half</span>
                    {year === thisYear && <span><b className="text-xl text-rust">{stats.streak}</b> day streak</span>}
                  </div>
                </div>

                <Heatmap year={year} view={view} log={log} onCycle={cycle} />

                <footer className="mt-2 flex flex-wrap items-center gap-x-4.5 gap-y-2 text-[13px]">
                  {[0, HALF, DONE].map((v) => (
                    <span key={v} className="flex items-center gap-1.5"><i className={cellCls(v)} /> {LABEL[v]}</span>
                  ))}
                  <em className="opacity-70">Tap a square to cycle through them.</em>
                  <button onClick={removeHabitClick} className="ml-auto cursor-pointer rounded-full border-2 border-ink px-3 py-1 text-xs hover:bg-rust hover:text-cream">Delete habit</button>
                </footer>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}