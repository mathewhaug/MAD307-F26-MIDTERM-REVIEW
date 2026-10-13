// Union types: a Difficulty can only ever be one of these three strings.
export type Difficulty = 'easy' | 'moderate' | 'hard';
export type Surface = 'paved' | 'gravel' | 'dirt' | 'rock';

export interface Trail {
  readonly id: number;
  name: string;
  region: string;
  distanceKm: number;
  elevationGainM: number;
  difficulty: Difficulty;
  surface: Surface;
  dogFriendly: boolean;
  description?: string;
}

// A runtime list of every Difficulty. The type above disappears after
// compilation, so templates and loops need a real array to iterate over.
export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'moderate', 'hard'];

// Type guard: if this returns true, TypeScript narrows `value` to Difficulty.
// Use it to turn an untyped string (such as a <select> value) into a safe type.
export function isDifficulty(value: string): value is Difficulty {
  return DIFFICULTIES.some((difficulty) => difficulty === value);
}
