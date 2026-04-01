'use client';

import { useMemo, useState } from 'react';

import type { Genre, Motive, RoleType, Talent } from '@/lib/sim/types';

const GENRES: Genre[] = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror'];
const MOTIVES: Motive[] = ['Prestige', 'Profit', 'Franchise', 'Passion'];

interface ProjectCreatorProps {
  talentPool: Talent[];
  onCreateProject: (payload: {
    title: string;
    genre: Genre;
    motive: Motive;
    directorId: string;
    writerId: string;
    producerId: string;
    actorIds: string[];
  }) => void;
}

const byRole = (talentPool: Talent[], role: RoleType): Talent[] => talentPool.filter((person) => person.roleType === role);

export function ProjectCreator({ talentPool, onCreateProject }: ProjectCreatorProps) {
  const directors = useMemo(() => byRole(talentPool, 'Director'), [talentPool]);
  const writers = useMemo(() => byRole(talentPool, 'Writer'), [talentPool]);
  const producers = useMemo(() => byRole(talentPool, 'Producer'), [talentPool]);
  const actors = useMemo(() => byRole(talentPool, 'Actor'), [talentPool]);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<Genre>('Drama');
  const [motive, setMotive] = useState<Motive>('Profit');
  const [directorId, setDirectorId] = useState(directors[0]?.id ?? '');
  const [writerId, setWriterId] = useState(writers[0]?.id ?? '');
  const [producerId, setProducerId] = useState(producers[0]?.id ?? '');
  const [actorIds, setActorIds] = useState<string[]>([]);

  const toggleActor = (id: string) => {
    setActorIds((prev) => (prev.includes(id) ? prev.filter((actorId) => actorId !== id) : [...prev, id]));
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !directorId || !writerId || !producerId || actorIds.length === 0) {
      return;
    }

    onCreateProject({ title: title.trim(), genre, motive, directorId, writerId, producerId, actorIds });
    setTitle('');
    setActorIds([]);
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">Create Film Project</h2>
      <form className="grid gap-3" onSubmit={handleCreate}>
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          value={title}
          placeholder="Film title"
          onChange={(event) => setTitle(event.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={genre} onChange={(e) => setGenre(e.target.value as Genre)}>
            {GENRES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={motive} onChange={(e) => setMotive(e.target.value as Motive)}>
            {MOTIVES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={directorId} onChange={(e) => setDirectorId(e.target.value)}>
            {directors.map((person) => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </select>
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={writerId} onChange={(e) => setWriterId(e.target.value)}>
            {writers.map((person) => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </select>
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={producerId} onChange={(e) => setProducerId(e.target.value)}>
            {producers.map((person) => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </select>
        </div>
        <fieldset className="rounded border border-slate-800 p-3">
          <legend className="px-1 text-sm text-slate-300">Select Cast</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {actors.map((actor) => (
              <label key={actor.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={actorIds.includes(actor.id)} onChange={() => toggleActor(actor.id)} />
                <span>{actor.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button className="rounded bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400" type="submit">
          Create Project
        </button>
      </form>
    </section>
  );
}
