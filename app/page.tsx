'use client';

import { useEffect, useState } from 'react';

import { ProjectBoard } from '@/components/ProjectBoard';
import { ProjectCreator } from '@/components/ProjectCreator';
import { StudioDashboard } from '@/components/StudioDashboard';
import { TalentDatabase } from '@/components/TalentDatabase';
import { advanceWeek, createInitialGameState, createProject } from '@/lib/sim/core/engine';
import { clearSave, loadGame, saveGame } from '@/lib/storage/save';
import type { GameState, Genre, Motive } from '@/lib/sim/types';

export default function HomePage() {
  const [game, setGame] = useState<GameState>(() => createInitialGameState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setGame(loadGame());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveGame(game);
    }
  }, [game, hydrated]);

  const handleCreateProject = (payload: {
    title: string;
    genre: Genre;
    motive: Motive;
    directorId: string;
    writerId: string;
    producerId: string;
    actorIds: string[];
  }) => {
    setGame((prev) => createProject(prev, payload));
  };

  const handleAdvanceWeek = () => {
    setGame((prev) => advanceWeek(prev));
  };

  const handleReset = () => {
    setGame(clearSave());
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Movie Studio Sim — Milestone 1</h1>
      <StudioDashboard studio={game.studio} />
      <div className="flex flex-wrap gap-3">
        <button className="rounded bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500" onClick={handleAdvanceWeek}>
          Advance 1 Week
        </button>
        <button className="rounded bg-rose-700 px-4 py-2 font-medium hover:bg-rose-600" onClick={handleReset}>
          Reset Save
        </button>
      </div>
      <ProjectCreator talentPool={game.talentPool} onCreateProject={handleCreateProject} />
      <ProjectBoard projects={game.projects} />
      <TalentDatabase talentPool={game.talentPool} />
    </main>
  );
}
