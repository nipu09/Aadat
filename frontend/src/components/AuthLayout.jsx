import LoopVideo from "./LoopVideo.jsx";

// The card shell shared by the login and verify-email pages.
export default function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-6">
      <section className="grid w-full max-w-215 border-[3px] border-ink bg-card shadow-hard-lg md:grid-cols-2">
        <aside className="hidden flex-col justify-center gap-3.5 border-r-[3px] border-ink bg-ink p-5 text-paper md:flex">
          <LoopVideo
            name="medi"
            className="h-auto w-full border-[3px] border-paper2 [image-rendering:pixelated]"
          />
          <p className="text-center font-display text-[22px]">Small days, stacked up.</p>
        </aside>
        {children}
      </section>
    </main>
  );
}
