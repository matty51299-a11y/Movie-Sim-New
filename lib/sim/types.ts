export type Genre = 'Action' | 'Drama' | 'Comedy' | 'Thriller' | 'Sci-Fi' | 'Horror';

export type Motive = 'Prestige' | 'Profit' | 'Franchise' | 'Passion';

export type RoleType = 'Actor' | 'Director' | 'Writer' | 'Producer';

export type ProjectStage = 'Script' | 'Production' | 'Released';

export interface Talent {
  id: string;
  name: string;
  roleType: RoleType;
  skill: number;
  fame: number;
  weeklyCost: number;
}

export interface CrewAssignment {
  directorId: string;
  writerId: string;
  producerId: string;
}

export interface CastAssignment {
  actorIds: string[];
}

export interface FilmProject {
  id: string;
  title: string;
  genre: Genre;
  motive: Motive;
  stage: ProjectStage;
  scriptProgress: number;
  productionProgress: number;
  developmentWeeks: number;
  productionWeeks: number;
  assignedCrew: CrewAssignment;
  assignedCast: CastAssignment;
  budgetSpent: number;
  rating?: number;
  totalBoxOffice?: number;
  weeklyBoxOffice?: number[];
  revealedWeeks: number;
  isComplete: boolean;
}

export interface Studio {
  name: string;
  cash: number;
  week: number;
}

export interface GameState {
  studio: Studio;
  talentPool: Talent[];
  projects: FilmProject[];
  createdAt: string;
  updatedAt: string;
}
