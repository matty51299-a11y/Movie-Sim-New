'use client';

import { useEffect, useMemo, useState } from 'react';

import { advanceWeek, createInitialGameState, createProject } from '@/lib/sim/core/engine';
import { clearSave, loadGame, saveGame } from '@/lib/storage/save';
import type { FilmProject, GameState, Genre, Motive, Talent } from '@/lib/sim/types';

const GENRES: Genre[] = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror'];
const MOTIVES: Motive[] = ['Prestige', 'Profit', 'Franchise', 'Passion'];

const roleFilter = (pool: Talent[], role: Talent['roleType']) => pool.filter((person) => person.roleType === role);

function PopupWindow({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="retro-overlay">
      <div className="retro-popup">
        <header className="retro-popup-title">
          <span>{title}</span>
          <button onClick={onClose}>×</button>
        </header>
        <div className="retro-popup-body">{children}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [game, setGame] = useState<GameState>(() => createInitialGameState());
  const [hydrated, setHydrated] = useState(false);
  const [activeModal, setActiveModal] = useState<'script' | 'production' | 'review' | null>(null);

  const directors = useMemo(() => roleFilter(game.talentPool, 'Director'), [game.talentPool]);
  const writers = useMemo(() => roleFilter(game.talentPool, 'Writer'), [game.talentPool]);
  const producers = useMemo(() => roleFilter(game.talentPool, 'Producer'), [game.talentPool]);
  const actors = useMemo(() => roleFilter(game.talentPool, 'Actor'), [game.talentPool]);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<Genre>('Drama');
  const [motive, setMotive] = useState<Motive>('Profit');
  const [directorId, setDirectorId] = useState('');
  const [writerId, setWriterId] = useState('');
  const [producerId, setProducerId] = useState('');
  const [actorIds, setActorIds] = useState<string[]>([]);

  useEffect(() => {
    setGame(loadGame());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!directorId && directors[0]) setDirectorId(directors[0].id);
    if (!writerId && writers[0]) setWriterId(writers[0].id);
    if (!producerId && producers[0]) setProducerId(producers[0].id);
  }, [directors, writers, producers, directorId, writerId, producerId]);

  useEffect(() => {
    if (hydrated) saveGame(game);
  }, [game, hydrated]);

  const toggleActor = (id: string) => {
    setActorIds((prev) => (prev.includes(id) ? prev.filter((actorId) => actorId !== id) : [...prev, id]));
  };

  const handleCreateProject = () => {
    if (!title.trim() || !directorId || !writerId || !producerId || actorIds.length === 0) return;

    setGame((prev) =>
      createProject(prev, {
        title: title.trim(),
        genre,
        motive,
        directorId,
        writerId,
        producerId,
        actorIds,
      })
    );
    setTitle('');
    setActorIds([]);
    setActiveModal(null);
  };

  const selectedReleased = [...game.projects].reverse().find((project) => project.stage === 'Released');

  return (
    <main className="retro-page">
      <section className="retro-window">
        <header className="retro-titlebar">
          <span>🎬 Movie Business 2026.0.1 : Party game</span>
          <span className="retro-week">week {game.studio.week}</span>
        </header>

        <div className="retro-toolbar">
          <div className="retro-chip">{game.studio.name}</div>
          <div className="retro-chip">$ {game.studio.cash.toLocaleString()}</div>
          <button className="retro-small-btn" onClick={() => setGame((prev) => advanceWeek(prev))}>
            Next month / week
          </button>
          <button className="retro-small-btn" onClick={() => setGame(clearSave())}>
            Reset save
          </button>
        </div>

        <div className="retro-content">
          <div className="retro-table-area">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Stage</th>
                  <th>Attendance (week)</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {game.projects.map((project, index) => {
                  const latest =
                    project.stage === 'Released' && project.weeklyBoxOffice && project.revealedWeeks > 0
                      ? project.weeklyBoxOffice[project.revealedWeeks - 1]
                      : 0;
                  return (
                    <tr key={project.id}>
                      <td>{index + 1}</td>
                      <td>{project.title}</td>
                      <td>{project.stage}</td>
                      <td>{latest.toLocaleString()}</td>
                      <td>{project.rating ?? '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <aside className="retro-sidebar">
            <button onClick={() => setActiveModal('script')}>Scripts (1 / 1)</button>
            <button onClick={() => setActiveModal('production')}>Film Production (1 / 1)</button>
            <button onClick={() => setActiveModal('review')}>Reviews</button>
            <button disabled>Bank</button>
            <button disabled>Advertising</button>
            <button disabled>Festivals</button>
            <button disabled>Investments</button>
          </aside>
        </div>
      </section>

      {activeModal === 'script' ? (
        <PopupWindow title="Creating a script" onClose={() => setActiveModal(null)}>
          <div className="retro-form-grid">
            <label>Title</label>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="New Moon Rising" />

            <label>Genre</label>
            <select value={genre} onChange={(event) => setGenre(event.target.value as Genre)}>
              {GENRES.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>

            <label>Motive</label>
            <select value={motive} onChange={(event) => setMotive(event.target.value as Motive)}>
              {MOTIVES.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>

            <label>Director</label>
            <select value={directorId} onChange={(event) => setDirectorId(event.target.value)}>
              {directors.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>

            <label>Writer</label>
            <select value={writerId} onChange={(event) => setWriterId(event.target.value)}>
              {writers.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>

            <label>Producer</label>
            <select value={producerId} onChange={(event) => setProducerId(event.target.value)}>
              {producers.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="retro-cast-box">
            <legend>Creators / Cast</legend>
            <div>
              {actors.map((actor) => (
                <label key={actor.id}>
                  <input type="checkbox" checked={actorIds.includes(actor.id)} onChange={() => toggleActor(actor.id)} /> {actor.name}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="retro-actions">
            <button onClick={handleCreateProject}>OK</button>
            <button onClick={() => setActiveModal(null)}>Cancel</button>
          </div>
        </PopupWindow>
      ) : null}

      {activeModal === 'production' ? (
        <PopupWindow title="Production / Casting" onClose={() => setActiveModal(null)}>
          <p className="retro-muted">Current projects and team status</p>
          <table className="retro-mini-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Script</th>
                <th>Production</th>
                <th>Budget Spent</th>
              </tr>
            </thead>
            <tbody>
              {game.projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.scriptProgress}%</td>
                  <td>{project.productionProgress}%</td>
                  <td>${project.budgetSpent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PopupWindow>
      ) : null}

      {activeModal === 'review' && selectedReleased ? (
        <PopupWindow title={`Review: ${selectedReleased.title}`} onClose={() => setActiveModal(null)}>
          <div className="retro-review">
            <section>
              <p>
                The project <strong>{selectedReleased.title}</strong> delivered a rating of{' '}
                <strong>{selectedReleased.rating}</strong> with a {selectedReleased.genre} tone and {selectedReleased.motive.toLowerCase()} motive.
              </p>
            </section>
            <section>
              <h3>Weekly Box Office</h3>
              <ul>
                {(selectedReleased.weeklyBoxOffice ?? []).slice(0, selectedReleased.revealedWeeks).map((gross, idx) => (
                  <li key={`${selectedReleased.id}-${idx}`}>Week {idx + 1}: ${gross.toLocaleString()}</li>
                ))}
              </ul>
            </section>
          </div>
        </PopupWindow>
      ) : null}
    </main>
  );
}
