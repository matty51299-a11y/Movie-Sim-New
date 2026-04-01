import { INITIAL_TALENT } from '@/lib/sim/data/talent';
import { PRODUCTION_TARGET, SCRIPT_TARGET, STARTING_CASH } from '@/lib/sim/core/constants';
import { calcFinalRating, calcTeamAverages, calcWeeklyBoxOffice } from '@/lib/sim/core/scoring';
import type { FilmProject, GameState, Genre, Motive } from '@/lib/sim/types';

const now = (): string => new Date().toISOString();

export const createInitialGameState = (): GameState => ({
  studio: {
    name: 'Indie Spark Studios',
    cash: STARTING_CASH,
    week: 1,
  },
  talentPool: INITIAL_TALENT,
  projects: [],
  createdAt: now(),
  updatedAt: now(),
});

export const createProject = (
  state: GameState,
  payload: {
    title: string;
    genre: Genre;
    motive: Motive;
    directorId: string;
    writerId: string;
    producerId: string;
    actorIds: string[];
  }
): GameState => {
  const project: FilmProject = {
    id: `proj-${crypto.randomUUID()}`,
    title: payload.title,
    genre: payload.genre,
    motive: payload.motive,
    stage: 'Script',
    scriptProgress: 0,
    productionProgress: 0,
    developmentWeeks: 0,
    productionWeeks: 0,
    assignedCrew: {
      directorId: payload.directorId,
      writerId: payload.writerId,
      producerId: payload.producerId,
    },
    assignedCast: { actorIds: payload.actorIds },
    budgetSpent: 0,
    revealedWeeks: 0,
    isComplete: false,
  };

  return { ...state, projects: [...state.projects, project], updatedAt: now() };
};

const simulateProjectWeek = (project: FilmProject, talentPool: GameState['talentPool']) => {
  if (project.isComplete) {
    return project;
  }

  const { skill, fame, weeklyCost } = calcTeamAverages(project, talentPool);
  const updated = { ...project };

  if (updated.stage === 'Script') {
    updated.scriptProgress = Math.min(
      SCRIPT_TARGET,
      updated.scriptProgress + Math.round(skill * 0.14 + Math.random() * 6)
    );
    updated.developmentWeeks += 1;
    updated.budgetSpent += weeklyCost;

    if (updated.scriptProgress >= SCRIPT_TARGET) {
      updated.stage = 'Production';
    }

    return updated;
  }

  if (updated.stage === 'Production') {
    updated.productionProgress = Math.min(
      PRODUCTION_TARGET,
      updated.productionProgress + Math.round(skill * 0.11 + Math.random() * 7)
    );
    updated.productionWeeks += 1;
    updated.budgetSpent += weeklyCost * 1.3;

    if (updated.productionProgress >= PRODUCTION_TARGET) {
      const rating = calcFinalRating(updated, talentPool);
      const weeklyBoxOffice = calcWeeklyBoxOffice(rating, fame);

      updated.stage = 'Released';
      updated.rating = rating;
      updated.weeklyBoxOffice = weeklyBoxOffice;
      updated.totalBoxOffice = weeklyBoxOffice.reduce((sum, amount) => sum + amount, 0);
      updated.revealedWeeks = 1;
    }

    return updated;
  }

  if (updated.stage === 'Released' && updated.weeklyBoxOffice) {
    updated.revealedWeeks = Math.min(updated.revealedWeeks + 1, updated.weeklyBoxOffice.length);

    if (updated.revealedWeeks >= updated.weeklyBoxOffice.length) {
      updated.isComplete = true;
    }
  }

  return updated;
};

export const advanceWeek = (state: GameState): GameState => {
  const updatedProjects = state.projects.map((project) => simulateProjectWeek(project, state.talentPool));

  const weeklyRevenue = updatedProjects
    .filter((project) => project.stage === 'Released' && project.weeklyBoxOffice)
    .reduce((sum, project) => {
      if (!project.weeklyBoxOffice || project.revealedWeeks === 0) return sum;
      const latestWeekIndex = project.revealedWeeks - 1;
      return sum + (project.weeklyBoxOffice[latestWeekIndex] ?? 0);
    }, 0);

  const weeklyCosts = updatedProjects.reduce((sum, project) => {
    if (project.isComplete) {
      return sum;
    }

    const { weeklyCost } = calcTeamAverages(project, state.talentPool);
    return sum + (project.stage === 'Production' ? weeklyCost * 1.3 : weeklyCost);
  }, 0);

  return {
    ...state,
    studio: {
      ...state.studio,
      week: state.studio.week + 1,
      cash: Math.round(state.studio.cash + weeklyRevenue - weeklyCosts),
    },
    projects: updatedProjects,
    updatedAt: now(),
  };
};
