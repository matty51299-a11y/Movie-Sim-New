import type { Studio } from '@/lib/sim/types';

export function StudioDashboard({ studio }: { studio: Studio }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">Studio Dashboard</h2>
      <div className="grid gap-2 text-sm sm:grid-cols-3">
        <p>
          Week: <span className="font-semibold">{studio.week}</span>
        </p>
        <p>
          Studio: <span className="font-semibold">{studio.name}</span>
        </p>
        <p>
          Cash: <span className="font-semibold">${studio.cash.toLocaleString()}</span>
        </p>
      </div>
    </section>
  );
}
