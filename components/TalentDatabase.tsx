import type { Talent } from '@/lib/sim/types';

export function TalentDatabase({ talentPool }: { talentPool: Talent[] }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">Talent Database</h2>
      <div className="overflow-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="text-slate-300">
              <th className="pb-2">Name</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Skill</th>
              <th className="pb-2">Fame</th>
              <th className="pb-2">Weekly Cost</th>
            </tr>
          </thead>
          <tbody>
            {talentPool.map((person) => (
              <tr key={person.id} className="border-t border-slate-800">
                <td className="py-2">{person.name}</td>
                <td>{person.roleType}</td>
                <td>{person.skill}</td>
                <td>{person.fame}</td>
                <td>${person.weeklyCost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
