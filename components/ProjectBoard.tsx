import type { FilmProject } from '@/lib/sim/types';

export function ProjectBoard({ projects }: { projects: FilmProject[] }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-sm text-slate-400">No projects yet. Create your first movie.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <article key={project.id} className="rounded border border-slate-800 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{project.title}</h3>
                <span className="rounded bg-slate-800 px-2 py-1">{project.stage}</span>
              </div>
              <p className="mt-2 text-slate-300">
                {project.genre} • {project.motive} • Budget Spent: ${project.budgetSpent.toLocaleString()}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <p>Script: {project.scriptProgress}%</p>
                <p>Production: {project.productionProgress}%</p>
              </div>
              {project.stage === 'Released' && project.weeklyBoxOffice ? (
                <div className="mt-3 rounded bg-slate-950 p-2">
                  <p>Rating: {project.rating}</p>
                  <p>Total Box Office (forecast): ${project.totalBoxOffice?.toLocaleString()}</p>
                  <p className="mt-1 font-medium">Weekly reveal:</p>
                  <ul className="list-inside list-disc">
                    {project.weeklyBoxOffice.slice(0, project.revealedWeeks).map((gross, index) => (
                      <li key={`${project.id}-week-${index}`}>Week {index + 1}: ${gross.toLocaleString()}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
