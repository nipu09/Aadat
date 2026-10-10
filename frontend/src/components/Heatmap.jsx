import { useMemo } from "react";
import { DONE, HALF, LABEL, MONTHS, fmt } from "../utils.js";

const FILL = { 0: "bg-tan", [HALF]: "bg-mustard", [DONE]: "bg-rust" };
export const cellCls = (v) => `inline-block size-[15px] rounded-[3px] border-[1.5px] border-ink p-0 ${FILL[v]}`;

// view: "year" | "months"   log: { "YYYY-MM-DD": 1|2 }   onCycle(dateKey)
export default function Heatmap({ year, view, log, onCycle }) {
  const today = new Date(), todayKey = fmt(today);

  const { cells, cols, monthCols } = useMemo(() => {
    const first = new Date(year, 0, 1);
    const cells = Array(first.getDay()).fill(null);
    const monthCols = [];
    for (let d = new Date(first); d.getFullYear() === year; d.setDate(d.getDate() + 1)) {
      if (d.getDate() === 1) monthCols.push({ m: d.getMonth(), col: Math.floor(cells.length / 7) });
      cells.push(new Date(d));
    }
    return { cells, cols: Math.ceil(cells.length / 7), monthCols };
  }, [year]);

  const monthBlocks = useMemo(() => Array.from({ length: 12 }, (_, m) => {
    const lead = new Date(year, m, 1).getDay();
    const n = new Date(year, m + 1, 0).getDate();
    return { m, cells: [...Array(lead).fill(null), ...Array.from({ length: n }, (_, i) => new Date(year, m, i + 1))] };
  }), [year]);

  const renderCell = (d, i) => {
    if (!d) return <i key={i} className="size-[15px]" />;
    const k = fmt(d), v = log[k] || 0, future = d > today && k !== todayKey;
    return (
      <button
        key={i}
        disabled={future}
        onClick={() => onCycle(k)}
        title={`${d.toDateString()} · ${LABEL[v]}`}
        aria-label={`${d.toDateString()}: ${LABEL[v]}`}
        className={`${cellCls(v)} relative cursor-pointer enabled:hover:z-10 enabled:hover:scale-125 disabled:cursor-default disabled:opacity-35 ${k === todayKey ? "outline-2 outline-offset-2 outline-ink" : ""}`}
      />
    );
  };

  const colStyle = { gridTemplateColumns: `repeat(${cols}, 15px)` };

  if (view === "months") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-4 gap-y-5 p-1">
        {monthBlocks.map(({ m, cells: mc }) => (
          <div key={m}>
            <h3 className="mb-2 font-display text-lg font-normal text-rust">{MONTHS[m]}</h3>
            <div className="grid grid-cols-[repeat(7,15px)] gap-1">{mc.map(renderCell)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto px-1 pt-1 pb-3">
      <div className="mb-1.5 grid h-4 w-max gap-x-1 text-xs" style={colStyle}>
        {monthCols.map(({ m, col }) => (
          <span key={m} className="whitespace-nowrap" style={{ gridColumn: col + 1 }}>{MONTHS[m]}</span>
        ))}
      </div>
      <div className="grid w-max grid-flow-col gap-1" style={{ ...colStyle, gridTemplateRows: "repeat(7, 15px)" }}>
        {cells.map(renderCell)}
      </div>
    </div>
  );
}
