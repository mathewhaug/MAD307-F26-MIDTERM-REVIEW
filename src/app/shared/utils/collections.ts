/**
 * Adds up one numeric value from every item in a list.
 *
 * @typeParam T The type of each item. It is inferred from `items`, so `pick`
 *   gets full autocomplete on the item without any annotation.
 *
 * @example sumBy(trails, t => t.distanceKm)
 */
export function sumBy<T>(items: readonly T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0);
}

/**
 * Counts how many items fall under each key.
 *
 * @typeParam T The type of each item in the list.
 * @typeParam K The set of allowed keys. `K extends string` means K must be a
 *   string type, usually a union such as Difficulty. Because every key is
 *   passed in `keys`, each one starts at 0 and the result is a complete
 *   `Record<K, number>`: no key is ever missing.
 *
 * @example countBy(trails, t => t.difficulty, DIFFICULTIES)
 *   // { easy: 3, moderate: 3, hard: 2 }
 */
export function countBy<T, K extends string>(
  items: readonly T[],
  key: (item: T) => K,
  keys: readonly K[],
): Record<K, number> {
  // Object.fromEntries returns a loosely typed object. The assertion is safe
  // because we have just created an entry for every key in K.
  const counts = Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
  for (const item of items) {
    counts[key(item)] += 1;
  }
  return counts;
}
