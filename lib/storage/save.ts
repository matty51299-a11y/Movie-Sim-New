import { z } from 'zod';

import { createInitialGameState } from '@/lib/sim/core/engine';
import type { GameState } from '@/lib/sim/types';

const STORAGE_KEY = 'movie_sim_m1_save';

const gameStateSchema = z.object({
  studio: z.object({
    name: z.string(),
    cash: z.number(),
    week: z.number(),
  }),
  talentPool: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      roleType: z.enum(['Actor', 'Director', 'Writer', 'Producer']),
      skill: z.number(),
      fame: z.number(),
      weeklyCost: z.number(),
    })
  ),
  projects: z.array(z.any()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const loadGame = (): GameState => {
  if (typeof window === 'undefined') {
    return createInitialGameState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createInitialGameState();
  }

  const parsed = gameStateSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    return createInitialGameState();
  }

  return parsed.data as GameState;
};

export const saveGame = (state: GameState): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearSave = (): GameState => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return createInitialGameState();
};
