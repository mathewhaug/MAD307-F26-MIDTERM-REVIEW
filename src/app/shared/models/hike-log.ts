import { Trail } from './trail';

export interface HikeLog {
  readonly id: number;
  trailId: number;
  date: string; //ISO date, yyyy-mm-dd
  minutes: number;
  notes?: string;
}

//Intersection type: a Trail plus how many times it has been hiked.
export type LoggedTrail = Trail & { timesHiked: number };
