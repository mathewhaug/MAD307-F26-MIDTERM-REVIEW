import { InjectionToken } from '@angular/core';

// A token whose value is a function. Each call returns the next hike id.
export const HIKE_ID = new InjectionToken<() => number>('trailhead.hikeId');

// Used with useFactory in app.config.ts. Angular calls this once, and the
// closure keeps `next` private between calls.
export function hikeIdFactory(): () => number {
  let next = 1;
  return () => next++;
}
