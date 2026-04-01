import type { FilmProject, Talent } from '@/lib/sim/types';

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export const getTalentById = (talentPool: Talent[], id: string): Talent | undefined =>
  talentPool.find((person) => person.id === id);

export const getProjectTeam = (project: FilmProject, talentPool: Talent[]): Talent[] => {
  const crewIds = [
    project.assignedCrew.directorId,
    project.assignedCrew.writerId,
    project.assignedCrew.producerId,
  ];

  return [...crewIds, ...project.assignedCast.actorIds]
    .map((id) => getTalentById(talentPool, id))
    .filter((person): person is Talent => Boolean(person));
};

export const calcTeamAverages = (project: FilmProject, talentPool: Talent[]) => {
  const team = getProjectTeam(project, talentPool);
  if (team.length === 0) {
    return { skill: 0, fame: 0, weeklyCost: 0 };
  }

  const skill = team.reduce((sum, person) => sum + person.skill, 0) / team.length;
  const fame = team.reduce((sum, person) => sum + person.fame, 0) / team.length;
  const weeklyCost = team.reduce((sum, person) => sum + person.weeklyCost, 0);

  return { skill, fame, weeklyCost };
};

export const calcFinalRating = (project: FilmProject, talentPool: Talent[]): number => {
  const { skill, fame } = calcTeamAverages(project, talentPool);
  const base = skill * 0.7 + fame * 0.25 + Math.random() * 10;
  return clamp(Number(base.toFixed(1)), 10, 99);
};

export const calcWeeklyBoxOffice = (rating: number, fame: number): number[] => {
  const opening = Math.max(120_000, Math.round((rating * 14000 + fame * 9000) * (0.85 + Math.random() * 0.35)));
  const week2 = Math.round(opening * (0.55 + Math.random() * 0.12));
  const week3 = Math.round(week2 * (0.58 + Math.random() * 0.15));
  const week4 = Math.round(week3 * (0.6 + Math.random() * 0.2));
  const week5 = Math.round(week4 * (0.6 + Math.random() * 0.2));
  const week6 = Math.round(week5 * (0.6 + Math.random() * 0.2));

  return [opening, week2, week3, week4, week5, week6];
};
